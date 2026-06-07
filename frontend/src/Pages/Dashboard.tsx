import React, { FC } from 'react';
import { PageHeading } from '../components/UI';

const Dashboard: FC = () => {
    console.log("Test")


    return (
        //
            <div>
                <div className="mb-6 px-4 py-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
                    <p className="text-yellow-800 font-semibold">🚧 Wir basteln gerade noch an unserer Website. 🚧</p>
                    <p className="text-yellow-700 text-sm mt-1">Komm' in ein paar Wochen wieder oder schreib uns an <a href='mailto:kontakt@betriebsradar.org' className="text-brand hover:underline">kontakt@betriebsradar.org</a>!</p>
                </div>
               
                <div className="max-w-2xl space-y-2">

                    <PageHeading>Willkommen beim Betriebsradar!</PageHeading>
                    <p>Du suchst einen guten Betrieb für eine Ausbildung oder Arbeit?</p>

                    <p>
                        Hier wirst du in Zukunft einen Bericht über deine Erfahrungen in einem Betrieb schreiben können. Und du wirst auch Berichte von anderen lesen können. Alles anonym.
                    </p>

                    <p>
                        Noch sind wir aber im Ausbau der Website. Habe deshalb noch etwas Geduld und schaue in ein paar Wochen wieder vorbei!
                    </p>

                </div>
            </div>
        
    );
};

export default Dashboard;