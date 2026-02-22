-- ============================================================
-- STRICT_TYPE_HARDENING.sql
-- VerifiedMeasure Platform — Full Schema Type Hardening Pass
-- Safe: no data dropped, no RLS altered, no credit ledger touched
-- ============================================================

BEGIN;

-- ============================================================
-- 1. DEALFLOW (deal_flow / companies table)
-- ============================================================
ALTER TABLE deal_flow
  ALTER COLUMN company_name TYPE text USING company_name::text,
  ALTER COLUMN funding_stage TYPE text USING funding_stage::text,
  ALTER COLUMN sector TYPE text USING sector::text,
  ALTER COLUMN hq_location TYPE text USING hq_location::text,
  ALTER COLUMN description TYPE text USING description::text,
  ALTER COLUMN workflow_status TYPE text USING workflow_status::text,
  ALTER COLUMN next_action TYPE text USING next_action::text,
  ALTER COLUMN deal_owner TYPE text USING deal_owner::text,
  ALTER COLUMN last_round_date TYPE text USING last_round_date::text;

ALTER TABLE deal_flow
  ALTER COLUMN total_raised TYPE numeric USING total_raised::numeric,
  ALTER COLUMN intelligence_score TYPE numeric USING intelligence_score::numeric,
  ALTER COLUMN investor_count TYPE integer USING investor_count::integer,
  ALTER COLUMN founded_year TYPE integer USING founded_year::integer,
  ALTER COLUMN valuation TYPE numeric USING valuation::numeric,
  ALTER COLUMN revenue_estimate TYPE numeric USING revenue_estimate::numeric;

-- ============================================================
-- 2. SALESINTEL (b2b_leads / leads table)
-- ============================================================
ALTER TABLE b2b_leads
  ALTER COLUMN company TYPE text USING company::text,
  ALTER COLUMN title TYPE text USING title::text,
  ALTER COLUMN email_status TYPE text USING email_status::text,
  ALTER COLUMN industry TYPE text USING industry::text,
  ALTER COLUMN revenue_range TYPE text USING revenue_range::text,
  ALTER COLUMN full_name TYPE text USING full_name::text,
  ALTER COLUMN email TYPE text USING email::text,
  ALTER COLUMN phone TYPE text USING phone::text,
  ALTER COLUMN linkedin_url TYPE text USING linkedin_url::text,
  ALTER COLUMN intent_signal TYPE text USING intent_signal::text,
  ALTER COLUMN last_activity TYPE text USING last_activity::text,
  ALTER COLUMN workflow_status TYPE text USING workflow_status::text,
  ALTER COLUMN verified_at TYPE text USING verified_at::text,
  ALTER COLUMN bounce_risk TYPE text USING bounce_risk::text;

ALTER TABLE b2b_leads
  ALTER COLUMN employee_count TYPE integer USING employee_count::integer,
  ALTER COLUMN intelligence_score TYPE numeric USING intelligence_score::numeric,
  ALTER COLUMN priority_score TYPE numeric USING priority_score::numeric;

-- ============================================================
-- 3. SUPPLYINTEL (suppliers table)
-- ============================================================
ALTER TABLE suppliers
  ALTER COLUMN supplier_name TYPE text USING supplier_name::text,
  ALTER COLUMN country TYPE text USING country::text,
  ALTER COLUMN category TYPE text USING category::text,
  ALTER COLUMN compliance_status TYPE text USING compliance_status::text,
  ALTER COLUMN risk_level TYPE text USING risk_level::text,
  ALTER COLUMN last_audit_date TYPE text USING last_audit_date::text,
  ALTER COLUMN shipping_mode TYPE text USING shipping_mode::text,
  ALTER COLUMN contact_email TYPE text USING contact_email::text,
  ALTER COLUMN certifications TYPE text USING certifications::text;

