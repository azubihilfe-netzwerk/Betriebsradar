import React, { FC } from 'react';
import { Link } from 'react-router';

const Berichte: FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start pt-6 ">
            <h1 className="text-4xl font-bold text-navbar-blue" text-navbar-blue>Bericht schreiben</h1>
            
            <h2 className='text-xl font-bold text-navbar-blue'>Meine Berichte</h2>
        </div>
    )
};

export default Berichte;