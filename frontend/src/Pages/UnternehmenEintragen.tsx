import { gql } from 'graphql-tag';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { CompanySizeType, Company, CompanyCreateInput } from '../api/__generated__/graphql';
import FormField from '../components/Form/FormField';
import SelectField from '../components/Form/SelectField';
import { PageHeading } from '../components/UI';

type CreateCompanyMutation = { createCompany: Pick<Company, 'id' | 'name'> | null | undefined };
type CreateCompanyMutationVariables = { data: CompanyCreateInput };

const CREATE_COMPANY = gql`
  mutation CreateCompany($data: CompanyCreateInput!) {
    createCompany(data: $data) {
      id
      name
    }
  }
`;

interface CompanyFormData {
  name: string;
  trade: string;
  address: string;
  contact: string;
  size: CompanySizeType | '';
}

const SIZE_OPTIONS = [
  { value: undefined, label: 'Bitte wählen' },
  { value: CompanySizeType['1to5'], label: '1–5 Mitarbeitende' },
  { value: CompanySizeType['5to10'], label: '5–10 Mitarbeitende' },
  { value: CompanySizeType['10to30'], label: '10–30 Mitarbeitende' },
  { value: CompanySizeType['30to50'], label: '30–50 Mitarbeitende' },
  { value: CompanySizeType['50to250'], label: '50–250 Mitarbeitende' },
  { value: CompanySizeType['250plus'], label: 'Mehr als 250 Mitarbeitende' },
];

const UnternehmenEintragen: FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>();
  const [createCompany, { loading, error }] = useMutation<CreateCompanyMutation, CreateCompanyMutationVariables>(CREATE_COMPANY);

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const result = await createCompany({
        variables: {
          data: {
            name: data.name,
            trade: data.trade || undefined,
            address: data.address || undefined,
            contact: data.contact || undefined,
            size: data.size || undefined,
          },
        },
      });
      const id = result.data?.createCompany?.id;
      if (id) {
        navigate(`/berichtschreiben?companyId=${id}`);
      }
    } catch (err) {
      console.error('Fehler beim Eintragen des Betriebs:', err);
    }
  };

  return (
    <div className="m-4">
      <PageHeading>Betrieb eintragen</PageHeading>
      <p className="py-4">
        Trag deinen Betrieb ein. Danach kannst du direkt deinen Erfahrungsbericht schreiben.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          label="Name des Betriebs"
          required
          placeholder="z. B. Musterbau GmbH"
          error={errors.name?.message}
          {...register('name', { required: 'Bitte gib den Namen des Betriebs an.' })}
        />
        <FormField
          label="Gewerk / Branche"
          required
          placeholder="z. B. Elektroinstallation"
          error={errors.trade?.message}
          {...register('trade')}
        />
        <FormField
          label="Stadt / Adresse"
          required
          placeholder="z. B. Berlin oder Musterstraße 1, 12345 Musterstadt"
          error={errors.address?.message}
          {...register('address')}
        />
        <FormField
          label="Kontakt (optional)"
          placeholder="z. B. info@musterbau.de"
          error={errors.contact?.message}
          {...register('contact')}
        />
        <SelectField
          label="Betriebsgröße"
          required
          options={SIZE_OPTIONS}
          error={errors.size?.message}
          {...register('size')}
        />

        {error && (
          <p className="text-red-600 text-sm">Fehler: {error.message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-button text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Wird eingetragen...' : 'Betrieb eintragen & Bericht schreiben'}
        </button>
      </form>
    </div>
  );
};

export default UnternehmenEintragen;
