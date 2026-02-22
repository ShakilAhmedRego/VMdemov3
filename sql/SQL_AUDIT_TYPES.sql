-- ============================================================
-- SQL_AUDIT_TYPES.sql — VerifiedMeasure Read-Only Audit Queries
-- NO ALTER. NO DROP. SELECT ONLY.
-- ============================================================

-- ------------------------------------------------------------
-- 1) All json/jsonb columns in public schema
-- ------------------------------------------------------------
SELECT
  table_name,
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND data_type IN ('json', 'jsonb')
ORDER BY table_name, column_name;

-- ------------------------------------------------------------
-- 2) Full column listing for all 16 vertical tables
-- ------------------------------------------------------------
SELECT
  table_name,
  column_name,
  data_type,
  udt_name,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'companies',
    'b2b_leads',
    'suppliers',
    'clinical_trials',
    'legal_cases',
    'market_entities',
    'papers',
    'creators',
    'game_studios',
    'properties',
    'private_companies',
    'organizations',
    'drug_programs',
    'industrial_facilities',
    'gov_opportunities',
    'insurance_accounts'
  )
ORDER BY table_name, ordinal_position;

-- ------------------------------------------------------------
-- 3) Risk scan — any json/jsonb columns across vertical tables
-- ------------------------------------------------------------
SELECT
  c.table_name,
  c.column_name,
  c.data_type,
  c.udt_name,
  c.is_nullable
FROM information_schema.columns c
WHERE c.table_schema = 'public'
  AND c.table_name IN (
    'companies',
    'b2b_leads',
    'suppliers',
    'clinical_trials',
    'legal_cases',
    'market_entities',
    'papers',
    'creators',
    'game_studios',
    'properties',
    'private_companies',
    'organizations',
    'drug_programs',
    'industrial_facilities',
    'gov_opportunities',
    'insurance_accounts'
  )
  AND (
    c.data_type IN ('json', 'jsonb')
    OR c.udt_name IN ('json', 'jsonb')
  )
ORDER BY c.table_name, c.column_name;

-- ------------------------------------------------------------
-- 4) Credit ledger balance by user
-- (requires direct DB access or service role in psql editor)
-- ------------------------------------------------------------
SELECT
  user_id,
  SUM(delta) AS balance,
  COUNT(*) AS transaction_count,
  MAX(created_at) AS last_transaction
FROM public.credit_ledger
GROUP BY user_id
ORDER BY balance DESC;

-- ------------------------------------------------------------
-- 5) Access table row counts per vertical (unlock activity)
-- ------------------------------------------------------------
SELECT 'company_access'   AS access_table, COUNT(*) AS unlocked_rows FROM public.company_access
UNION ALL
SELECT 'lead_access',       COUNT(*) FROM public.lead_access
UNION ALL
SELECT 'supplier_access',   COUNT(*) FROM public.supplier_access
UNION ALL
SELECT 'trial_access',      COUNT(*) FROM public.trial_access
UNION ALL
SELECT 'case_access',       COUNT(*) FROM public.case_access
UNION ALL
SELECT 'entity_access',     COUNT(*) FROM public.entity_access
UNION ALL
SELECT 'paper_access',      COUNT(*) FROM public.paper_access
UNION ALL
SELECT 'creator_access',    COUNT(*) FROM public.creator_access
UNION ALL
SELECT 'studio_access',     COUNT(*) FROM public.studio_access
UNION ALL
SELECT 'property_access',   COUNT(*) FROM public.property_access
UNION ALL
SELECT 'pc_company_access', COUNT(*) FROM public.pc_company_access
UNION ALL
SELECT 'org_access',        COUNT(*) FROM public.org_access
UNION ALL
SELECT 'program_access',    COUNT(*) FROM public.program_access
UNION ALL
SELECT 'facility_access',   COUNT(*) FROM public.facility_access
UNION ALL
SELECT 'opportunity_access',COUNT(*) FROM public.opportunity_access
UNION ALL
SELECT 'account_access',    COUNT(*) FROM public.account_access
ORDER BY unlocked_rows DESC;

-- ------------------------------------------------------------
-- 6) Row counts for all 16 vertical source tables
-- ------------------------------------------------------------
SELECT 'companies'             AS source_table, COUNT(*) AS row_count FROM public.companies
UNION ALL
SELECT 'b2b_leads',             COUNT(*) FROM public.b2b_leads
UNION ALL
SELECT 'suppliers',             COUNT(*) FROM public.suppliers
UNION ALL
SELECT 'clinical_trials',       COUNT(*) FROM public.clinical_trials
UNION ALL
SELECT 'legal_cases',           COUNT(*) FROM public.legal_cases
UNION ALL
SELECT 'market_entities',       COUNT(*) FROM public.market_entities
UNION ALL
SELECT 'papers',                COUNT(*) FROM public.papers
UNION ALL
SELECT 'creators',              COUNT(*) FROM public.creators
UNION ALL
SELECT 'game_studios',          COUNT(*) FROM public.game_studios
UNION ALL
SELECT 'properties',            COUNT(*) FROM public.properties
UNION ALL
SELECT 'private_companies',     COUNT(*) FROM public.private_companies
UNION ALL
SELECT 'organizations',         COUNT(*) FROM public.organizations
UNION ALL
SELECT 'drug_programs',         COUNT(*) FROM public.drug_programs
UNION ALL
SELECT 'industrial_facilities', COUNT(*) FROM public.industrial_facilities
UNION ALL
SELECT 'gov_opportunities',     COUNT(*) FROM public.gov_opportunities
UNION ALL
SELECT 'insurance_accounts',    COUNT(*) FROM public.insurance_accounts
ORDER BY row_count DESC;

-- ------------------------------------------------------------
-- 7) Audit log recent activity (last 100 events)
-- ------------------------------------------------------------
SELECT
  actor,
  action,
  entity,
  meta,
  created_at
FROM public.audit_log
ORDER BY created_at DESC
LIMIT 100;

-- ------------------------------------------------------------
-- 8) user_profiles overview
-- ------------------------------------------------------------
SELECT
  role,
  status,
  COUNT(*) AS user_count
FROM public.user_profiles
GROUP BY role, status
ORDER BY role, status;
