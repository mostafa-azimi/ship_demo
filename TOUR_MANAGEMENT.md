# Tour Management Documentation

## Overview
This document explains how tours are stored, managed, and canceled in the ShipBots application.

---

## ✅ Tour Storage - Persistent & Secure

### Tours ARE Stored Permanently

Tours are **permanently stored** in the Supabase database and will remain there indefinitely unless explicitly deleted. Here's how:

#### Database Schema
```sql
CREATE TABLE public.tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  host_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled',
  tour_numeric_id INTEGER UNIQUE,
  notes TEXT,
  selected_workflows JSONB,
  selected_skus TEXT[],
  workflow_config JSONB,
  order_summary JSONB,
  instruction_guide TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### Tour Status Values

| Status | Description |
|--------|-------------|
| `scheduled` | Tour is created but orders haven't been generated yet |
| `finalized` | Orders have been created in ShipHero |
| `cancelled` | Tour and/or orders have been cancelled (tour record remains) |

### When Tours Are Deleted

Tours are **ONLY** deleted when:

1. **Explicit Manual Deletion** via "Clear All Tours" button:
   - Requires **TWO confirmations**
   - Labeled as "FOR TESTING ONLY"
   - Found in: View Tours page

2. **Warehouse Deletion** (Cascade):
   ```sql
   warehouse_id REFERENCES warehouses(id) ON DELETE CASCADE
   ```
   - If a warehouse is deleted, all its tours are deleted
   - This protects referential integrity

3. **Host Deletion** (Does NOT delete tour):
   ```sql
   host_id REFERENCES team_members(id) ON DELETE SET NULL
   ```
   - If a host is deleted, the `host_id` is set to NULL
   - The tour record remains intact

### What's Stored in Tours

Each tour stores:
- ✅ **Basic info**: Date, time, warehouse, host, notes
- ✅ **Participants**: All attendees with contact info
- ✅ **Workflow configuration**: Which order types to create
- ✅ **Selected SKUs**: Products for the tour
- ✅ **Order summary**: Complete record of all created orders
  - Order numbers
  - ShipHero IDs
  - Recipient information
  - Success/failure status
- ✅ **Creation timestamp**: When tour was scheduled

---

## ✅ Tour Cancellation - Fully Functional

### What "Cancel Entire Tour" Does

The cancellation feature in the Tour Summary Dialog:

1. ✅ **Cancels all orders in ShipHero** via API
2. ✅ **Updates UI** to show canceled status
3. ✅ **Keeps tour record** in database with order history
4. ✅ **Tracks which orders were canceled** successfully

### Cancellation Process

#### Step 1: User Clicks "Cancel Entire Tour"
Location: `components/tour-summary-dialog.tsx:568`

```typescript
const cancelEntireTour = async () => {
  // 1. Get all sales and purchase orders
  const allSalesOrders = data.orders.sales_orders || []
  const allPurchaseOrders = data.orders.purchase_orders || []
  
  // 2. Cancel each order via ShipHero API
  // 3. Track success/failure
  // 4. Update UI state
}
```

#### Step 2: API Calls to ShipHero
Endpoint: `/api/shiphero/cancel-orders`

**For Sales Orders:**
```graphql
mutation {
  order_cancel(data: {
    order_id: "order-id"
    reason: "Tour canceled"
  }) {
    order {
      id
      order_number
      fulfillment_status
    }
  }
}
```

**For Purchase Orders:**
```graphql
mutation {
  purchase_order_set_fulfillment_status(data: {
    po_id: "po-id"
    status: "canceled"
  }) {
    purchase_order {
      id
      po_number
      fulfillment_status
    }
  }
}
```

#### Step 3: Results Displayed
- ✅ Success: "Entire Tour Canceled - Successfully canceled all X orders"
- ⚠️ Partial: "Partial Tour Cancellation - Canceled X/Y orders"
- ❌ Failure: "Tour Cancellation Failed - Failed to cancel any orders"

### What Cancellation Does NOT Do

❌ Does NOT delete the tour from the database  
❌ Does NOT delete participants  
❌ Does NOT delete the order summary  
❌ Does NOT affect historical data  

### Why Keep Tours After Cancellation?

✅ **Historical record** - Know what tours were scheduled  
✅ **Audit trail** - Track all order activity  
✅ **Analysis** - Understand cancellation patterns  
✅ **Reference** - Can review why/when tours were canceled  

---

## How to Use Tour Management

### Creating a Tour

1. Go to "Schedule Tour" tab
2. Fill in:
   - Date & Time
   - Warehouse
   - Host
   - Participants
3. Click "Schedule Tour"
4. ✅ Tour is saved to database with status: `scheduled`

### Finalizing a Tour

1. Go to "View Tours" tab
2. Find your tour
3. Click "Finalize Tour"
4. Configure workflows (which orders to create)
5. Click "Finalize"
6. ✅ Orders created in ShipHero
7. ✅ Tour status updated to: `finalized`
8. ✅ Order summary stored in database

### Viewing Tour Summary

1. Go to "View Tours" tab
2. Click "View Summary" on a finalized tour
3. See complete order details:
   - Sales orders by workflow
   - Purchase orders by workflow
   - Individual order status
   - Cancellation options

### Canceling Orders

**Cancel Entire Tour:**
1. Open Tour Summary
2. Scroll to bottom
3. Click "Cancel Entire Tour"
4. Confirm
5. ✅ All orders canceled in ShipHero
6. ✅ UI updates to show canceled status
7. ✅ Tour record remains in database

**Cancel Individual Workflow:**
1. Open Tour Summary
2. Find the workflow section
3. Click "Cancel All [Workflow]" button
4. ✅ Only those orders canceled

**Cancel Individual Order:**
1. Open Tour Summary
2. Find the specific order
3. Click order number to view in ShipHero
4. Cancel manually in ShipHero

---

## Data Retention & Compliance

### What's Stored Long-Term

✅ **Tour records**: Permanent (unless explicitly deleted)  
✅ **Participant information**: Permanent (linked to tours)  
✅ **Order summaries**: Permanent (JSON in tour record)  
✅ **Timestamps**: Creation dates for all records  

### What's NOT Stored

❌ **Credit card info**: Never stored (not used)  
❌ **Passwords**: Not applicable (no user accounts per tenant)  
❌ **ShipHero tokens**: Stored encrypted, not in tour records  

### Data Export

To export tour data:
```sql
-- All tours
SELECT * FROM tours;

