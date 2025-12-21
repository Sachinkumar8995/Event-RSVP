import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Shield, LogOut } from 'lucide-react';

const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                            <User className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500">Member since {new Date().getFullYear()}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 mb-0.5">Email Address</p>
                                <p className="font-medium text-gray-900">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <Shield className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 mb-0.5">Account Role</p>
                                <p className="font-medium text-gray-900">
                                    {user.isAdmin ? 'Administrator' : 'Standard User'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
