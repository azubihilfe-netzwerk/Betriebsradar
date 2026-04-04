import React, { FC } from 'react';

const Dashboard: FC = () => {
    console.log("Test")


    return (
        //
        <div className="max-w-3xl mx-auto">
            <div className="min-h-screen flex flex-col justify-start pt-6">
                <div className="mb-6 px-4 py-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
                    <p className="text-yellow-800 font-semibold">🚧 Wir basteln gerade noch an unserer Website. 🚧</p>
                    <p className="text-yellow-700 text-sm mt-1">Komm' in ein paar Wochen wieder oder schreib uns an <a href='mailto:kontakt@betriebsradar.org' className="text-teal-700 hover:underline">kontakt@betriebsradar.org</a>!</p>
                </div>
               
                <div className="mt-1 text-gray-700 max-w-2xl space-y-2">

                    <b className='text-xl font-bold text-navbar-blue'>Willkommen beim Betriebsradar!</b>
                    <p>Du suchst einen guten Betrieb für eine Ausbildung oder Arbeit?</p>

                    <p>
                        Hier wirst du in Zukunft einen Bericht über deine Erfahrungen in einem Betrieb schreiben können. Und du wirst auch Berichte von anderen lesen können. Alles anonym.
                    </p>

                    <p>
                        Noch sind wir aber im Ausbau der Website. Habe deshalb noch etwas Geduld und schaue in ein paar Wochen wieder vorbei!
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;