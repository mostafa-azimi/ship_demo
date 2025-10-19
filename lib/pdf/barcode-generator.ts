import JsBarcode from 'jsbarcode'
import { createCanvas } from 'canvas'

/**
 * Generate a barcode as a base64 data URL
 * Uses CODE128 format which is widely supported and scannable
 */
export function generateBarcodeBase64(sku: string): string {
  try {
    // Create a canvas for the barcode
    const canvas = createCanvas(400, 150) // Width x Height for good scannability
    
    // Generate barcode on canvas
    JsBarcode(canvas, sku, {
      format: 'CODE128',
      width: 3, // Bar width
      height: 100, // Bar height
      displayValue: false, // We'll show SKU separately
      margin: 10,
      background: '#ffffff',
      lineColor: '#000000',
    })
    
    // Convert to base64
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error(`Error generating barcode for SKU ${sku}:`, error)
    // Return a placeholder if barcode generation fails
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