ALTER TABLE suppliers
  ALTER COLUMN risk_score TYPE numeric USING risk_score::numeric,
  ALTER COLUMN lead_time_days TYPE integer USING lead_time_days::integer,
  ALTER COLUMN iso_certified TYPE boolean USING iso_certified::boolean;

-- ============================================================
-- 4. CLINICALINTEL (clinical_trials table)
-- ============================================================
ALTER TABLE clinical_trials
  ALTER COLUMN trial_title TYPE text USING trial_title::text,
  ALTER COLUMN phase TYPE text USING phase::text,
  ALTER COLUMN recruitment_status TYPE text USING recruitment_status::text,
  ALTER COLUMN condition TYPE text USING condition::text,
  ALTER COLUMN gender TYPE text USING gender::text,
  ALTER COLUMN inclusion_criteria TYPE text USING inclusion_criteria::text,
  ALTER COLUMN primary_location TYPE text USING primary_location::text,
  ALTER COLUMN countries TYPE text USING countries::text,
  ALTER COLUMN sponsor TYPE text USING sponsor::text,
  ALTER COLUMN principal_investigator TYPE text USING principal_investigator::text,
  ALTER COLUMN contact_email TYPE text USING contact_email::text;

ALTER TABLE clinical_trials
  ALTER COLUMN complexity_score TYPE numeric USING complexity_score::numeric,
  ALTER COLUMN min_age TYPE integer USING min_age::integer,
  ALTER COLUMN max_age TYPE integer USING max_age::integer,
  ALTER COLUMN site_count TYPE integer USING site_count::integer;

-- ============================================================
-- 5. LEGALINTEL (legal_cases table)
-- ============================================================
ALTER TABLE legal_cases
  ALTER COLUMN case_title TYPE text USING case_title::text,
  ALTER COLUMN jurisdiction TYPE text USING jurisdiction::text,
  ALTER COLUMN status TYPE text USING status::text,
  ALTER COLUMN filed_date TYPE text USING filed_date::text,
  ALTER COLUMN plaintiff TYPE text USING plaintiff::text,
  ALTER COLUMN defendant TYPE text USING defendant::text,
  ALTER COLUMN plaintiff_counsel TYPE text USING plaintiff_counsel::text,
  ALTER COLUMN defense_counsel TYPE text USING defense_counsel::text,
  ALTER COLUMN judge TYPE text USING judge::text,
  ALTER COLUMN next_hearing_date TYPE text USING next_hearing_date::text,
  ALTER COLUMN expected_resolution TYPE text USING expected_resolution::text;

ALTER TABLE legal_cases
  ALTER COLUMN damages_claimed TYPE numeric USING damages_claimed::numeric;

-- ============================================================
-- 6. MARKETRESEARCH (market_entities table)
-- ============================================================
ALTER TABLE market_entities
  ALTER COLUMN brand_name TYPE text USING brand_name::text,
  ALTER COLUMN category TYPE text USING category::text,
  ALTER COLUMN hq_region TYPE text USING hq_region::text,
  ALTER COLUMN trend_direction TYPE text USING trend_direction::text,
  ALTER COLUMN product_lines TYPE text USING product_lines::text;

ALTER TABLE market_entities
  ALTER COLUMN trend_score TYPE numeric USING trend_score::numeric,
  ALTER COLUMN sentiment_score TYPE numeric USING sentiment_score::numeric,
  ALTER COLUMN search_volume TYPE integer USING search_volume::integer,
  ALTER COLUMN social_mentions TYPE integer USING social_mentions::integer,
  ALTER COLUMN avg_review_rating TYPE numeric USING avg_review_rating::numeric,
  ALTER COLUMN sku_count TYPE integer USING sku_count::integer;

-- ============================================================
-- 7. ACADEMICINTEL (academic_papers table)
-- ============================================================
ALTER TABLE academic_papers
  ALTER COLUMN title TYPE text USING title::text,
  ALTER COLUMN doi TYPE text USING doi::text,
  ALTER COLUMN journal TYPE text USING journal::text,
  ALTER COLUMN published_date TYPE text USING published_date::text,
  ALTER COLUMN authors TYPE text USING authors::text,
  ALTER COLUMN institution TYPE text USING institution::text,
  ALTER COLUMN funding_source TYPE text USING funding_source::text,
  ALTER COLUMN grant_id TYPE text USING grant_id::text;

