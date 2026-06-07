import { FC } from 'react';
import LinkButton from '../components/Form/LinkButton';

const BerichtEingereicht: FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-brand mb-4">
        Vielen Dank für deinen Bericht!
      </h1>

      <p className="text-gray-700 mb-8">
        Dein Erfahrungsbericht ist bei uns eingegangen. Damit er veröffentlicht werden kann, sind
        noch zwei kurze Schritte nötig:
      </p>

      <ol className="space-y-6 mb-10">
        <li className="flex gap-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">
            1
          </span>
          <div>
            <p className="font-semibold text-gray-800">E-Mail bestätigen</p>
            <p className="text-gray-600 text-sm mt-1">
              Wir haben dir eine E-Mail mit einem Bestätigungslink geschickt. Bitte klicke auf
              diesen Link, damit wir wissen, dass die Adresse dir gehört. Schau auch im
              Spamordner nach, wenn du nichts siehst.
            </p>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">
            2
          </span>
          <div>
            <p className="font-semibold text-gray-800">Redaktionelle Prüfung</p>
            <p className="text-gray-600 text-sm mt-1">
              Nach der E-Mail-Bestätigung liest unser Team deinen Bericht durch und veröffentlicht
              ihn, wenn er unsere Richtlinien erfüllt. Falls nicht, melden wir uns bei dir per
              Mail. Das dauert in der Regel ein paar Tage.
            </p>
          </div>
        </li>
      </ol>

      <p className="text-gray-600 text-sm mb-8">
        Fragen? Schreib uns an{' '}
        <a href="mailto:kontakt@betriebsradar.org" className="text-brand hover:underline">
          kontakt@betriebsradar.org
        </a>
        .
      </p>

      <LinkButton to="/" size="lg">
        Zur Startseite
      </LinkButton>
    </div>
  );
};

export default BerichtEingereicht;
