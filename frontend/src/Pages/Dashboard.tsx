import React, { FC } from 'react';
import { PageHeading, Paragraph } from '../components/UI';

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
                <p>
                    Du hast selbst schon Erfahrungen in Handwerksbetrieben gesammelt und möchtest diese teilen? Dann bist du hier richtig.
                </p>

                <p>
                    Über das Formular kannst du anonym einen Bericht verfassen. Berichte können Mut machen oder Leute vor unangenehmen Situationen schützen.
                </p>

                <p>
                    Aber Achtung: Du kannst deine subjektive Meinung äußern und wahrheitsgemäße Tatsachen berichten.
                    Wir achten das Recht auf Meinungsfreiheit, solange deine Beiträge nicht strafrechtlich relevant, beleidigend oder diffamierend sind.
                </p>

                <p>
                    Danke für deinen Beitrag!
                </p>


            </div>
        </div>

    );
};

export default Dashboard;