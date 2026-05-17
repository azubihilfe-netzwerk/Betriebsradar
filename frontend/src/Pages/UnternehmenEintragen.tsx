import { gql } from 'graphql-tag';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { CompanySizeType, Company, CompanyCreateInput } from '../api/__generated__/graphql';
import FormField from '../components/Form/FormField';
import SelectField from '../components/Form/SelectField';

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
  { value: CompanySizeType['1to10'], label: '1–10 Mitarbeitende' },
  { value: CompanySizeType['10to50'], label: '10–50 Mitarbeitende' },
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-navbar-blue mb-2">Betrieb eintragen</h1>
        <p className="text-gray-600 mb-8">
          Trag deinen Ausbildungsbetrieb ein. Danach kannst du direkt deinen Erfahrungsbericht schreiben.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl shadow p-6">
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
            label="Adresse"
            required
            placeholder="z. B. Musterstraße 1, 12345 Musterstadt"
            error={errors.address?.message}
            {...register('address')}
          />
          <FormField
            label="Kontakt"
            required
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
            className="w-full py-3 bg-navbar-blue text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Wird eingetragen...' : 'Betrieb eintragen & Bericht schreiben'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnternehmenEintragen;
