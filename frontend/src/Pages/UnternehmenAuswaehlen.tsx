import { gql } from 'graphql-tag';
import React, { FC, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import LinkButton from '../components/Form/LinkButton';
import { GetCompaniesQuery } from '../api/__generated__/graphql';
import { SectionHeading } from '../components/UI';

const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
      trade
      address
    }
  }
`;

const UnternehmenAuswaehlen: FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<GetCompaniesQuery>(GET_COMPANIES);

  const filtered = data?.companies?.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.trade?.toLowerCase().includes(q) ||
      c.address?.toLowerCase().includes(q)
    );
  }) ?? [];

  return (
    <div className="">
      <div className="space-y-4">
        <SectionHeading>Betrieb auswählen</SectionHeading>
        <p >
          Suche deinen Ausbildungsbetrieb. Vielleicht ist er schon im Betriebsradar eingetragen.
        </p>

        <input
          type="text"
          placeholder="Betrieb suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent text-base mb-4"
          autoFocus
        />

        {loading && <p className="text-gray-500">Lädt...</p>}
        {error && <p className="text-red-600">Fehler: {error.message}</p>}

        {!loading && !error && search.length > 0 && (
          <ul className="bg-white border border-gray-200 rounded-lg shadow divide-y divide-gray-100 mb-6">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-gray-500 text-sm">Kein Betrieb gefunden.</li>
            ) : (
              filtered.map((company) => (
                <li key={company.id}>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => navigate(`/berichtschreiben?companyId=${company.id}`)}
                  >
                    <span className="font-medium text-gray-900">{company.name}</span>
                    {(company.trade || company.address) && (
                      <span className="text-sm text-gray-500 ml-2">
                        {[company.trade, company.address].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          <SectionHeading>Betrieb nicht gefunden?</SectionHeading>
          <p>Hier kannst du deinen Betrieb neu beim Betriebsradar eintragen.</p>
          <LinkButton to="/unternehmeneintragen" size="sm">
            Neuen Betrieb eintragen
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default UnternehmenAuswaehlen;