ALTER TABLE academic_papers
  ALTER COLUMN citation_count TYPE integer USING citation_count::integer,
  ALTER COLUMN collaboration_score TYPE numeric USING collaboration_score::numeric,
  ALTER COLUMN h_index TYPE numeric USING h_index::numeric,
  ALTER COLUMN impact_factor TYPE numeric USING impact_factor::numeric,
  ALTER COLUMN is_open_access TYPE boolean USING is_open_access::boolean;

-- ============================================================
-- 8. CREATORINTEL (creators table)
-- ============================================================
ALTER TABLE creators
  ALTER COLUMN creator_name TYPE text USING creator_name::text,
  ALTER COLUMN primary_platform TYPE text USING primary_platform::text,
  ALTER COLUMN niche TYPE text USING niche::text,
  ALTER COLUMN audience_location TYPE text USING audience_location::text,
  ALTER COLUMN audience_age_range TYPE text USING audience_age_range::text,
  ALTER COLUMN contact_email TYPE text USING contact_email::text,
  ALTER COLUMN past_brands TYPE text USING past_brands::text,
  ALTER COLUMN rate_card TYPE text USING rate_card::text;

ALTER TABLE creators
  ALTER COLUMN followers TYPE integer USING followers::integer,
  ALTER COLUMN engagement_rate TYPE numeric USING engagement_rate::numeric,
  ALTER COLUMN avg_views TYPE integer USING avg_views::integer,
  ALTER COLUMN avg_likes TYPE integer USING avg_likes::integer,
  ALTER COLUMN is_verified TYPE boolean USING is_verified::boolean;

-- ============================================================
-- 9. GAMINGINTEL (game_studios table)
-- ============================================================
ALTER TABLE game_studios
  ALTER COLUMN studio_name TYPE text USING studio_name::text,
  ALTER COLUMN engine_used TYPE text USING engine_used::text,
  ALTER COLUMN country TYPE text USING country::text,
  ALTER COLUMN funding_stage TYPE text USING funding_stage::text,
  ALTER COLUMN tech_lead TYPE text USING tech_lead::text,
  ALTER COLUMN latest_title TYPE text USING latest_title::text,
  ALTER COLUMN latest_release_date TYPE text USING latest_release_date::text,
  ALTER COLUMN contact_email TYPE text USING contact_email::text;

ALTER TABLE game_studios
  ALTER COLUMN avg_metacritic TYPE numeric USING avg_metacritic::numeric,
  ALTER COLUMN founded_year TYPE integer USING founded_year::integer,
  ALTER COLUMN team_size TYPE integer USING team_size::integer,
  ALTER COLUMN discord_members TYPE integer USING discord_members::integer,
  ALTER COLUMN steam_followers TYPE integer USING steam_followers::integer;

-- ============================================================
-- 10. REALESTATEINTEL (properties table)
-- ============================================================
ALTER TABLE properties
  ALTER COLUMN property_name TYPE text USING property_name::text,
  ALTER COLUMN property_type TYPE text USING property_type::text,
  ALTER COLUMN city TYPE text USING city::text,
  ALTER COLUMN state TYPE text USING state::text,
  ALTER COLUMN owner_name TYPE text USING owner_name::text,
  ALTER COLUMN owner_type TYPE text USING owner_type::text,
  ALTER COLUMN acquisition_date TYPE text USING acquisition_date::text,
  ALTER COLUMN lender TYPE text USING lender::text,
  ALTER COLUMN debt_maturity_date TYPE text USING debt_maturity_date::text;

