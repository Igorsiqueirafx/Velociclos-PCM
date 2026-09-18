# Database Migrations

This directory contains SQL migration files for the Supabase database.

## Running Migrations

1. Go to the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new
2. Copy the contents of the migration file(s)
3. Paste into the SQL Editor
4. Click "Run" to execute

## Migration Files

- `001_initial_schema.sql` - Initial schema with all tables and indexes

## Adding New Migrations

1. Create a new file with a numbered prefix: `002_description.sql`
2. Write the SQL migration
3. Test it in the Supabase SQL Editor before committing
