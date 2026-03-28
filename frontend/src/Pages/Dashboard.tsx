import React, { FC } from 'react';

const Dashboard: FC = () => {
    console.log("Test")


    return (
        //
        <div className="max-w-3xl mx-auto">
            <div className="min-h-screen flex flex-col justify-start pt-6 ">
                <div className="mb-6 px-4 py-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
                    <p className="text-yellow-800 font-semibold">🚧 Wir basteln gerade noch an unserer Website. 🚧</p>
                    <p className="text-yellow-700 text-sm mt-1">Komm in ein paar Wochen wieder oder schreib uns an <a href='mailto:kontakt@betriebsradar.org' className="text-teal-700 hover:underline">kontakt@betriebsradar.org</a>!</p>
                </div>
                <h1 className="text-4xl font-bold text-navbar-blue">Betriebsradar</h1>
                <b className='py-2'>Willkommen beim Betriebsradar!</b>
                <div className="mt-4 text-gray-700 max-w-2xl">

                    <p className="mb-4">Du willst im Handwerk arbeiten und hast Lust auf einen Betrieb,
                        in dem du dich wohlfühlen kannst? Wir auch. </p>

                    <p className="mb-4">Auf dieser Seite kannst du nach Betrieben im deutschsprachigen Raum suchen, die zu dir passen.
                        Egal ob du für ein Praktikum oder eine Ausbildung suchst; Eine Anstellung als Gesell*n, Meister*in oder Bauhelfer*in, oder einfach neugierig bist: du verdienst einen guten Arbeitsplatz!
                        Wenn du schon Erfahrungen in Handwerksbetrieben gemacht hast, kannst du auf dieser Seite davon berichten und anderen damit bei der Einschätzung helfen, ob es ein Ort ist, an dem sie gerne arbeiten wollen.
                    </p>

                    <p className="mb-4">
                        Für eine fairere Arbeitswelt im Handwerk!
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;