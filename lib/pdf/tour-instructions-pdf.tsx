import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 4,
    color: '#333',
  },
  section: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderLeft: 4,
    borderLeftColor: '#328FD',
  },
  orderGroup: {
    marginBottom: 15,
    paddingLeft: 10,
  },
  orderItem: {
    marginBottom: 8,
    paddingLeft: 5,
  },
  orderNumber: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  orderDetails: {
    fontSize: 9,
    color: '#555',
    marginTop: 2,
    paddingLeft: 15,
  },
  skuList: {
    fontSize: 9,
    color: '#666',
    marginTop: 2,
    paddingLeft: 15,
    fontFamily: 'Courier',
  },
  barcodeSection: {
    marginTop: 30,
  },
  barcodeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  barcodeItem: {
    width: '30%',
    marginBottom: 20,
    alignItems: 'center',
    border: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 4,
  },
  barcodeImage: {
    width: '100%',
    height: 60,
    objectFit: 'contain',
  },
  barcodeSku: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'Courier',
  },
  barcodeUsage: {
    fontSize: 7,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  summary: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  summaryText: {
    fontSize: 9,
    marginBottom: 3,
  },
})

interface TourInstructionsPDFProps {
  tourData: {
    tour_numeric_id: number
    date: string
    time: string
    warehouse: {
      name: string
      code?: string
    }
    host: {
      first_name: string
      last_name: string
    }
    participants: Array<{
      first_name: string
      last_name: string
      company?: string
    }>
    order_summary: any
  }
  orderGroups: Array<{
    workflow: string
    orders: Array<{
      orderNumber: string
      recipient: string
      skus: string[]
    }>
  }>
  barcodes: Array<{
    sku: string
    dataUrl: string
    usageCount: number
  }>
}

export const TourInstructionsPDF: React.FC<TourInstructionsPDFProps> = ({
  tourData,
  orderGroups,
  barcodes,
}) => {
  const formattedDate = tourData.date ? format(new Date(tourData.date), 'MMMM d, yyyy') : 'N/A'
  
  return (
    <Document>
      {/* Page 1: Tour Details and Order Groups */}
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>TOUR INSTRUCTIONS #{tourData.tour_numeric_id}</Text>
          <Text style={styles.subtitle}>Date: {formattedDate} at {tourData.time}</Text>
          <Text style={styles.subtitle}>
            Warehouse: {tourData.warehouse.name}
            {tourData.warehouse.code && ` (${tourData.warehouse.code})`}
          </Text>
          <Text style={styles.subtitle}>
            Host: {tourData.host.first_name} {tourData.host.last_name}
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            📊 Total Participants: {tourData.participants.length}
          </Text>
          <Text style={styles.summaryText}>
            📦 Total Orders: {tourData.order_summary?.totalOrders || 0}
          </Text>
          <Text style={styles.summaryText}>
            ✅ Successful: {tourData.order_summary?.successCount || 0}
          </Text>
          {tourData.order_summary?.failedCount > 0 && (
            <Text style={styles.summaryText}>
              ❌ Failed: {tourData.order_summary.failedCount}
            </Text>
          )}
        </View>

        {/* Order Groups */}
        {orderGroups.map((group, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.workflow.toUpperCase()}</Text>
            <View style={styles.orderGroup}>
              {group.orders.map((order, orderIndex) => (
                <View key={orderIndex} style={styles.orderItem}>
                  <Text style={styles.orderNumber}>
                    📦 Order #{order.orderNumber}
                  </Text>
                  <Text style={styles.orderDetails}>
                    → {order.recipient}
                  </Text>
                  <Text style={styles.skuList}>
                    SKUs: {order.skus.join(', ') || 'None'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleString()} | ShipBots Tour Management System
        </Text>
      </Page>

      {/* Page 2+: Barcode Reference Pages */}
      {barcodes.length > 0 && (
        <>
          {/* Split barcodes into pages of 15 each */}
          {Array.from({ length: Math.ceil(barcodes.length / 15) }, (_, pageIndex) => {
            const startIndex = pageIndex * 15
            const pageBarcodes = barcodes.slice(startIndex, startIndex + 15)
            
            return (
              <Page key={`barcode-page-${pageIndex}`} size="LETTER" style={styles.page}>
                <View style={styles.header}>
                  <Text style={styles.title}>
                    SKU BARCODES - SCAN REFERENCE
                    {barcodes.length > 15 && ` (Page ${pageIndex + 1} of ${Math.ceil(barcodes.length / 15)})`}
                  </Text>
                  <Text style={styles.subtitle}>
                    Use these barcodes to demonstrate scanning in ShipHero
                  </Text>
                </View>

                <View style={styles.barcodeGrid}>
                  {pageBarcodes.map((barcode, index) => (
                    <View key={index} style={styles.barcodeItem}>
                      {barcode.dataUrl && (
                        <Image 
                          src={barcode.dataUrl} 
                          style={styles.barcodeImage}
                        />
                      )}
                      <Text style={styles.barcodeSku}>{barcode.sku}</Text>
                      <Text style={styles.barcodeUsage}>
                        Used in {barcode.usageCount} order{barcode.usageCount !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.footer}>
                  Barcode Format: CODE128 | Optimized for scanning
                </Text>
              </Page>
            )
          })}
        </>
      )}
    </Document>
  )
}

