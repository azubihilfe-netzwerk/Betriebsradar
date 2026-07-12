import { Routes, Route } from 'react-router-dom';
import Navbar from './Component/Navbar';
import Dashboard from './Pages/Dashboard';
import Imprint from './Pages/misc/Imprint';
import Footer from "./Component/Footer";
import Contact from "./Pages/misc/Contact";
import PrivacyPolicy from "./Pages/misc/PrivacyPolicy";
import Login from "./Pages/misc/Login";
import RegisterCompany from "./Pages/report/RegisterCompany";
import SearchCompanies from "./Pages/read/SearchCompanies";
import CompanyDetail from "./Pages/read/CompanyDetail";
import ReportDetail from "./Pages/read/ReportDetail";
import WriteReport from './Pages/report/WriteReport';
import SelectCompany from './Pages/report/SelectCompany';
import ConfirmEmail from './Pages/report/ConfirmEmail';
import ReportSubmitted from './Pages/report/ReportSubmitted';

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
                            <Route path="/impressum" element={<Imprint />} />
                            <Route path="/kontakt" element={<Contact />} />
                            <Route path="/datenschutz" element={<PrivacyPolicy />} />
                            <Route path="/unternehmeneintragen" element={<RegisterCompany />} />
                            <Route path="/unternehmensuchen" element={<SearchCompanies />} />
                            <Route path="/unternehmen/:id" element={<CompanyDetail />} />
                            <Route path="/betriebauswaehlen" element={<SelectCompany />} />
                            <Route path="/berichtschreiben" element={<WriteReport />} />
                            <Route path="/berichte/:id" element={<ReportDetail />} />
                            <Route path="/verify-email" element={<ConfirmEmail />} />
                            <Route path="/bericht-eingereicht" element={<ReportSubmitted />} />
                        </Routes>
                    </main>
                </div>
           
        
            <Footer />
        </div>
    );
}

export default App;