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

    return (
        <nav className="bg-white shadow-md fixed w-full z-10">
            <div className="max-w-7xl mx-auto pl-2 pr-4 py-6 flex justify-between items-center">
                {/* Logo + Schriftzug */}
                <div className="flex items-center space-x-3">
                    <img src={logo} alt="Logo" className="h-16 w-auto" />
                    <span className="text-2xl font-bold uppercase" style={{ color: '#1a5d5d' }}>Betriebsradar</span>

                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link to="/" className="text-gray-700 hover:text-navbar-blue  text-lg uppercase font-semibold">Home</Link>

                    {/* Unternehmen mit Dropdown */}
                    <Link to="/unternehmensuchen" className="text-gray-700 hover:text-navbar-blue text-lg uppercase font-semibold">Suchen</Link>

                    <Link to="/berichte" className="text-gray-700 hover:text-navbar-blue text-lg uppercase font-semibold">Berichten</Link>

                    <Link to="/kontakt" className="text-gray-700 hover:text-navbar-blue text-lg uppercase font-semibold">Kontakt</Link>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-300">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm text-gray-700">
                                    {user?.email}
                                </span>
                                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    Abmelden
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-semibold">
                                Anmelden
                            </Link>
                        )}
                    </div>
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
                <div className="md:hidden bg-white px-4 pb-4 space-y-2">
                    <Link to="/" className="block text-gray-700 hover:text-navbar-blue text-lg uppercase font-semibold">Home</Link>
                    <Link to="/unternehmensuchen" className="block text-gray-700 hover:text-navbar-blue text-lg uppercase font-semibold">Suchen</Link>

                    <Link to="/berichte" className="block text-gray-700 hover:text-navbar-blue text-lg uppercase font-semibold">Berichten</Link>

                    <Link to="/kontakt" className="block text-gray-700 hover:text-navbar-blue text-lg uppercase font-semibold">Kontakt</Link>

                    {/* Mobile Auth */}
                    <div className="pt-4 border-t border-gray-200 mt-4">
                        {isAuthenticated ? (
                            <>
                                <p className="text-sm text-gray-700 mb-2">
                                    Angemeldet als: <strong>{user?.email}</strong>
                                </p>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Abmelden
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="block w-full text-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-semibold"
                                onClick={() => setMenuOpen(false)}
                            >
                                Anmelden
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
