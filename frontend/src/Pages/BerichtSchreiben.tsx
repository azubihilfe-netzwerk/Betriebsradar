import React, { FC } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from 'graphql-tag';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ReviewForm, ReviewFormData } from '../components/ReviewForm';
import {
  CreateReviewMutation,
  CreateReviewMutationVariables,
  GetCompanyDetailQuery,

} from '../api/__generated__/graphql';

const CREATE_REVIEW = gql`
  mutation CreateReview($data: ReviewCreateInput!) {
    createReview(data: $data) {
      id
      name
      status
    }
  }
`;

const GET_COMPANY_NAME = gql`
  query GetCompanyDetail($id: ID!) {
    company(where: { id: $id }) {
      id
      name
    }
  }
`;

const BerichtSchreiben: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('companyId');

  const { data: companyData, loading: companyLoading, error: companyError } = useQuery<GetCompanyDetailQuery>(
    GET_COMPANY_NAME,
    { variables: { id: companyId }, skip: !companyId }
  );

  const [createReview, { loading: isSubmitting, error }] = useMutation<
    CreateReviewMutation,
    CreateReviewMutationVariables
  >(CREATE_REVIEW);

  if (!companyId) {
    navigate('/betriebauswaehlen');
    return null;
  }

  const companyName = companyData?.company?.name;

  const handleSubmit = async (formData: ReviewFormData) => {
    try {
      await createReview({
        variables: {
          data: {
            name: formData.name,
            email: formData.email || '',
            company: {
              connect: { id: companyId },
            },
            publishName: formData.publishName,
            gender: formData.gender,
            ageAtEmployment: formData.ageAtEmployment ? parseInt(formData.ageAtEmployment) : undefined,
            genderOuted: formData.genderOuted,
            position: formData.position,
            duration: formData.duration,
            yearOfHiring: formData.yearOfHiring,
            listenedTo: formData.listenedTo,
            tone: formData.tone,
            explained: formData.explained,
            canAskColleagues: formData.canAskColleagues,
            canAskBoss: formData.canAskBoss,
            proximity: formData.proximity,
            boundariesRespected: formData.boundariesRespected,
            appreciated: formData.appreciated,
            experienceText: formData.experienceText,
            languages: formData.languages,
            collective: formData.collective,
            hoursPerWeek: formData.hoursPerWeek ? parseInt(formData.hoursPerWeek) : undefined,
            trainingShortenable: formData.trainingShortenable,
            partTime: formData.partTime,
            sharedWithCompany: formData.sharedWithCompany,
            feltComfortableSharing: formData.feltComfortableSharing,
            needsRespected: formData.needsRespected,
            feedback: formData.feedback,
            moreWishes: formData.moreWishes,
          },
        },
      } as const);

      navigate('/bericht-eingereicht');
    } catch (err) {
      console.error('Fehler beim Einreichen des Berichts:', err);
    }
  };

  if (companyError || companyName == null) {

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto mb-8">
          <p>Betrieb {companyId} nicht gefunden!</p>
           <Link
        to="/"
        className="inline-block bg-navbar-blue text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
      >
        Zur Startseite
      </Link>
        </div>
      </div>)
  }

  return companyLoading ? <i>Lädt...</i> : (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-navbar-blue mb-2">Schreib deinen Erfahrungsbericht</h1>
        <p className="text-gray-600 mt-1">
          Teile deine Erfahrung in dem Betrieb <b className="text-bold">{companyName}</b>. Deine offene Rückmeldung hilft anderen Auszubildenden, die richtige Wahl zu treffen.
        </p>
      </div>

      <ReviewForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitError={error?.message}
      />
    </div>
  );
};

export default BerichtSchreiben;
