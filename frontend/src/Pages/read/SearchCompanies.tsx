import { gql } from 'graphql-tag';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { GetCompaniesForMapQuery } from '../../api/__generated__/graphql';
import CompanyMap, { MapView } from '../../components/Map/CompanyMap';
import { TradeDropdown } from '../../components/Form';
import { filterCompanies, MapBounds, MapCompany } from '../../lib/companyFilters';
import { TRADES } from '../../lib/trades';

const GET_COMPANIES_FOR_MAP = gql`
                    query GetCompaniesForMap {
                        companies {
                            id
                            name
                            trade
                            address
                            reviewsCount
                            latitude
                            longitude
                        }
}`;

const DEFAULT_CENTER: [number, number] = [51.2344, 9.9536];
const DEFAULT_ZOOM = 6;

// "Musterstraße 5, 12345 Musterstadt" -> "12345 Musterstadt"
function shortenAddress(address: string | null): string | null {
  if (!address) return null;
  const parts = address.split(',');
  return parts[parts.length - 1].trim() || address;
}

const SearchCompanies: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  // Not persisted in the URL: bounds depend on viewport size, so they're derived live
  // from the map itself (see handleViewChange) rather than reconstructed on load.
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const { loading, error, data } = useQuery<GetCompaniesForMapQuery>(GET_COMPANIES_FOR_MAP);

  const trade = searchParams.get('trade');
  const companies = useMemo(() => data?.companies ?? [], [data]);

  const visibleCompanies = useMemo(
    () => filterCompanies(companies, { trade, bounds }),
    [companies, trade, bounds]
  );

  const sortedVisibleCompanies = useMemo(
    () =>
      [...visibleCompanies].sort((a, b) =>
        (a.name ?? '').localeCompare(b.name ?? '', 'de', { sensitivity: 'base' })
      ),
    [visibleCompanies]
  );

  // Computed once the companies are loaded, then handed to the (uncontrolled) map as
  // its initial view — a URL from a previous session takes priority over the Germany-wide fallback.
  const initialView = useMemo(() => {
    const lat = parseFloat(searchParams.get('lat') ?? '');
    const lng = parseFloat(searchParams.get('lng') ?? '');
    const zoom = parseFloat(searchParams.get('zoom') ?? '');
    if (!Number.isNaN(lat) && !Number.isNaN(lng) && !Number.isNaN(zoom)) {
      return { center: [lat, lng] as [number, number], zoom };
    }

    return { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleViewChange = useCallback(
    ({ center, zoom, bounds: nextBounds }: MapView) => {
      const next = new URLSearchParams(searchParams);
      next.set('lat', center[0].toFixed(5));
      next.set('lng', center[1].toFixed(5));
      next.set('zoom', String(zoom));
      setSearchParams(next, { replace: true });
      setBounds(nextBounds);
    },
    [searchParams, setSearchParams]
  );

  const selectTrade = (selectedTrade: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('trade', selectedTrade);
    setSearchParams(next, { replace: true });
  };

  const clearTrade = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('trade');
    setSearchParams(next, { replace: true });
  };

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>Fehler: {error.message}</p>;

  return (
    <div
      className="relative -mt-8 -mb-8"
      style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
    >
      <h1 className="sr-only">Betriebe auf der Karte</h1>

      <CompanyMap
        companies={visibleCompanies}
        center={initialView.center}
        zoom={initialView.zoom}
        onViewChange={handleViewChange}
        className="w-full h-[calc(100vh-7rem)] xl:pl-96"
      />

      <button
        type="button"
        onClick={() => setFilterOpen((open) => !open)}
        aria-label={filterOpen ? 'Filter schließen' : 'Filter öffnen'}
        className="fixed z-40 bottom-6 right-6
          p-4 rounded-full bg-brand-button border-standard shadow-lg hover:bg-brand-button-hover xl:hidden"
      >
        {filterOpen ? <X className="w-6 h-6 text-blackish" /> : <SlidersHorizontal className="w-6 h-6 text-blackish" />}
      </button>

      {filterOpen && (
        <div className="fixed inset-0 z-20 bg-black/30 xl:hidden" onClick={() => setFilterOpen(false)} />
      )}

      <div
        className={`fixed z-30 bg-brand-bg border-blackish shadow-lg transition-transform duration-300 ease-in-out
          flex flex-col
          inset-x-0 bottom-0 rounded-t-2xl border-t-2 h-[90vh]
          md:inset-x-auto md:top-28 md:bottom-0 md:left-0 md:w-96 md:h-auto md:rounded-t-none md:rounded-r-2xl md:border-t-0 md:border-r-2
          ${filterOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:-translate-x-full'}
          xl:translate-x-0 xl:translate-y-0`}
      >
        <div className="p-6 space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Filter</h2>
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              aria-label="Filter schließen"
              className="p-1 hover:opacity-70 xl:hidden"
            >
              <X className="w-5 h-5 text-blackish" />
            </button>
          </div>

          <TradeDropdown trades={TRADES} trade={trade} onSelect={selectTrade} onClear={clearTrade} />
        </div>

        <div className="px-6 pb-2 flex-shrink-0">
          <p className="text-sm text-gray-600">
            Zeigt nur Betriebe im aktuellen Kartenausschnitt. Zoome oder verschiebe die Karte, um mehr zu sehen.
          </p>
        </div>

        <ul className="flex-1 overflow-y-auto px-6 pb-6 divide-y divide-gray-100">
          {sortedVisibleCompanies.map((company: MapCompany) => (
            <li key={company.id}>
              <Link to={`/unternehmen/${company.id}`} className="block py-3 hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">{company.name}</p>
                <p className="text-sm text-gray-500">
                  {[shortenAddress(company.address), company.trade].filter(Boolean).join(' · ')}
                </p>
              </Link>
            </li>
          ))}
          {sortedVisibleCompanies.length === 0 && (
            <li className="py-3 text-sm text-gray-600">
              <i>Keine Betriebe im aktuellen Kartenausschnitt.</i>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchCompanies;
