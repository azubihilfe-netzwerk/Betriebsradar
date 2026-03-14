import { gql } from 'graphql-tag';
import React, { FC } from 'react';
import { useQuery } from '@apollo/client/react';
import { useParams } from 'react-router-dom';

type Review = {
    id: string;
    name: string;
    yearOfHiring: number;
    experienceText: string;
};

type Company = {
    id: string;
    name: string;
    trade: string;
    locations: string;
    reviewsCount: number;
    industry: string;
    collective: boolean;
    hoursPerWeek: number;
    trainingShortenable: boolean;
    partTime: boolean;
};

type GetCompanyDetailData = {
    company: Company & { reviews: Review[] };
};

const UnternehmenDetail: FC = () => {
    const { id } = useParams<{ id: string }>();
    const { loading, error, data } = useQuery<GetCompanyDetailData>(
        gql`
           query GetCompanyDetail($id: ID!) {
                company(where:  {
                   id: $id
                }) {
                    id
                    name
                    trade
                    locations
                    industry
                    collective
                    hoursPerWeek
                    trainingShortenable
                    partTime
                    reviewsCount
                    reviews {
                        id
                        name
                        yearOfHiring
                        experienceText
                    }
                }
            }
        `,
        { variables: { id } }
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data?.company) return <p>Unternehmen nicht gefunden.</p>;

    const company = data.company;

    return (
        <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h1 className="text-2xl font-bold text-navbar-blue mb-2">{company.name}</h1>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                    <div>
                        <p className="font-semibold">Gewerk:</p>
                        <p>{company.trade}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Adresse:</p>
                        <p>{company.locations}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Branche:</p>
                        <p>{company.industry}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Kollektiv:</p>
                        <p>{company.collective ? 'Ja' : 'Nein'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">h/Woche:</p>
                        <p>{company.hoursPerWeek}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Ausbildung verkürzbar:</p>
                        <p>{company.trainingShortenable ? 'Ja' : 'Nein'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Teilzeit:</p>
                        <p>{company.partTime ? 'Ja' : 'Nein'}</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-1xl font-bold text-navbar-blue mb-4">Berichte ({company.reviews.length})</h2>
                {company.reviews.length === 0 ? (
                    <p className="text-gray-600">Noch keine Berichte vorhanden.</p>
                ) : (
                    <div className="space-y-4">
                        {company.reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-navbar-blue">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold">{review.name}</h3>

                                </div>
                                <p className="text-gray-700 mb-2">{review.experienceText}</p>
                                <p className="text-sm text-gray-500">
                                    {review.yearOfHiring}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnternehmenDetail;
