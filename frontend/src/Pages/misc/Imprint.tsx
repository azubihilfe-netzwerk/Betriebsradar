import React, { FC } from 'react';
import { PageHeading, SectionHeading } from '../../components/UI';

const Imprint: FC = () => {
    return (
        <div className="max-w-2xl space-y-2">
      
        <PageHeading>Impressum</PageHeading>

        <p>
            Azubihilfe Netzwerk e.V.<br/>
            Fettstr. 23<br/>
            20357 Hamburg
        </p>

<SectionHeading>Registereintrag</SectionHeading>
        <p>
            Registergericht: Amtsgericht Hamburg<br/>
            Registernummer: VR26284
        </p>
            

        <SectionHeading>Einzelvertretungsberechtigt</SectionHeading>    
        <p>
            Vorstandsmitglieder:<br/>

            Antonia Kemper<br/>
            Leonore Becker<br/>
            Samantha Dessington<br/>
            Lea Tresbach<br/>

        </p>

        <SectionHeading>Kontakt</SectionHeading>
            <p>E-Mail: <a href="mailto:kontakt@betriebsradar.org" className="text-brand hover:underline">kontakt@betriebsradar.org</a>
        </p>

        <SectionHeading>Haftungsausschluss</SectionHeading>
        <p>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt verlinkter Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>
      
    </div>
    );
};

export default Imprint;