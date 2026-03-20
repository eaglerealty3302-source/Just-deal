-- Add AI analysis and anomaly detection columns to rent_rolls
ALTER TABLE public.rent_rolls
  ADD COLUMN IF NOT EXISTS ai_summary text,
  ADD COLUMN IF NOT EXISTS anomalies jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS yield_potential numeric;

-- Add anomaly flag to rent_roll_units
ALTER TABLE public.rent_roll_units
  ADD COLUMN IF NOT EXISTS is_anomaly boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS anomaly_details text;

-- Add valuation columns to deals
ALTER TABLE public.deals
  ADD COLUMN IF NOT EXISTS estimated_value numeric,
  ADD COLUMN IF NOT EXISTS cap_rate numeric,
  ADD COLUMN IF NOT EXISTS irr numeric;
