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
 */
export function extractUniqueSKUs(orderSummary: any): string[] {
  const skuSet = new Set<string>()
  
  // Get SKUs from participant orders
  if (orderSummary.participantOrders) {
    orderSummary.participantOrders.forEach((order: any) => {
      if (order.skus && Array.isArray(order.skus)) {
        order.skus.forEach((sku: string) => skuSet.add(sku))
      }
    })
  }
  
  // Get SKUs from host order
  if (orderSummary.hostOrder && orderSummary.hostOrder.skus) {
    orderSummary.hostOrder.skus.forEach((sku: string) => skuSet.add(sku))
  }
  
  // Get SKUs from extra orders
  if (orderSummary.extraOrders) {
    orderSummary.extraOrders.forEach((order: any) => {
      if (order.skus && Array.isArray(order.skus)) {
        order.skus.forEach((sku: string) => skuSet.add(sku))
      }
    })
  }
  
  return Array.from(skuSet).sort()
}

/**
 * Get workflow-specific orders grouped by type
 */
export function groupOrdersByWorkflow(orderSummary: any) {
  const groups: {
    workflow: string
    orders: Array<{
      orderNumber: string
      recipient: string
      skus: string[]
    }>
  }[] = []
  
  // Participant orders
  if (orderSummary.participantOrders && orderSummary.participantOrders.length > 0) {
    groups.push({
      workflow: 'Participant Orders',
      orders: orderSummary.participantOrders.map((order: any) => ({
        orderNumber: order.orderNumber || order.orderId || 'N/A',
        recipient: order.participantName || order.recipient || 'Unknown',
        skus: order.skus || []
      }))
    })
  }
  
  // Host order
  if (orderSummary.hostOrder) {
    groups.push({
      workflow: 'Host Order',
      orders: [{
        orderNumber: orderSummary.hostOrder.orderNumber || orderSummary.hostOrder.orderId || 'N/A',
        recipient: orderSummary.hostOrder.hostName || 'Tour Host',
        skus: orderSummary.hostOrder.skus || []
      }]
    })
  }
  
  // Extra orders
  if (orderSummary.extraOrders && orderSummary.extraOrders.length > 0) {
    groups.push({
      workflow: 'Extra Demo Orders',
      orders: orderSummary.extraOrders.map((order: any) => ({
        orderNumber: order.orderNumber || order.orderId || 'N/A',
        recipient: order.recipient || 'Demo Customer',
        skus: order.skus || []
      }))
    })
  }
  
  return groups
}

