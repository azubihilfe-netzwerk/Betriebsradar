import React, { useState } from 'react';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../images/Logo_schwarz-2048x2048.png'; // Pfad anpassen!

const Navbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showUnternehmenSubmenu, setShowUnternehmenSubmenu] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="bg-brand-navbar shadow-md border-b-2 border-blackish fixed w-full z-50">
            <div className="max-w-7xl mx-auto pl-2 pr-4 py-6 flex justify-between items-center">
                {/* Logo + Schriftzug */}
                <div className="flex items-center space-x-3">
                    <img src={logo} alt="Logo" className="h-16 w-auto" />
                    <span className="text-2xl font-bold uppercase text-blackish">Betriebsradar</span>

                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link to="/" className="text-gray-700 hover:text-blackish  text-lg uppercase font-semibold">Home</Link>

                    {/* Unternehmen mit Dropdown */}
                    <Link to="/unternehmensuchen" className="text-gray-700 hover:text-blackish text-lg uppercase font-semibold">Suchen</Link>

                    <Link to="/betriebauswaehlen" className="text-gray-700 hover:text-blackish text-lg uppercase font-semibold">Berichten</Link>

                    <Link to="/kontakt" className="text-gray-700 hover:text-blackish text-lg uppercase font-semibold">Kontakt</Link>

                </div>

                {/* Mobile Button */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Links */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2">
                    <Link onClick={closeMenu} to="/" className="block text-gray-700 hover:text-brand text-lg uppercase font-semibold">Home</Link>
                    <Link onClick={closeMenu} to="/unternehmensuchen" className="block text-gray-700 hover:text-brand text-lg uppercase font-semibold">Suchen</Link>

                    <Link onClick={closeMenu} to="/betriebauswaehlen" className="block text-gray-700 hover:text-brand text-lg uppercase font-semibold">Berichten</Link>

                    <Link onClick={closeMenu} to="/kontakt" className="block text-gray-700 hover:text-brand text-lg uppercase font-semibold">Kontakt</Link>

                </div>
            )}
        </nav>
    );
};

export default Navbar;
