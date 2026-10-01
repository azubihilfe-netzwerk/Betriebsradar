import React, { FC } from 'react';
import { PageHeading, SectionHeading } from '../../components/UI';
import { LinkButton } from '../../components/Form';

const Contact: FC = () => {
    return (
        <div className="max-w-2xl space-y-2">

            <PageHeading>Kontakt</PageHeading>

            <p>
                Du hast Fragen oder Anmerkungen oder möchtest gerne mithelfen, das Betriebsradar weiter zu entwickeln??<br/>
                Wir suchen noch Leute im Projektmanagement und im Bereich Coding.
            </p>

            <p>
                Kontaktiere uns gerne per Mail:                <a href="mailto:kontakt@betriebsradar.org" className="text-brand-link hover:underline">kontakt@betriebsradar.org</a>
            </p>

            <SectionHeading>Crowdfunding</SectionHeading>

            <p>
                Falls du uns finanziell unterstützen möchtest, dann geht das über unser Crowdfunding – 
                 vielen Dank!!
            </p>

            <LinkButton to="https://gofund.me/c40ff38cb" target="_blank" rel="noopener noreferrer">
                Zum Crowdfunding (gofund.me)
            </LinkButton>

        </div>
    );
};

export default Contact;
