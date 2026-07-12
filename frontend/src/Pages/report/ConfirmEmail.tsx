import React, { FC, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from 'graphql-tag';
import { useSearchParams } from 'react-router-dom';

const VERIFY_EMAIL = gql`
  mutation VerifyReviewEmail($accessKey: String!) {
    verifyReviewEmail(accessKey: $accessKey)
  }
`;

const ConfirmEmail: FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verified, setVerified] = useState<boolean | null>(null);

  const [verifyEmail, { loading, error }] = useMutation<
    { verifyReviewEmail: boolean | null },
    { accessKey: string }
  >(VERIFY_EMAIL);

  useEffect(() => {
    if (!token) return;
    verifyEmail({ variables: { accessKey: token } })
      .then(({ data }) => setVerified(data?.verifyReviewEmail ?? false))
      .catch(() => setVerified(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!token) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-red-600 text-lg font-medium">Kein Bestätigungstoken gefunden.</p>
        <p className="text-gray-500 mt-2">
          Bitte klicke auf den Link in deiner Bestätigungs-E-Mail.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-gray-600 text-lg">E-Mail wird bestätigt …</p>
      </div>
    );
  }

  if (error || verified === false) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Bestätigung fehlgeschlagen</h1>
        <p className="text-gray-600">
          Der Link ist ungültig oder bereits verwendet. Bitte kontaktiere uns, falls du Hilfe
          benötigst.
        </p>
      </div>
    );
  }

  if (verified === true) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold text-brand mb-4">
          E-Mail erfolgreich bestätigt!
        </h1>
        <p className="text-gray-600">
          Vielen Dank! Dein Erfahrungsbericht wird nun von unserem Team geprüft und anschließend
          veröffentlicht.
        </p>
      </div>
    );
  }

  return null;
};

export default ConfirmEmail;
