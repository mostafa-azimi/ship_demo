# Database Migrations

This directory contains all database migrations for the ShipBots application. Migrations are applied in timestamp order.

## Migration Order

Migrations are organized chronologically and should be applied in order:

### Initial Setup (September 2025)
1. **20250901000000_create_base_tables.sql** - Creates core tables (warehouses, team_members, tours, tour_participants)
2. **20250901000001_update_warehouses_fields.sql** - Adds ShipHero integration fields
3. **20250901000002_update_swag_items_fields.sql** - Updates swag items structure (deprecated)
4. **20250901000003_rename_team_members_to_hosts.sql** - Renames for clarity
5. **20250901000004_disable_rls_for_dev.sql** - Disables RLS for single-tenant
6. **20250901000005_remove_swag_quantity.sql** - Removes deprecated field
7. **20250901000006_add_shiphero_order_tracking.sql** - Adds order ID tracking
8. **20250901000007_add_host_and_status_to_tours.sql** - Adds host assignment
9. **20250901000008_update_team_members_structure.sql** - Updates name fields
10. **20250901000009_add_missing_tour_fields.sql** - Adds additional tour fields
11. **20250901000010_add_sample_data.sql** - Inserts sample data (optional)
12. **20250901000011_standardize_name_fields.sql** - Standardizes naming
13. **20250901000012_remove_name_constraint.sql** - Removes constraints
14. **20250901000013_add_host_order_tracking.sql** - Tracks host orders
15. **20250901000014_set_warehouse_codes.sql** - Sets warehouse codes
16. **20250901000015_cleanup_test_data.sql** - Removes test data
17. **20250901000016_add_workflows_to_tours.sql** - Adds workflow config
18. **20250901000017_add_selected_skus_to_tours.sql** - Adds SKU selection
19. **20250901000018_add_instruction_guide_to_tours.sql** - Adds tour instructions

### Tenant Configuration (September 2025)
20. **20250906000001_fix_warehouse_codes.sql** - Fixes warehouse code issues
21. **20250906000002_create_tenant_config.sql** - Creates configuration table

### Hold Until Feature (September 2025)
22. **20250914000001_add_hold_until_setting.sql** - Adds hold until feature
23. **20250914150840_add_hold_until_setting.sql** - Updates hold until
24. **20250915000001_add_hold_until_setting.sql** - Final hold until adjustments

### Workflow Defaults (September 2025)
25. **20250922000001_add_workflow_defaults.sql** - Adds default workflows
26. **20250922000002_set_workflow_defaults_from_screenshot.sql** - Sets defaults

### Warehouse Improvements (September-October 2025)
27. **20250930000001_add_unique_constraint_shiphero_warehouse_id.sql** - Ensures uniqueness
28. **20250930000002_delete_hardcoded_warehouses.sql** - Removes hardcoded data
29. **20250930000003_truncate_warehouses.sql** - Clears warehouses
30. **20250930000004_drop_code_constraint.sql** - Removes constraint
31. **20250930000005_force_drop_code_constraint.sql** - Forces constraint drop
32. **20250930000006_show_and_drop_all_code_constraints.sql** - Shows constraints
33. **20250930000007_make_code_nullable.sql** - Makes code optional
34. **20250930000008_clear_workflow_defaults.sql** - Clears defaults

### Multi-Tenant Attempt & Reversion (October 2025)
35. **20251001000001_create_users_table.sql** - Creates users (reverted)
36. **20251001000002_add_user_id_to_tables.sql** - Adds user_id (reverted)
37. **20251001000003_enable_rls_policies.sql** - Enables RLS (reverted)
38. **20251001000004_make_admin.sql** - Creates admin (reverted)
39. **20251001000005_temp_disable_rls.sql** - Disables RLS temporarily
40. **⭐ 20251001000006_revert_to_single_tenant.sql** - Reverts to single-tenant

### Production Features (January 2025)
41. **20250102000000_clear_production_tour_data.sql** - Clears production data
42. **20250102000001_add_tour_numeric_id.sql** - Adds numeric tour IDs
43. **20250102000002_create_warehouse_codes.sql** - Creates warehouse codes
44. **20250102000003_drop_swag_items_tables.sql** - Removes deprecated swag items
45. **20250102000004_add_workflow_configs_to_tours.sql** - Adds workflow config
46. **⭐ 20250102000005_create_extras_table.sql** - Creates demo customers
47. **⭐ 20250102000006_create_shiphero_tokens.sql** - Creates token storage
48. **20250106000001_add_order_summary_to_tours.sql** - Adds order summary tracking

## Key Migrations

### Must-Have Migrations
These are essential for the app to function:

- ✅ **20250901000000_create_base_tables.sql** - Core schema
- ✅ **20250906000002_create_tenant_config.sql** - Configuration
- ✅ **20250102000005_create_extras_table.sql** - Demo customers
- ✅ **20250102000006_create_shiphero_tokens.sql** - API tokens
- ✅ **20251001000006_revert_to_single_tenant.sql** - Single-tenant model

### Optional Migrations
These add features but aren't strictly required:

- 📝 **20250901000010_add_sample_data.sql** - Sample data for testing
- 📝 **20250922000002_set_workflow_defaults_from_screenshot.sql** - Default workflows

## Current Schema

After all migrations, you'll have these tables:

1. **warehouses** - Customer warehouse locations
2. **team_members** - Tour hosts/guides
3. **tours** - Scheduled tours with config
4. **tour_participants** - Tour attendees
5. **tenant_config** - Customer-specific settings
6. **shiphero_tokens** - ShipHero API credentials
7. **extras** - Demo customers for additional orders

## Applying Migrations

### For New Client Setup

```bash
# 1. Link to Supabase project
supabase link --project-ref your-project-ref

# 2. Apply all migrations
supabase db push

# 3. Verify
# Check Supabase dashboard → Database → Tables
```

### For Existing Database

If you already have a database and need to apply new migrations:

```bash
# Check migration status
supabase migration list

# Apply pending migrations
supabase db push
```

### Rolling Back (Caution!)

⚠️ **Warning:** This will lose data!

```bash
# Reset database and reapply all migrations
supabase db reset
```

## Migration Best Practices

### For Future Migrations

When creating new migrations:

1. **Use descriptive names:**
   ```
   YYYYMMDDHHMMSS_descriptive_name.sql
   ```

2. **Make them idempotent:**
   ```sql
   CREATE TABLE IF NOT EXISTS ...
   ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...
   ```

3. **Document changes:**
   - Add comments in the SQL file
   - Update this README
   - Update SCHEMA.md if schema changes

4. **Test thoroughly:**
   - Test on local Supabase instance
   - Test on staging environment
   - Backup before applying to production

## Troubleshooting

### Migration Fails

If a migration fails:

```bash
# Check error message carefully
supabase db push

# If needed, fix the migration file and try again
# Or reset and start over (loses data!)
supabase db reset
```

### Conflicts

If you get conflicts between local and remote:

```bash
# Pull remote changes
supabase db pull

# Or force push local (caution!)
supabase db push --force
```

### Starting Fresh

To start completely fresh:

```bash
# Delete .supabase directory
rm -rf .supabase

# Re-link
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## Notes

- All migrations are committed to Git
- Migrations are applied automatically in timestamp order
- RLS is **disabled** for single-tenant architecture
- The schema evolved from multi-tenant to single-tenant
- Swag items feature was deprecated

## Support

For migration issues:
- Check Supabase logs in dashboard
- Review SQL syntax
- Ensure Supabase CLI is up to date: `brew upgrade supabase`
- See SCHEMA.md for complete schema documentation

