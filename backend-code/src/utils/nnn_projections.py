import sys
import json
from datetime import date, datetime
from calendar import isleap

def parse_date(d):
    if not d: return None
    for fmt in ('%m/%d/%Y', '%Y-%m-%d', '%m-%d-%Y', '%m/%d/%y', '%Y/%m/%d'):
        try:
            return datetime.strptime(d.strip(), fmt).date()
        except ValueError:
            continue
    return None

def days_in_year(year):
    return 366 if isleap(year) else 365

def get_active_rate(target_date, base_rent, rent_changes):
    active_rate = base_rent
    for rc in rent_changes:
        start = parse_date(rc.get('start_date'))
        if start and start <= target_date:
            active_rate = rc.get('rent_psf', active_rate)
        else:
            break
    return active_rate

def calculate_tenant_projections(tenant, analysis_years, market_rent_psf, annual_increment_pct):
    sqft = tenant.get('sqft', 0)
    base_rent_psf = tenant.get('base_rent_psf', 0)
    lease_end = parse_date(tenant.get('lease_end'))
    rent_changes = sorted(tenant.get('step_rents', []), key=lambda x: parse_date(x.get('date')) or date(1900,1,1))
    
    projections = {}
    first_year = analysis_years[0]
    
    is_vacant = not base_rent_psf or tenant.get('tenant', '').lower() == 'vacant'
    
    for year in analysis_years:
        year_start = date(year, 1, 1)
        year_end = date(year, 12, 31)
        total_days = days_in_year(year)
        
        if is_vacant:
            years_elapsed = year - first_year
            annual_rent = market_rent_psf * ((1 + annual_increment_pct) ** years_elapsed) * sqft
            projections[year] = {"amount": annual_rent, "type": "market"}
            continue
            
        if lease_end and lease_end < year_start:
            # Fully after expiration
            exp_year = lease_end.year
            first_increment_year = exp_year + 2 if (lease_end.month == 12 and lease_end.day == 31) else exp_year + 1
            years_elapsed = max(0, year - first_increment_year)
            annual_rent = market_rent_psf * ((1 + annual_increment_pct) ** years_elapsed) * sqft
            projections[year] = {"amount": annual_rent, "type": "market"}
        elif lease_end and year_start <= lease_end <= year_end:
            # Mid-year expiration
            lease_days = (lease_end - year_start).days + 1
            market_days = total_days - lease_days
            
            # Lease portion (handle potential step rents within the lease portion)
            # Simplified: use rate at start of year for the lease portion
            lease_rate = get_active_rate(year_start, base_rent_psf, rent_changes)
            lease_amount = (lease_rate * lease_days / total_days) * sqft
            
            # Market portion
            market_amount = (market_rent_psf * market_days / total_days) * sqft
            
            projections[year] = {"amount": lease_amount + market_amount, "type": "transition"}
        else:
            # Fully in-lease
            # Check for step rents within the year
            year_transitions = [rc for rc in rent_changes if year_start < parse_date(rc.get('date')) <= year_end]
            
            if not year_transitions:
                rate = get_active_rate(year_start, base_rent_psf, rent_changes)
                projections[year] = {"amount": rate * sqft, "type": "lease"}
            else:
                # Prorate step rents
                total_amount = 0
                curr_start = year_start
                curr_rate = get_active_rate(year_start, base_rent_psf, rent_changes)
                
                for rc in year_transitions:
                    trans_date = parse_date(rc.get('date'))
                    days = (trans_date - curr_start).days
                    total_amount += (curr_rate * days / total_days) * sqft
                    curr_start = trans_date
                    curr_rate = rc.get('rent_psf')
                
                remaining_days = (year_end - curr_start).days + 1
                total_amount += (curr_rate * remaining_days / total_days) * sqft
                projections[year] = {"amount": total_amount, "type": "transition"}
                
    return projections

def main():
    input_data = json.load(sys.stdin)
    tenants = input_data.get('tenants', [])
    analysis_years = input_data.get('analysis_years', [2025, 2026, 2027, 2028, 2029, 2030, 2031])
    global_market_rent = input_data.get('market_rent_psf', 15.0)
    annual_increment = input_data.get('annual_increment_pct', 0.03)
    
    results = []
    for t in tenants:
        # Use tenant-specific market rent if provided, else global
        m_rent = t.get('market_rent_psf') or global_market_rent
        proj = calculate_tenant_projections(t, analysis_years, m_rent, annual_increment)
        results.append({
            "suite": t.get('suite'),
            "tenant": t.get('tenant'),
            "sqft": t.get('sqft'),
            "projections": proj
        })
        
    print(json.dumps(results, default=str))

if __name__ == "__main__":
    main()
