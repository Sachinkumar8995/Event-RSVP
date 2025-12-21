import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Calendar, User, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800 shadow-sm sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-primary-600 dark:text-primary-500 font-bold text-xl">
                            <Calendar className="w-6 h-6" />
                            <span>EventHub</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                            Home
                        </Link>
                        <Link to="/explore" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                            Explore
                        </Link>
                        <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                            About
                        </Link>
                        <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                            Contact
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-600 dark:text-gray-300 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <>
                                <Link to="/my-rsvps" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                                    My RSVPs
                                </Link>
                                {user.isAdmin && (
                                    <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <div className="flex items-center gap-4 pl-6 border-l border-gray-100 dark:border-dark-800">
                                    <Link to="/profile" className="flex items-center gap-2 text-gray-900 dark:text-white font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <span>{user.name}</span>
                                    </Link>
                                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 pl-6 border-l border-gray-100 dark:border-dark-800">
                                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
