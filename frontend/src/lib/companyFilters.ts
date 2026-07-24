import { GetCompaniesForMapQuery } from '../api/__generated__/graphql';

export type MapCompany = NonNullable<GetCompaniesForMapQuery['companies']>[number];

export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export interface CompanyFilters {
  trade?: string | null;
  bounds?: MapBounds | null;
}

/**
 * Applies all map filters to a list of companies. Runs client-side today; swap the
 * body for a server-side query (passing CompanyFilters as GraphQL variables) if
 * filtering needs to move to the backend later without touching call sites.
 */
export function filterCompanies(companies: MapCompany[], filters: CompanyFilters): MapCompany[] {
  return companies.filter((company) => {
    if (filters.trade && company.trade !== filters.trade) return false;

    if (filters.bounds) {
      if (company.latitude == null || company.longitude == null) return false;
      const { south, west, north, east } = filters.bounds;
      if (company.latitude < south || company.latitude > north) return false;
      if (west <= east) {
        if (company.longitude < west || company.longitude > east) return false;
      } else if (company.longitude < west && company.longitude > east) {
        // bounds cross the antimeridian
        return false;
      }
    }

    return true;
  });
}
