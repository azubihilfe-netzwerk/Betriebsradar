import { gql } from 'graphql-tag';
import React, { FC, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { Button, LinkButton } from '../../components/Form';
import { GetCompaniesQuery } from '../../api/__generated__/graphql';
import { BackLink, PageHeading, SectionHeading } from '../../components/UI';

type Company = NonNullable<GetCompaniesQuery['companies']>[number];

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

const SelectCompany: FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Company | null>(null);
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
    <div className="space-y-4">
      <PageHeading>Schreib deinen Erfahrungsbericht</PageHeading>
      <p>
        Teile deine Erfahrung zu einem Betrieb. Deine offene Rückmeldung hilft anderen, die richtige Wahl zu treffen.
      </p>
      <p >Berichte nur über Betriebe, in denen du selbst
        arbeitest oder gearbeitet hast. Bei dem Bericht geht es um deine
        subjektive Erfahrung und Empfindung. Alle Berichte werden anonym veröffentlicht.
      </p>


      <p >
        Suche den Betrieb, über den du berichten möchtest. Vielleicht ist er schon im Betriebsradar eingetragen.
      </p>

      <input
        type="text"
        placeholder={selected?.name ? selected?.name : "Nach Name oder Stadt suchen..."}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelected(null);
        }}
        onFocus={(e) => {
          if (selected) {
            setSearch("");
          }
        }}
        className="w-full px-4 py-3 bg-brand-input border border-blackish rounded-lg
          focus:border-brand-button-hover focus:outline-none  rounded-md border-2  text-base mb-4"
        autoFocus
      />

      {loading && <p className="text-gray-500">Lädt...</p>}
      {error && <p className="text-red-600">Fehler: {error.message}</p>}

      {!loading && !error && !selected && search.length > 0 && filtered.length > 0 && (
        <ul className="bg-brand-input border border-blackish border-brand-button-hover border-2 rounded-md shadow divide-y divide-gray-100 mb-6">
          {(
            filtered.map((company) => (
              <li key={company.id}>
                <button
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors`}
                  onClick={() => {
                    setSelected(company);
                    setSearch(company.name + " (" + company.address +  ")" || "");
                  }}
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


      {filtered.length === 0 && !selected && (

        <p><i>Kein Betrieb gefunden.</i></p>
      )}

      <div className="flex flex-row gap-4 w-full">
        <LinkButton to="/unternehmeneintragen" variant="secondary" className='flex-1'>
          Neuen Betrieb eintragen
        </LinkButton>

      {selected && (
        <Button
          className="flex-1"
          onClick={() => navigate(`/berichtschreiben?companyId=${selected.id}`)}
        >
          Bericht zu {selected.name} schreiben
        </Button>
      )}
      </div>
    </div>



  );
};

export default SelectCompany;
