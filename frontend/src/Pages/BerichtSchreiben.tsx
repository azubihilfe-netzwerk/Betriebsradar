import React, { FC } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from 'graphql-tag';
import { ReviewForm, ReviewFormData } from '../components/ReviewForm';
import { CreateReviewMutation, CreateReviewMutationVariables } from '../api/__generated__/graphql';

const CREATE_REVIEW = gql`
  mutation CreateReview($data: ReviewCreateInput!) {
    createReview(data: $data) {
      id
      name
      status
    }
  }
`;

// TODO: Replace with actual company ID from query parameter or context
const FIXED_COMPANY_ID = '1';

const BerichtSchreiben: FC = () => {
  const [createReview, { loading: isSubmitting, error }] = useMutation<
    CreateReviewMutation,
    CreateReviewMutationVariables
  >(CREATE_REVIEW);

  const handleSubmit = async (formData: ReviewFormData) => {
    try {
      await createReview({
        variables: {
          data: {
            name: formData.name,
            email: formData.email || '',
            company: {
              connect: { id: FIXED_COMPANY_ID },
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

      alert('Bericht erfolgreich eingereicht!');
    } catch (err) {
      console.error('Fehler beim Einreichen des Berichts:', err);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-navbar-blue mb-2">Schreib deinen Erfahrungsbericht</h1>
          <p className="text-gray-600">
            Teile deine Erfahrung mit deinem Ausbildungsbetrieb. Deine offene Rückmeldung hilft anderen Auszubildenden, die richtige Wahl zu treffen.
          </p>
        </div>

        <ReviewForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={error?.message}
        />
      </div>
    </>
  );
};

export default BerichtSchreiben;