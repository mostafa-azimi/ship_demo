# Database Schema Documentation

## Overview
This document describes the complete database schema for the ShipHero Warehouse Touring App. The app uses a **single-tenant-per-deployment** model where each client gets their own isolated Supabase database.

---

## Tables

### 1. `warehouses`
Stores customer warehouse locations that are synchronized from ShipHero.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `name` | TEXT | NOT NULL | Warehouse name |
| `address` | TEXT | NOT NULL | Warehouse address |
| `code` | TEXT | NULLABLE | Warehouse code (optional) |
| `shiphero_warehouse_id` | TEXT | UNIQUE | ShipHero warehouse ID for API sync |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Notes:**
- Synchronized from ShipHero via API
- `shiphero_warehouse_id` is unique and used for API operations
- Row Level Security (RLS) is disabled for single-tenant deployments

---

### 2. `team_members` (hosts)
Stores tour hosts/guides who lead warehouse tours.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `first_name` | TEXT | NOT NULL | Host's first name |
| `last_name` | TEXT | NOT NULL | Host's last name |
| `name` | TEXT | NULLABLE | Full name (legacy) |
| `email` | TEXT | UNIQUE, NOT NULL | Host's email address |
| `shiphero_order_id` | TEXT | NULLABLE | Associated ShipHero order ID |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Notes:**
- Each host can have an associated ShipHero order for swag/materials
- Email must be unique

---

### 3. `tours`
Stores scheduled warehouse tours with all related information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `numeric_id` | SERIAL | UNIQUE | Auto-incrementing tour number |
| `warehouse_id` | UUID | FOREIGN KEY → warehouses(id) | Associated warehouse |
| `host_id` | UUID | FOREIGN KEY → team_members(id) | Tour host |
| `date` | DATE | NOT NULL | Tour date |
| `time` | TIME | NOT NULL | Tour time |
| `status` | TEXT | DEFAULT 'scheduled' | Tour status (scheduled/completed/cancelled) |
| `notes` | TEXT | NULLABLE | Additional notes |
| `instruction_guide` | TEXT | NULLABLE | Tour instructions |
| `selected_skus` | TEXT[] | NULLABLE | Selected product SKUs for tour |
| `workflow_config` | JSONB | NULLABLE | Fulfillment workflow configuration |
| `order_summary` | JSONB | NULLABLE | Summary of created orders |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Workflow Config Structure:**
```json
{
  "createParticipantOrders": true,
  "createHostOrder": true,
  "createExtraOrders": 5,
  "holdUntilDate": "2025-01-15"
}
```

**Order Summary Structure:**
```json
{
  "participantOrders": [
    {
      "participantId": "uuid",
      "participantName": "John Doe",
      "orderId": "shiphero-order-id",
      "status": "success"
    }
  ],
  "hostOrder": {
    "hostId": "uuid",
    "hostName": "Jane Smith",
    "orderId": "shiphero-order-id",
    "status": "success"
  },
  "extraOrders": [...],
  "totalOrders": 10,
  "successCount": 10,
  "failedCount": 0
}
```

---

### 4. `tour_participants`
Stores tour participants/attendees.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `tour_id` | UUID | FOREIGN KEY → tours(id) CASCADE | Associated tour |
| `first_name` | TEXT | NOT NULL | Participant's first name |
| `last_name` | TEXT | NOT NULL | Participant's last name |
| `name` | TEXT | NULLABLE | Full name (legacy) |
| `email` | TEXT | NOT NULL | Participant's email |
| `company` | TEXT | NULLABLE | Participant's company |
| `title` | TEXT | NULLABLE | Participant's job title |
| `shiphero_order_id` | TEXT | NULLABLE | Associated ShipHero order ID |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Notes:**
- Each participant can have an associated ShipHero order
- Cascading delete: removing a tour removes all participants

---

### 5. `tenant_config`
Stores tenant-specific configuration settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `shiphero_vendor_id` | TEXT | NULLABLE | ShipHero vendor ID for purchase orders |
| `shop_name` | TEXT | DEFAULT 'Tour Orders' | Shop name for orders |
| `company_name` | TEXT | DEFAULT 'Tour Company' | Company name for addresses |
| `default_fulfillment_status` | TEXT | DEFAULT 'pending' | Default fulfillment status |
| `enable_hold_until` | BOOLEAN | DEFAULT false | Enable hold until date feature |
| `workflow_defaults` | JSONB | NULLABLE | Default workflow configuration |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Workflow Defaults Structure:**
```json
{
  "createParticipantOrders": true,
  "createHostOrder": true,
  "createExtraOrders": 0,
  "holdUntilEnabled": false
}
```

