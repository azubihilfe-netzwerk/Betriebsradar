import { gql } from 'graphql-tag';
import React, { FC, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { Button, LinkButton, SearchAutocomplete } from '../../components/Form';
import { GetCompaniesQuery } from '../../api/__generated__/graphql';
import { PageHeading } from '../../components/UI';

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
        Falls nicht, kannst du den Betrieb neu eintragen.
      </p>

      <SearchAutocomplete
        items={filtered}
        getKey={(company) => company.id}
        getLabel={(company) => company.name ?? ''}
        getSubtitle={(company) => [company.trade, company.address].filter(Boolean).join(' · ') || null}
        getSelectedLabel={(company) => `${company.name} (${company.address})`}
        search={search}
        onSearchChange={setSearch}
        onSelectedChange={setSelected}
        placeholder={selected?.name ? selected?.name : "Nach Name oder Stadt suchen..."}
        emptyMessage="Kein Betrieb gefunden."
        className="mb-4"
        autoFocus
      />

      {loading && <p className="text-gray-500">Lädt...</p>}
      {error && <p className="text-brand-error">Fehler: {error.message}</p>}

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
