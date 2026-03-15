import React, { FC } from 'react';
import { Link, useParams } from 'react-router';

const BerichtDetail: FC = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div className="min-h-screen flex flex-col items-center justify-start pt-6 ">
            <h1 className="text-4xl font-bold text-navbar-blue" text-navbar-blue>Bericht {id}</h1>
            
        </div>
    )
};

export default BerichtDetail;