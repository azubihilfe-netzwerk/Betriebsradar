import React, { FC, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from 'graphql-tag';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ReviewForm, ReviewFormData } from '../components/ReviewForm';
import { Button } from '../components/Form';
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
  query GetCompanyName($id: ID!) {
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

  const [landingPage, setLandingPage] = useState(true);

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
            gender: formData.gender,
            genderIdentityRespected: formData.genderIdentityRespected,
            ageAtEmployment: formData.ageAtEmployment ? parseInt(formData.ageAtEmployment) : undefined,
            position: formData.position,
            yearOfHiring: formData.yearOfHiring,
            yearOfLeaving: formData.yearOfLeaving || undefined,
            ongoing: formData.ongoing,
            listenedTo: formData.listenedTo,
            tone: formData.tone,
            explained: formData.explained,
            canAskColleagues: formData.canAskColleagues,
            canAskBoss: formData.canAskBoss,
            proximity: formData.proximity || undefined,
            boundariesRespected: formData.boundariesRespected?.length ? formData.boundariesRespected : undefined,
            appreciated: formData.appreciated,
            experienceText: formData.experienceText || undefined,
            languages: formData.languages || undefined,
            collective: formData.collective,
            hoursPerWeek: formData.hoursPerWeek ? parseInt(formData.hoursPerWeek) : undefined,
            overtimePerMonth: formData.overtimePerMonth ? parseInt(formData.overtimePerMonth) : undefined,
            trainingShortenable: formData.trainingShortenable,
            partTime: formData.partTime,
            specialtiesOther: formData.specialtiesOther || undefined,
            sharedWithCompany: formData.sharedWithCompany,
            feltComfortableSharing: formData.feltComfortableSharing,
            disabilityTypes: formData.disabilityTypes?.length ? formData.disabilityTypes : undefined,
            disabilitySharedWithCompany: formData.disabilitySharedWithCompany,
            disabilityFeltComfortableSharing: formData.disabilityFeltComfortableSharing,
            ethnicityTypes: formData.ethnicityTypes?.length ? formData.ethnicityTypes : undefined,
            ethnicitySharedWithCompany: formData.ethnicitySharedWithCompany,
            ethnicityFeltComfortableSharing: formData.ethnicityFeltComfortableSharing,
            needsRespected: formData.needsRespected,
            feedback: formData.feedback || undefined,
            moreWishes: formData.moreWishes || undefined,
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
      </div>
    );
  }

  if (companyLoading) {
    return (<i>Lädt...</i>)
  }

  if (landingPage) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-2xl font-bold text-navbar-blue mb-2">Schreib deinen Erfahrungsbericht</h1>
          <p className="text-gray-600 mt-1">
            Teile deine Erfahrung in dem Betrieb <b className="text-bold">{companyName}</b>. Deine offene Rückmeldung hilft anderen, die richtige Wahl zu treffen.

            <p className='pt-2'>Berichte nur über Betriebe, in denen du selbst arbeitest oder gearbeitet hast. Bei dem Bericht geht es um deine subjektive Erfahrung und Empfindung.</p>
          </p>
          <div className='flex flex-row w-full gap-2'>
            <Link
              to="/betriebauswaehlen"
              className="inline-block bg-navbar-blue text-white font-semibold mt-5 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity w-1/2"
            >
              Anderen Betrieb wählen
            </Link>
            <Button onClick={() => setLandingPage(false)} className="w-1/2 bg-gray-200">
              Los geht's
            </Button>

          </div>

        </div>

      </div>
    );
  } else {
    return (
      <ReviewForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitError={error?.message}
      />
    );
  }
};

export default BerichtSchreiben;
