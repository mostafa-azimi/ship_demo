import bwipjs from 'bwip-js'

/**
 * Generate a barcode as a base64 data URL
 * Uses CODE128 format which is widely supported and scannable
 * 
 * Uses bwip-js which is pure JavaScript (no native dependencies)
 */
export async function generateBarcodeBase64(sku: string): Promise<string> {
  try {
    // Generate barcode using bwip-js (pure JavaScript, works in Vercel)
    const png = await bwipjs.toBuffer({
      bcid: 'code128',       // Barcode type
      text: sku,             // Text to encode
      scale: 3,              // 3x scaling factor
      height: 15,            // Bar height, in millimeters
      width: 50,             // Bar width, in millimeters
      includetext: false,    // Don't show text below barcode (we'll add it separately)
      textxalign: 'center',  // Center the text
      backgroundcolor: 'ffffff',
      barcolor: '000000',
    })
    
    // Convert buffer to base64 data URL
    const base64 = png.toString('base64')
    return `data:image/png;base64,${base64}`
  } catch (error) {
    console.error(`Error generating barcode for SKU ${sku}:`, error)
    // Return empty string if barcode generation fails
    return ''
  }
}

/**
 * Extract unique SKUs from order summary
 * Works with actual order_summary structure: { sales_orders, purchase_orders }
 */
export function extractUniqueSKUs(orderSummary: any): string[] {
  console.log('📊 Extracting SKUs from order summary:', orderSummary)
  const skuSet = new Set<string>()
  
  // Extract from sales orders
  if (orderSummary.sales_orders && Array.isArray(orderSummary.sales_orders)) {
    orderSummary.sales_orders.forEach((order: any) => {
      if (order.skus && Array.isArray(order.skus)) {
        order.skus.forEach((sku: string) => skuSet.add(sku))
      }
    })
  }
  
  // Extract from purchase orders
  if (orderSummary.purchase_orders && Array.isArray(orderSummary.purchase_orders)) {
    orderSummary.purchase_orders.forEach((order: any) => {
      if (order.skus && Array.isArray(order.skus)) {
        order.skus.forEach((sku: string) => skuSet.add(sku))
      }
    })
  }
  
  console.log(`✅ Extracted ${skuSet.size} unique SKUs`)
  return Array.from(skuSet).sort()
}

/**
 * Get workflow-specific orders grouped by type
 * Works with actual structure: { sales_orders: [...], purchase_orders: [...] }
 */
export function groupOrdersByWorkflow(orderSummary: any) {
  console.log('📊 Grouping orders by workflow:', orderSummary)
  
  const groups: {
    workflow: string
    orders: Array<{
      orderNumber: string
      recipient: string
      skus: string[]
    }>
  }[] = []
  
  // Group sales orders by workflow
  if (orderSummary.sales_orders && orderSummary.sales_orders.length > 0) {
    const salesByWorkflow: Record<string, any[]> = {}
    
    orderSummary.sales_orders.forEach((order: any) => {
      const workflow = order.workflow || 'Unknown'
      if (!salesByWorkflow[workflow]) {
        salesByWorkflow[workflow] = []
      }
      salesByWorkflow[workflow].push({
        orderNumber: order.order_number,
        recipient: order.recipient || 'Unknown',
        skus: order.skus || []
      })
    })
    
    // Add each workflow group
    Object.entries(salesByWorkflow).forEach(([workflow, orders]) => {
      groups.push({
        workflow: `Sales Orders - ${workflow}`,
        orders
      })
    })
  }
  
  // Group purchase orders by workflow
  if (orderSummary.purchase_orders && orderSummary.purchase_orders.length > 0) {
    const poByWorkflow: Record<string, any[]> = {}
    
    orderSummary.purchase_orders.forEach((order: any) => {
      const workflow = order.workflow || 'Unknown'
      if (!poByWorkflow[workflow]) {
        poByWorkflow[workflow] = []
      }
      poByWorkflow[workflow].push({
        orderNumber: order.po_number,
        recipient: 'Purchase Order',
        skus: order.skus || []
      })
    })
    
    // Add each workflow group
    Object.entries(poByWorkflow).forEach(([workflow, orders]) => {
      groups.push({
        workflow: `Purchase Orders - ${workflow}`,
        orders
      })
    })
  }
  
  console.log(`✅ Grouped into ${groups.length} workflow groups`)
  return groups
}