ALTER TABLE properties
  ALTER COLUMN valuation_estimate TYPE numeric USING valuation_estimate::numeric,
  ALTER COLUMN risk_score TYPE numeric USING risk_score::numeric,
  ALTER COLUMN debt_amount TYPE numeric USING debt_amount::numeric,
  ALTER COLUMN cap_rate TYPE numeric USING cap_rate::numeric,
  ALTER COLUMN debt_maturity_flag TYPE boolean USING debt_maturity_flag::boolean;

-- ============================================================
-- 11. PRIVATECREDITINTEL (private_companies table)
-- ============================================================
ALTER TABLE private_companies
  ALTER COLUMN company_name TYPE text USING company_name::text,
  ALTER COLUMN industry TYPE text USING industry::text,
  ALTER COLUMN hq_location TYPE text USING hq_location::text,
  ALTER COLUMN payment_history TYPE text USING payment_history::text,
  ALTER COLUMN lien_details TYPE text USING lien_details::text;

ALTER TABLE private_companies
  ALTER COLUMN credit_risk_score TYPE numeric USING credit_risk_score::numeric,
  ALTER COLUMN revenue_estimate TYPE numeric USING revenue_estimate::numeric,
  ALTER COLUMN ebitda_estimate TYPE numeric USING ebitda_estimate::numeric,
  ALTER COLUMN total_debt TYPE numeric USING total_debt::numeric,
  ALTER COLUMN ucc_filing_count TYPE integer USING ucc_filing_count::integer,
  ALTER COLUMN lien_count TYPE integer USING lien_count::integer,
  ALTER COLUMN delinquency_flag TYPE boolean USING delinquency_flag::boolean;

-- ============================================================
-- 12. CYBERINTEL (cyber_orgs table)
-- ============================================================
ALTER TABLE cyber_orgs
  ALTER COLUMN organization_name TYPE text USING organization_name::text,
  ALTER COLUMN industry TYPE text USING industry::text,
  ALTER COLUMN open_ports TYPE text USING open_ports::text,
  ALTER COLUMN exposed_services TYPE text USING exposed_services::text,
  ALTER COLUMN cve_details TYPE text USING cve_details::text,
  ALTER COLUMN last_breach_date TYPE text USING last_breach_date::text,
  ALTER COLUMN breach_details TYPE text USING breach_details::text;

ALTER TABLE cyber_orgs
  ALTER COLUMN security_posture_score TYPE numeric USING security_posture_score::numeric,
  ALTER COLUMN attack_surface_score TYPE numeric USING attack_surface_score::numeric,
  ALTER COLUMN breach_count_12m TYPE integer USING breach_count_12m::integer,
  ALTER COLUMN employee_count TYPE integer USING employee_count::integer,
  ALTER COLUMN critical_cve_count TYPE integer USING critical_cve_count::integer,
  ALTER COLUMN high_cve_count TYPE integer USING high_cve_count::integer;

-- ============================================================
-- 13. BIOPHARMINTEL (drug_programs table)
-- ============================================================
ALTER TABLE drug_programs
  ALTER COLUMN program_name TYPE text USING program_name::text,
  ALTER COLUMN phase TYPE text USING phase::text,
  ALTER COLUMN development_status TYPE text USING development_status::text,
  ALTER COLUMN sponsor_company TYPE text USING sponsor_company::text,
  ALTER COLUMN mechanism_of_action TYPE text USING mechanism_of_action::text,
  ALTER COLUMN drug_class TYPE text USING drug_class::text,
  ALTER COLUMN molecule_type TYPE text USING molecule_type::text,
  ALTER COLUMN scientific_details TYPE text USING scientific_details::text,
  ALTER COLUMN primary_indication TYPE text USING primary_indication::text,
  ALTER COLUMN secondary_indications TYPE text USING secondary_indications::text,
  ALTER COLUMN target_population TYPE text USING target_population::text,
  ALTER COLUMN deal_partner TYPE text USING deal_partner::text,
  ALTER COLUMN license_type TYPE text USING license_type::text;