-- Tours with details
SELECT 
  t.*,
  w.name as warehouse_name,
  h.first_name || ' ' || h.last_name as host_name,
  (SELECT COUNT(*) FROM tour_participants WHERE tour_id = t.id) as participant_count
FROM tours t
LEFT JOIN warehouses w ON t.warehouse_id = w.id
LEFT JOIN team_members h ON t.host_id = h.id
ORDER BY t.created_at DESC;
```

---

## Testing Recommendations

### Before Going Live

1. ✅ Create test tour
2. ✅ Add test participants
3. ✅ Finalize tour (creates orders)
4. ✅ View tour summary
5. ✅ Test order cancellation
6. ✅ Verify orders canceled in ShipHero
7. ✅ Verify tour remains in database
8. ✅ Use "Clear All Tours" to clean up

### Production Best Practices

1. **Regular backups**: Supabase provides automatic backups
2. **Monitor tour status**: Check for failed orders
3. **Review cancellations**: Understand why tours are canceled
4. **Archive old tours**: Optional - export and delete very old tours

---

## API Reference

### Cancel Orders Endpoint

**Endpoint:** `POST /api/shiphero/cancel-orders`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}"
}
```

**Request Body:**
```json
{
  "orders": [
    {
      "id": "order-shiphero-id",
      "legacy_id": 12345
    }
  ],
  "type": "sales" | "purchase",
  "use_cancel_mutation": true
}
```

**Response:**
```json
{
  "success": true,
  "canceled_count": 5,
  "total_count": 5,
  "results": [...],
  "errors": []
}
```

---

## Troubleshooting

### Tours Not Showing

**Issue:** Created tour doesn't appear in "View Tours"  
**Solution:** 
- Check browser console for errors
- Verify Supabase connection
- Refresh the page
- Check database directly

### Cancellation Fails

**Issue:** "Cancel Entire Tour" fails  
**Solution:**
- Verify ShipHero access token is valid
- Check order IDs are correct
- Look at browser console for error details
- Try canceling individual workflows first

### Orders Not Created

**Issue:** Finalization succeeds but no orders in ShipHero  
**Solution:**
- Check ShipHero API credentials
- Verify warehouse IDs are correct
- Check SKUs exist in ShipHero
- Review tour order_summary for error messages

---

## Summary

✅ **Tours are permanently stored** unless explicitly deleted  
✅ **Cancellation works correctly** and cancels orders in ShipHero  
✅ **Tour records remain** after cancellation for historical reference  
✅ **Order summaries preserved** with complete success/failure details  
✅ **No automatic deletion** - complete control over data retention  

Your tour data is safe, secure, and persistent! 🎉