**Notes:**
- Should only have ONE row per deployment (single-tenant)
- Updated via Settings UI
- Cache-enabled in the app for performance

---

### 6. `shiphero_tokens`
Stores ShipHero API authentication tokens.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique identifier |
| `access_token` | TEXT | NOT NULL | Current access token |
| `refresh_token` | TEXT | NOT NULL | Refresh token for getting new access tokens |
| `expires_at` | TIMESTAMP | NOT NULL | Access token expiration time |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Notes:**
- Should only have ONE row per deployment
- Automatically updated when tokens are refreshed
- Access tokens typically expire after 1 hour
- Has auto-update trigger for `updated_at` column

---

### 7. `extras`
Demo customers used for generating additional orders when needed.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `first_name` | TEXT | NOT NULL | First name |
| `last_name` | TEXT | NOT NULL | Last name |
| `email` | TEXT | NOT NULL | Email address |
| `company` | TEXT | DEFAULT 'ShipHero' | Company name |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Notes:**
- Pre-populated with 50 demo customers
- Used when fulfillment workflows require more orders than real participants + host
- All have @shiphero.com email addresses

---

## Security Model

### Row Level Security (RLS)
**RLS is DISABLED** for all tables in this single-tenant architecture:
- Each customer has their own isolated database
- No risk of data mixing between customers
- Simpler queries and better performance
- Security is enforced at the database level (separate Supabase projects)

### Authentication
- Currently uses simple authentication
- Each deployment is isolated, so no multi-tenant concerns
- Future: Can enable Supabase Auth for internal user management

---

## Indexes

### Performance Indexes
```sql
-- Tenant config lookups
CREATE INDEX idx_tenant_config_id ON tenant_config(id);

-- Tour queries
CREATE INDEX idx_tours_warehouse_id ON tours(warehouse_id);
CREATE INDEX idx_tours_date ON tours(date);
CREATE INDEX idx_tours_status ON tours(status);

-- Participant lookups
CREATE INDEX idx_tour_participants_tour_id ON tour_participants(tour_id);

-- Warehouse lookups
CREATE UNIQUE INDEX idx_warehouses_shiphero_id ON warehouses(shiphero_warehouse_id);
```

---

## Relationships

```
warehouses (1) ─────→ (many) tours
team_members (1) ───→ (many) tours
tours (1) ──────────→ (many) tour_participants
```

---

## Migrations

All migrations are located in `/supabase/migrations/` and are applied in timestamp order.

### Key Migrations
- `20250901000000_create_base_tables.sql` - Creates initial schema
- `20250906000002_create_tenant_config.sql` - Creates tenant configuration
- `20250102000005_create_extras_table.sql` - Creates demo customers
- `20250102000006_create_shiphero_tokens.sql` - Creates token storage
- `20251001000006_revert_to_single_tenant.sql` - Removes multi-tenant features

### Applying Migrations
```bash
# Link to Supabase project
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push
```

---

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (for Supabase CLI)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

---

## Data Flow

### Tour Creation Flow
1. User creates tour in UI
2. Tour record created in `tours` table
3. Participants added to `tour_participants` table
4. When finalized:
   - Creates ShipHero purchase orders based on workflow config
   - Updates `order_summary` field with results
   - Changes tour `status` to 'completed'

### ShipHero Integration
1. Warehouses synced from ShipHero API → `warehouses` table
2. Orders created in ShipHero using:
   - `tenant_config` for company details
   - `shiphero_tokens` for authentication
   - Tour participants for order details

---

## Backup & Restore

### Backup
Supabase provides automatic daily backups on paid plans. For manual backups:

```bash
# Export schema and data
pg_dump $DATABASE_URL > backup.sql
```

### Restore
```bash
# Restore from backup
psql $DATABASE_URL < backup.sql
```

---

## Multi-Tenant History

This app **previously supported multi-tenant** architecture but was simplified to single-tenant-per-deployment:
- ❌ Removed: `users` table
- ❌ Removed: `user_id` columns from all tables
- ❌ Removed: Complex RLS policies
- ✅ Current: Simple single-tenant per deployment

**Why the change?**
- Simpler architecture
- Zero risk of data mixing
- Easier debugging and maintenance
- Better performance
- Scales linearly with number of customers

---

## Future Enhancements

Potential future additions:
- [ ] Advanced reporting and analytics
- [ ] Email notifications for tour reminders
- [ ] Calendar integrations
- [ ] Mobile app support
- [ ] Custom fields per tenant
- [ ] Audit logging

---

## Support

For questions about the database schema or migrations, refer to:
- This document (SCHEMA.md)
- Migration files in `/supabase/migrations/`
- Deployment guide (DEPLOYMENT_GUIDE.md)