ALTER TABLE drug_programs
  ALTER COLUMN deal_value TYPE numeric USING deal_value::numeric;

-- ============================================================
-- 14. INDUSTRIALINTEL (industrial_facilities table)
-- ============================================================
ALTER TABLE industrial_facilities
  ALTER COLUMN facility_name TYPE text USING facility_name::text,
  ALTER COLUMN facility_type TYPE text USING facility_type::text,
  ALTER COLUMN location TYPE text USING location::text,
  ALTER COLUMN country TYPE text USING country::text,
  ALTER COLUMN expansion_details TYPE text USING expansion_details::text,
  ALTER COLUMN last_inspection_date TYPE text USING last_inspection_date::text,
  ALTER COLUMN inspector_contact TYPE text USING inspector_contact::text,
  ALTER COLUMN other_certifications TYPE text USING other_certifications::text;

ALTER TABLE industrial_facilities
  ALTER COLUMN risk_score TYPE numeric USING risk_score::numeric,
  ALTER COLUMN utilization_rate TYPE numeric USING utilization_rate::numeric,
  ALTER COLUMN production_capacity TYPE numeric USING production_capacity::numeric,
  ALTER COLUMN compliance_event_count TYPE integer USING compliance_event_count::integer,
  ALTER COLUMN is_expanding TYPE boolean USING is_expanding::boolean,
  ALTER COLUMN iso_14001 TYPE boolean USING iso_14001::boolean,
  ALTER COLUMN iso_9001 TYPE boolean USING iso_9001::boolean;

-- ============================================================
-- 15. GOVINTEL (gov_opportunities table)
-- ============================================================
ALTER TABLE gov_opportunities
  ALTER COLUMN opportunity_title TYPE text USING opportunity_title::text,
  ALTER COLUMN agency TYPE text USING agency::text,
  ALTER COLUMN solicitation_type TYPE text USING solicitation_type::text,
  ALTER COLUMN status TYPE text USING status::text,
  ALTER COLUMN naics_code TYPE text USING naics_code::text,
  ALTER COLUMN set_aside_type TYPE text USING set_aside_type::text,
  ALTER COLUMN point_of_contact TYPE text USING point_of_contact::text,
  ALTER COLUMN posted_date TYPE text USING posted_date::text,
  ALTER COLUMN deadline TYPE text USING deadline::text,
  ALTER COLUMN expected_award_date TYPE text USING expected_award_date::text,
  ALTER COLUMN awardee TYPE text USING awardee::text,
  ALTER COLUMN contract_number TYPE text USING contract_number::text;

ALTER TABLE gov_opportunities
  ALTER COLUMN award_amount TYPE numeric USING award_amount::numeric;

-- ============================================================
-- 16. INSURANCEINTEL (insurance_accounts table)
-- ============================================================
ALTER TABLE insurance_accounts
  ALTER COLUMN account_name TYPE text USING account_name::text,
  ALTER COLUMN account_type TYPE text USING account_type::text,
  ALTER COLUMN hq_state TYPE text USING hq_state::text,
  ALTER COLUMN lines_of_business TYPE text USING lines_of_business::text,
  ALTER COLUMN specialties TYPE text USING specialties::text,
  ALTER COLUMN licensed_states TYPE text USING licensed_states::text,
  ALTER COLUMN license_numbers TYPE text USING license_numbers::text,
  ALTER COLUMN am_best_rating TYPE text USING am_best_rating::text;

ALTER TABLE insurance_accounts
  ALTER COLUMN compliance_score TYPE numeric USING compliance_score::numeric,
  ALTER COLUMN premium_volume TYPE numeric USING premium_volume::numeric,
  ALTER COLUMN loss_ratio TYPE numeric USING loss_ratio::numeric,
  ALTER COLUMN combined_ratio TYPE numeric USING combined_ratio::numeric;

-- ============================================================
-- FINALIZE
-- ============================================================
COMMIT;

ANALYZE;
