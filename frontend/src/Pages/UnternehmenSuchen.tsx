import { gql } from 'graphql-tag';
import React, { FC } from 'react';
import { useQuery } from '@apollo/client/react';
import { Link } from 'react-router-dom';

type Company = {
    id: string;
    name: string;
    trade: string;
    locations: string;
    reviewsCount: number;
};

type GetCompaniesData = {
    companies: Company[];
};

const CompanyTable: FC = () => {
    const { loading, error, data } = useQuery<GetCompaniesData>(gql`
                        query GetCompanies {
                            companies {
                                id
                                name
                                trade
                                locations
                                reviewsCount
                            }
    }`
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-navbar-blue py-4" text-navbar-blue>Unternehmen finden</h1>
            <p className="mb-6 text-gray-700 max-w-2xl">
                Hier kannst Du nach Unternehmen suchen und sehen, welche Berichte bereits zu jedem Unternehmen vorliegen.
            </p>
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                    <thead className="text-left">
                        <tr>
                            <th className="px-4 py-2 border-b">Name</th>
                            <th className="px-4 py-2 border-b">Gewerk</th>
                            <th className="px-4 py-2 border-b">Adresse</th>
                            <th className="px-4 py-2 border-b">Anzahl Berichte</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.companies.map((company) => (
                            <tr key={company.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b">
                                    <Link to={`/unternehmen/${company.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                                        {company.name}
                                    </Link>
                                </td>
                                <td className="px-4 py-2 border-b">{company.trade}</td>
                                <td className="px-4 py-2 border-b">{company.locations}</td>
                                <td className="px-4 py-2 border-b text-center">{company.reviewsCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h2 className='text-l font-bold text-navbar-blue py-4'>Karte</h2>
        </div>);

}

export default CompanyTable;