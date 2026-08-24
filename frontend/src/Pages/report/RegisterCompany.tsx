import { gql } from 'graphql-tag';
import React, { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { CompanySizeType, Company, CompanyCreateInput } from '../../api/__generated__/graphql';
import FormField from '../../components/Form/FormField';
import SelectField from '../../components/Form/SelectField';
import { Button, TradeDropdown } from '../../components/Form';
import { PageHeading } from '../../components/UI';
import { TRADES } from '../../lib/trades';

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
  street: string;
  houseNumber: string;
  plz: string;
  city: string;
  contact: string;
  size: CompanySizeType | '';
}

const SIZE_OPTIONS = [
  { value: undefined, label: 'Bitte wählen' },
  { value: CompanySizeType.S1to5, label: '1–5 Mitarbeitende' },
  { value: CompanySizeType.S10to30, label: '10–30 Mitarbeitende' },
  { value: CompanySizeType.S30to50, label: '30–50 Mitarbeitende' },
  { value: CompanySizeType.S50to250, label: '50–250 Mitarbeitende' },
  { value: CompanySizeType.Size250plus, label: 'Mehr als 250 Mitarbeitende' },
];

const RegisterCompany: FC = () => {
  const navigate = useNavigate();
  const { register, control, handleSubmit, formState: { errors } } = useForm<CompanyFormData>();
  const [createCompany, { loading, error }] = useMutation<CreateCompanyMutation, CreateCompanyMutationVariables>(CREATE_COMPANY);

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const result = await createCompany({
        variables: {
          data: {
            name: data.name,
            trade: data.trade || undefined,
            street: data.street || undefined,
            houseNumber: data.houseNumber || undefined,
            plz: data.plz || undefined,
            city: data.city || undefined,
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
    <div>
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
        <Controller
          name="trade"
          control={control}
          rules={{ required: 'Bitte wähle ein Gewerk aus.' }}
          render={({ field }) => (
            <TradeDropdown
              label="Gewerk / Branche"
              required
              trades={TRADES}
              trade={field.value || null}
              onSelect={field.onChange}
              placeholder="Gewerk auswählen"
              error={errors.trade?.message}
            />
          )}
        />
        <div className="flex flex-col sm:flex-row gap-5">
          <FormField
            label="Straße"
            required
            placeholder="z. B. Musterstraße"
            error={errors.street?.message}
            {...register('street', { required: 'Bitte gib die Straße an.' })}
          />
          <FormField
            label="Hausnummer"
            required
            placeholder="z. B. 1"
            error={errors.houseNumber?.message}
            {...register('houseNumber', { required: 'Bitte gib die Hausnummer an.' })}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-5">
          <FormField
            label="PLZ"
            required
            placeholder="z. B. 12345"
            error={errors.plz?.message}
            {...register('plz', { required: 'Bitte gib die PLZ an.' })}
          />
          <FormField
            label="Stadt"
            required
            placeholder="z. B. Musterstadt"
            error={errors.city?.message}
            {...register('city', { required: 'Bitte gib die Stadt an.' })}
          />
        </div>
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
          <p className="text-brand-error text-sm">Fehler: {error.message}</p>
        )}

        <Button
          type="submit"
          isLoading={loading}
          size="lg"
          className="w-full"
        >
          Betrieb eintragen & Bericht schreiben
        </Button>
      </form>
    </div>
  );
};

export default RegisterCompany;
