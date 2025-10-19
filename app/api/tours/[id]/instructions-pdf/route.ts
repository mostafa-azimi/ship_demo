import { NextRequest, NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { TourInstructionsPDF } from '@/lib/pdf/tour-instructions-pdf'
import { generateBarcodeBase64, extractUniqueSKUs, groupOrdersByWorkflow } from '@/lib/pdf/barcode-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tourId = params.id

    // Fetch tour data from Supabase
    const supabase = await createClient()
    const { data: tourData, error } = await supabase
      .from('tours')
      .select(`
        id,
        tour_numeric_id,
        date,
        time,
        status,
        order_summary,
        warehouse:warehouses(id, name, code, address, city, state, zip),
        host:team_members(id, first_name, last_name, email),
        participants:tour_participants(id, first_name, last_name, email, company)
      `)
      .eq('id', tourId)
      .single()

    if (error || !tourData) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      )
    }

    // Check if tour has been finalized
    if (!tourData.order_summary) {
      return NextResponse.json(
        { error: 'Tour has not been finalized yet. Please finalize the tour to generate instructions.' },
        { status: 400 }
      )
    }

    // Extract unique SKUs from order summary
    const uniqueSKUs = extractUniqueSKUs(tourData.order_summary)
    
    // Generate barcodes for each unique SKU
    console.log(`📊 Generating barcodes for ${uniqueSKUs.length} unique SKUs...`)
    const barcodes = await Promise.all(
      uniqueSKUs.map(async (sku) => {
        const dataUrl = await generateBarcodeBase64(sku)
        
        // Count how many orders use this SKU
        let usageCount = 0
        if (tourData.order_summary.participantOrders) {
          tourData.order_summary.participantOrders.forEach((order: any) => {
            if (order.skus && order.skus.includes(sku)) usageCount++
          })
        }
        if (tourData.order_summary.hostOrder && tourData.order_summary.hostOrder.skus) {
          if (tourData.order_summary.hostOrder.skus.includes(sku)) usageCount++
        }
        if (tourData.order_summary.extraOrders) {
          tourData.order_summary.extraOrders.forEach((order: any) => {
            if (order.skus && order.skus.includes(sku)) usageCount++
          })
        }
        
        return {
          sku,
          dataUrl,
          usageCount
        }
      })
    )

    // Group orders by workflow
    const orderGroups = groupOrdersByWorkflow(tourData.order_summary)

    // Generate PDF
    console.log(`📄 Generating PDF for Tour #${tourData.tour_numeric_id}...`)
    const pdfStream = await renderToStream(
      TourInstructionsPDF({
        tourData: tourData as any,
        orderGroups,
        barcodes,
      })
    )

    // Convert stream to buffer for response
    const chunks: Uint8Array[] = []
    for await (const chunk of pdfStream) {
      chunks.push(chunk)
    }
    const pdfBuffer = Buffer.concat(chunks)

    console.log(`✅ PDF generated successfully (${pdfBuffer.length} bytes)`)

    // Return PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Tour-${tourData.tour_numeric_id}-Instructions.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })

  } catch (error: any) {
    console.error('Error generating tour instructions PDF:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

