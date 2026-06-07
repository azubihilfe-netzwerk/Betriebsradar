import { Routes, Route } from 'react-router-dom';
import Navbar from './Component/Navbar';
import Dashboard from './Pages/Dashboard';
import Impressum from './Pages/Impressum';
import Footer from "./Component/Footer";
import Kontakt from "./Pages/Kontakt";
import Datenschutz from "./Pages/Datenschutz";
import Login from "./Pages/Login";
import UnternehmenEintragen from "./Pages/UnternehmenEintragen";
import UnternehmenSuchen from "./Pages/UnternehmenSuchen";
import UnternehmenDetail from "./Pages/UnternehmenDetail";
import BerichtDetail from "./Pages/BerichtDetail";
import BerichtSchreiben from './Pages/BerichtSchreiben';
import UnternehmenAuswaehlen from './Pages/UnternehmenAuswaehlen';
import EmailBestaetigen from './Pages/EmailBestaetigen';
import BerichtEingereicht from './Pages/BerichtEingereicht';

// 📥 Bild importieren
import backgroundImage from "./images/Webseite-Hintergrund.png";

function App() {
    return (
        <div
            className="flex flex-col min-h-screen bg-brand-input bg-center"
        >
            <Navbar />
                <div className="max-w-screen-2xl mx-auto w-full flex flex-col flex-1">
                    <main className="max-w-3xl mx-auto py-8 px-6 mt-28 flex-1 w-full bg-brand-bg shadow-md">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/impressum" element={<Impressum />} />
                            <Route path="/kontakt" element={<Kontakt />} />
                            <Route path="/datenschutz" element={<Datenschutz />} />
                            <Route path="/unternehmeneintragen" element={<UnternehmenEintragen />} />
                            <Route path="/unternehmensuchen" element={<UnternehmenSuchen />} />
                            <Route path="/unternehmen/:id" element={<UnternehmenDetail />} />
                            <Route path="/betriebauswaehlen" element={<UnternehmenAuswaehlen />} />
                            <Route path="/berichtschreiben" element={<BerichtSchreiben />} />
                            <Route path="/berichte/:id" element={<BerichtDetail />} />
                            <Route path="/verify-email" element={<EmailBestaetigen />} />
                            <Route path="/bericht-eingereicht" element={<BerichtEingereicht />} />
                        </Routes>
                    </main>
                </div>
           
        
            <Footer />
        </div>
    );
}

export default App;