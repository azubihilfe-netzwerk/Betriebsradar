import React, { FC } from 'react';
import { PageHeading, SectionHeading } from '../../components/UI';

const PrivacyPolicy: FC = () => {
    return (
        <div className="max-w-2xl space-y-2">
            <PageHeading>Datenschutzerklärung</PageHeading>

            <SectionHeading>1. Verantwortlicher</SectionHeading>
            <p>
                Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br />
                Azubihilfe Netzwerk e.V.<br />
                Fettstr. 23<br />
                20357 Hamburg<br />
                E-Mail: <a href="mailto:kontakt@betriebsradar.org" className="text-brand hover:underline">kontakt@betriebsradar.org</a>
            </p>
            <p>
                Weitere Angaben finden sich im <a href="/imprint" className="text-brand hover:underline">Impressum</a>.
            </p>

            <SectionHeading>2. Übersicht der Verarbeitungen</SectionHeading>
            <p>
                Betriebsradar ist eine Plattform, auf der Auszubildende, Praktikant*innen und andere
                Beschäftigte anonyme Erfahrungsberichte über Ausbildungs- und
                Praktikumsbetriebe veröffentlichen können. Im Rahmen der Nutzung der Plattform
                verarbeiten wir personenbezogene Daten in folgenden Fällen:
            </p>
            <ul className="list-disc pl-6">
                <li>Bereitstellung der Website und Gewährleistung ihrer Sicherheit und Stabilität</li>
                <li>Einreichung, Bearbeitung und Veröffentlichung von Erfahrungsberichten</li>
                <li>Verifizierung der E-Mail-Adresse bei Einreichung eines Berichts</li>
                <li>Anzeige von Betriebsstandorten auf einer Karte</li>
                <li>Login-Funktion für Redakteur*innen und Administrator*innen</li>
                <li>Beantwortung von Kontaktanfragen per E-Mail</li>
            </ul>

            <SectionHeading>3. Hosting</SectionHeading>
            <p>
                Diese Website wird bei dem externen Dienstleister (Hosting-Provider) uberspace (<a href="https://uberspace.de" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">uberspace.de</a>) gehostet. Die
                personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den
                Servern des Hosters gespeichert. Hierbei handelt es sich um Server-Logfiles (siehe 4.), sowie die persistente Speicherung der Daten, die du über die Website eingibst (Informationen zu Betrieben und Erfahrungsberichte).
            </p>
            <p>
                Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren
                potenziellen und bestehenden Nutzer*innen (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse
                einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch
                einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
            <p>
                Mit dem Hoster wurde ein Vertrag über Auftragsverarbeitung (AVV) gemäß Art. 28 DSGVO
                geschlossen.
            </p>

            <SectionHeading>4. Server-Logfiles</SectionHeading>
            <p>
                Beim Aufruf unserer Website erhebt der Hosting-Provider automatisch Informationen in
                sogenannten Server-Logfiles, die dein Browser automatisch übermittelt. Dies sind:
            </p>
            <ul className="list-disc pl-6">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse (anonymisiert)</li>
            </ul>
            <p>
                Diese Daten werden nicht mit anderen Datenquellen zusammengeführt. Die Erfassung
                erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Betreiber der Website hat ein
                berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung
                seiner Website. Die IP-Adresse wird nach Ende des Aufrufs bzw. nach Ablauf der
                hosterseitig üblichen Speicherfrist gelöscht.
            </p>

            <SectionHeading>5. Erfahrungsberichte über Betriebe</SectionHeading>
            <p>
                Wenn du über unser Formular einen Erfahrungsbericht über einen Ausbildungs- oder
                Praktikumsbetrieb einreichst, verarbeiten wir die von dir dort eingegebenen Daten.
                Dazu können neben allgemeinen Angaben zum Betrieb und zur Ausbildungssituation auch
                Angaben gehören, die besonderen Kategorien personenbezogener Daten im Sinne von
                Art. 9 Abs. 1 DSGVO unterfallen, etwa zu Gesundheit, Behinderung, ethnischer Herkunft,
                Religionszugehörigkeit oder geschlechtlicher Identität, sofern du diese Angaben
                freiwillig machst.
            </p>
            <p>
                Die Angabe dieser Daten ist stets freiwillig und optional. Rechtsgrundlage für die
                Verarbeitung ist deine ausdrückliche Einwilligung gemäß Art. 9 Abs. 2 lit. a DSGVO i. V. m.
                Art. 6 Abs. 1 lit. a DSGVO, die du durch das freiwillige Ausfüllen und Absenden der
                entsprechenden Formularfelder erteilst. Du kannst diese Einwilligung jederzeit mit
                Wirkung für die Zukunft widerrufen, indem du uns unter den in Ziffer 1 genannten
                Kontaktdaten kontaktierst.
            </p>
            <p>
                Für die Angabe des Namens und der E-Mail-Adresse ist Rechtsgrundlage
                Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO, da diese Angaben zur Bearbeitung deiner Einreichung
                (insbesondere zur E-Mail-Verifizierung sowie zur Ermöglichung nachträglicher
                Änderungen und Kontaktaufnahme mit dir durch unsere Redaktion) erforderlich sind.
            </p>
            <p>
                Berichte werden vor der Veröffentlichung redaktionell durch unsere Redaktion
                gesichtet. Veröffentlichte Berichte sind für alle Besucher*innen der Website öffentlich
                einsehbar; die E-Mail-Adresse und der Name werden dabei nicht veröffentlicht und sind nur für unsere
                Redaktion sowie zur internen Verwaltung des Berichts einsehbar.
            </p>

            <SectionHeading>6. E-Mail-Verifizierung</SectionHeading>
            <p>
                Nach dem Einreichen eines Erfahrungsberichts versenden wir an die von dir
                angegebene E-Mail-Adresse eine automatische E-Mail mit einem individuellen
                Bestätigungslink (Zugriffsschlüssel). Dieser dient dazu, zu bestätigen, dass die
                E-Mail-Adresse tatsächlich von dir stammt, und ermöglicht es dir, deinen Bericht
                auch ohne Erstellung eines Nutzerkontos später einzusehen oder zu bearbeiten. Der
                Versand erfolgt über unseren E-Mail-Versanddienstleister. Rechtsgrundlage ist
                Art. 6 Abs. 1 lit. b DSGVO.
            </p>

            <SectionHeading>7. Standortdaten der Betriebe und Kartendarstellung</SectionHeading>
            <p>
                Zur Darstellung von Betrieben auf einer Karte ermitteln wir aus den angegebenen
                Adressdaten (Straße, Hausnummer, PLZ, Ort) einmalig die geographischen Koordinaten
                über den Geokodierungsdienst Nominatim von OpenStreetMap. Zur Anzeige der Karte
                selbst werden Kartenkacheln (Tiles) direkt von den Servern von OpenStreetMap
                geladen; dabei wird deine IP-Adresse an OpenStreetMap übertragen, da dies technisch
                erforderlich ist. Anbieter ist die OpenStreetMap Foundation, St John&apos;s Innovation
                Centre, Cowley Road, Cambridge, CB4 0WS, Vereinigtes Königreich. Weitere Informationen
                findest du in der{' '}
                <a
                    href="https://wiki.osmfoundation.org/wiki/Privacy_Policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline"
                >
                    Datenschutzerklärung von OpenStreetMap
                </a>.
                Rechtsgrundlage ist unser berechtigtes Interesse an einer übersichtlichen, kartenbasierten
                Darstellung der Betriebe (Art. 6 Abs. 1 lit. f DSGVO).
            </p>

            <SectionHeading>8. Nutzerkonten für Redaktion und Verwaltung</SectionHeading>
            <p>
                Für Mitglieder unserer Redaktion und Administration bestehen Nutzerkonten mit Name,
                E-Mail-Adresse und Passwort, über die Erfahrungsberichte gesichtet, freigegeben und
                verwaltet werden können. Nach erfolgreichem Login wird ein Sitzungstoken sowie dein
                Nutzername und deine E-Mail-Adresse im lokalen Speicher (Local Storage) deines Browsers
                abgelegt, um dich während deiner Sitzung angemeldet zu halten. Diese Daten verbleiben
                ausschließlich auf deinem Endgerät und werden mit dem Logout bzw. dem Löschen der
                Browserdaten wieder entfernt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b und lit. f DSGVO
                (Erfüllung des Nutzungsverhältnisses und technisch notwendige Funktion).
                Die Erstellung eines Nutzerkontos erfolgt nur nach expliziter Zustimmung zu dieser Datenverarbeitung (Art. 6 Abs. 1 lit. a DSGVO).
            </p>

            <SectionHeading>9. Cookies und Tracking</SectionHeading>
            <p>
                Wir setzen auf unserer Website keine Cookies zu Marketing- oder Analysezwecken ein. Zum Tracking nutzen wir das Analysetool Matomo, das wir selbst beim Hosting-Provider uberspace betreiben. Dabei werden keine personenbezogenen Daten verarbeitet.
            </p>

            <SectionHeading>10. Kontaktaufnahme per E-Mail</SectionHeading>
            <p>
                Wenn du uns per E-Mail kontaktierst, werden deine Angaben (E-Mail-Adresse, ggf. Name
                und Nachricht) zum Zweck der Bearbeitung deiner Anfrage bei uns gespeichert.
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern die Anfrage der Anbahnung oder
                Erfüllung eines Vertrags dient, andernfalls Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres
                berechtigten Interesses an der Beantwortung von Anfragen.
            </p>

            <SectionHeading>11. Speicherdauer</SectionHeading>
            <p>
                Wir speichern personenbezogene Daten nur so lange, wie dies für die jeweiligen Zwecke
                erforderlich ist oder wie es gesetzliche Aufbewahrungspflichten vorsehen. E-Mail-Adressen
                zu Erfahrungsberichten werden nur so lange gespeichert, wie dies zur Verwaltung und
                nachträglichen Bearbeitung des jeweiligen Berichts erforderlich ist. Server-Logfiles werden
                nach kurzer Zeit automatisiert gelöscht. Bei Widerruf einer Einwilligung löschen wir die
                betroffenen Daten, soweit keine gesetzliche Aufbewahrungspflicht entgegensteht.
            </p>

            <SectionHeading>12. Weitergabe von Daten</SectionHeading>
            <p>
                Eine Übermittlung deiner personenbezogenen Daten an Dritte erfolgt nur, soweit dies zur
                Erbringung unseres Angebots erforderlich ist (insbesondere an unseren Hosting-Provider
                sowie unseren E-Mail-Versanddienstleister als Auftragsverarbeiter gemäß Art. 28 DSGVO)
                oder soweit wir gesetzlich dazu verpflichtet sind. Eine Übermittlung zu Werbezwecken
                findet nicht statt.
            </p>

            <SectionHeading>13. Deine Rechte als betroffene Person</SectionHeading>
            <p>Dir stehen bezüglich deiner bei uns gespeicherten personenbezogenen Daten folgende Rechte zu:</p>
            <ul className="list-disc pl-6">
                <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                <li>Recht auf Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
            </ul>
            <p>
                Zur Ausübung dieser Rechte kannst du dich jederzeit an die in Ziffer 1 genannten
                Kontaktdaten wenden.
            </p>
            <p>
                Darüber hinaus steht dir ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde
                zu, insbesondere in dem Mitgliedstaat deines gewöhnlichen Aufenthaltsorts, deines
                Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes. Zuständige Aufsichtsbehörde
                für den Verantwortlichen ist:
            </p>
            <p>
                Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit<br />
                Ludwig-Erhard-Str. 22, 20459 Hamburg<br />
                <a href="https://datenschutz-hamburg.de" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                    datenschutz-hamburg.de
                </a>
            </p>

            <SectionHeading>14. Datensicherheit</SectionHeading>
            <p>
                Wir verwenden innerhalb des Website-Besuchs das verbreitete TLS-Verfahren
                (Transport Layer Security) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe,
                die von deinem Browser unterstützt wird. Passwörter werden ausschließlich in gehashter
                Form gespeichert.
            </p>

            <SectionHeading>15. Änderung dieser Datenschutzerklärung</SectionHeading>
            <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den
                aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen
                in der Datenschutzerklärung umzusetzen. Für deinen erneuten Besuch gilt dann die neue
                Datenschutzerklärung.
            </p>
            <p className="text-sm text-gray-500">Stand: August 2026</p>
        </div>
    );
};

export default PrivacyPolicy;
