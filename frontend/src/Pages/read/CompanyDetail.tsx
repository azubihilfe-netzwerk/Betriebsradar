import { gql } from 'graphql-tag';
import { FC } from 'react';
import { useQuery } from '@apollo/client/react';
import { useParams } from 'react-router-dom';
import { GetCompanyDetailQuery } from '../../api/__generated__/graphql';
import Card from '../../components/UI/Card';
import { PageHeading } from '../../components/UI/Heading';
import ReportCard from '../../components/Company/ReportCard';

const companySizeLabels: Record<string, string> = {
    _1to5: '1–5 Mitarbeitende',
    _5to10: '5–10 Mitarbeitende',
    _10to30: '10–30 Mitarbeitende',
    _30to50: '30–50 Mitarbeitende',
    _50to250: '50–250 Mitarbeitende',
    _250plus: 'ab 250 Mitarbeitende',
};

const CompanyDetail: FC = () => {
    const { id } = useParams<{ id: string }>();
    const { loading, error, data } = useQuery<GetCompanyDetailQuery>(
        gql`
           query GetCompanyDetail($id: ID!) {
                company(where:  {
                   id: $id
                }) {
                    id
                    name
                    trade
                    address
                    contact
                    size
                    reviewsCount
                    reviews {
                        id
                        position
                        yearOfHiring
                        yearOfLeaving
                        ongoing
                        experienceText
                        feedback
                        moreWishes
                        specialtiesOther
                        languages
                        gender
                        ageAtEmployment
                        hoursPerWeek
                        overtimePerMonth
                        partTime
                        collective
                        trainingShortenable
                        listenedTo
                        canAskBoss
                        canAskColleagues
                        tone
                        explained
                        proximity
                        appreciated
                        boundariesRespected
                        genderIdentityRespected
                        needsRespected
                        sharedWithCompany
                        feltComfortableSharing
                        disabilityTypes
                        disabilitySharedWithCompany
                        disabilityFeltComfortableSharing
                        ethnicityTypes
                        ethnicitySharedWithCompany
                        ethnicityFeltComfortableSharing
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
    const reviews = [...(company.reviews ?? [])].sort(
        (a, b) => Number(b.yearOfHiring ?? 0) - Number(a.yearOfHiring ?? 0)
    );

    return (
        <div className="max-w-4xl">
            <Card className="mb-8">
                <PageHeading className="text-brand mb-4">{company.name}</PageHeading>
                <div className="grid grid-cols-1 gap-4 text-gray-700 sm:grid-cols-2">
                    <div>
                        <p className="font-semibold">Gewerk</p>
                        <p>{company.trade}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Adresse</p>
                        <p>{company.address}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Betriebsgröße</p>
                        <p>{company.size ? companySizeLabels[company.size] ?? company.size : '–'}</p>
                    </div>
                    {company.contact && (
                        <div>
                            <p className="font-semibold">Kontakt</p>
                            <p>{company.contact}</p>
                        </div>
                    )}
                </div>
            </Card>

            <div>
                <h2 className="text-xl font-bold text-brand mb-4">Berichte ({company.reviewsCount ?? reviews.length})</h2>
                {reviews.length === 0 ? (
                    <p className="text-gray-600">Noch keine Berichte vorhanden.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <ReportCard key={review.id} review={review} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyDetail;
