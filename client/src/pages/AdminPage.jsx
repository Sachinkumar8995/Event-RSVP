import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { Plus, Trash2, Edit, Users, Calendar, X, CheckCircle, HelpCircle, XCircle, User, Shield, ShieldAlert, Mail } from 'lucide-react';

const AdminPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Tabs state
    const [activeTab, setActiveTab] = useState('events'); // 'events' or 'users'

    // Events State
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: ''
    });

    // Users State
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    // Attendees Modal State
    const [showAttendeesModal, setShowAttendeesModal] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [attendeesLoading, setAttendeesLoading] = useState(false);
    const [selectedEventTitle, setSelectedEventTitle] = useState('');

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
            return;
        }
        fetchEvents();
    }, [user, navigate]);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (error) {
            console.error('Failed to fetch events', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const { data } = await api.get('/auth/users');
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
            alert('Failed to fetch users');
        } finally {
            setUsersLoading(false);
        }
    };

    // Event Handlers
    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                setEvents(events.filter(event => event._id !== id));
            } catch (error) {
                alert('Failed to delete event');
            }
        }
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setFormData({ title: '', description: '', date: '', time: '', location: '', category: '' });
        setShowModal(true);
    };

    const openEditModal = (event) => {
        setIsEditing(true);
        setCurrentEventId(event._id);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date ? event.date.split('T')[0] : '',
            time: event.time,
            location: event.location,
            category: event.category || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const { data } = await api.put(`/events/${currentEventId}`, formData);
                setEvents(events.map(ev => ev._id === currentEventId ? data : ev));
            } else {
                const { data } = await api.post('/events', formData);
                setEvents([...events, data]);
            }
            setShowModal(false);
        } catch (error) {
            alert(`Failed to ${isEditing ? 'update' : 'create'} event`);
        }
    };

    const openAttendeesModal = async (event) => {
        setSelectedEventTitle(event.title);
        setShowAttendeesModal(true);
        setAttendeesLoading(true);
        try {
            const { data } = await api.get(`/rsvp/event/${event._id}`);
            setAttendees(data);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch attendees');
        } finally {
            setAttendeesLoading(false);
        }
    };

    const getStatusCounts = () => {
        const counts = { going: 0, maybe: 0, not_going: 0 };
        attendees.forEach(a => counts[a.status] = (counts[a.status] || 0) + 1);
        return counts;
    };

    // User Handlers
    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            try {
                await api.delete(`/auth/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                console.error(error);
                alert('Failed to delete user');
            }
        }
    };

    const handleMakeAdmin = async (id) => {
        if (window.confirm('Promote this user to Admin?')) {
            try {
                const { data } = await api.put(`/auth/${id}/make-admin`);
                setUsers(users.map(u => u._id === id ? { ...u, isAdmin: true } : u));
            } catch (error) {
                console.error(error);
                alert('Failed to promote user');
            }
        }
    };

    const handleSendReminder = async (eventId) => {
        if (window.confirm('Send reminder emails to all users who RSVP\'d as "going" or "maybe"?')) {
            try {
                const { data } = await api.post(`/events/${eventId}/send-reminder`);
                alert(data.message + `\nSuccess: ${data.success}, Failed: ${data.failed}`);
            } catch (error) {
                console.error(error);
                alert('Failed to send reminder emails: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                {activeTab === 'events' && (
                    <button
                        onClick={openCreateModal}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Create Event
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`pb-3 px-1 flex items-center gap-2 font-medium transition-colors border-b-2 ${activeTab === 'events'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Calendar className="w-5 h-5" /> Manage Events
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-3 px-1 flex items-center gap-2 font-medium transition-colors border-b-2 ${activeTab === 'users'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Users className="w-5 h-5" /> Manage Users
                </button>
            </div>

            {/* Events Content */}
            {activeTab === 'events' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Event Name</th>
                                <th className="p-4 font-semibold text-gray-600">Date & Time</th>
                                <th className="p-4 font-semibold text-gray-600">Location</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.map(event => (
                                <tr key={event._id} className="hover:bg-gray-50/50">
                                    <td className="p-4 font-medium text-gray-900">{event.title}</td>
                                    <td className="p-4 text-gray-600">
                                        <div className="flex flex-col">
                                            <span>{event.date}</span>
                                            <span className="text-sm text-gray-400">{event.time}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{event.location}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(event)}
                                                className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Event"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openAttendeesModal(event)}
                                                className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                title="View Attendees"
                                            >
                                                <Users className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleSendReminder(event._id)}
                                                className="text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                                                title="Send Reminder Emails"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvent(event._id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Event"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {events.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No events found. Create one!</div>
                    )}
                </div>
            )}

            {/* Users Content */}
            {activeTab === 'users' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {usersLoading ? (
                        <div className="p-8 text-center">Loading users...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">User</th>
                                    <th className="p-4 font-semibold text-gray-600">Email</th>
                                    <th className="p-4 font-semibold text-gray-600">Role</th>
                                    <th className="p-4 font-semibold text-gray-600">Member Since</th>
                                    <th className="p-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50/50">
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-900">{u.name}</span>
                                        </td>
                                        <td className="p-4 text-gray-600">{u.email}</td>
                                        <td className="p-4">
                                            {u.isAdmin ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    <Shield className="w-3 h-3" /> Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    <User className="w-3 h-3" /> User
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {!u.isAdmin && (
                                                    <button
                                                        onClick={() => handleMakeAdmin(u._id)}
                                                        className="text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                                                        title="Promote to Admin"
                                                    >
                                                        <ShieldAlert className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!usersLoading && users.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No users found.</div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="input-field"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="input-field"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="input-field"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    required
                                    className="input-field"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Select a category</option>
                                    <option value="Music & Concerts">Music & Concerts</option>
                                    <option value="Tech & Workshops">Tech & Workshops</option>
                                    <option value="Food & Drink">Food & Drink</option>
                                    <option value="Arts & Culture">Arts & Culture</option>
                                    <option value="Sports & Fitness">Sports & Fitness</option>
                                    <option value="Business">Business</option>
                                    <option value="Networking">Networking</option>
                                    <option value="Charity">Charity</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary py-2.5"
                                >
                                    {isEditing ? 'Save Changes' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Attendees Modal */}
            {showAttendeesModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl animate-in fade-in zoom-in duration-200 max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6 flex-shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Attendees</h2>
                                <p className="text-sm text-gray-500">{selectedEventTitle}</p>
                            </div>
                            <button onClick={() => setShowAttendeesModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {attendeesLoading ? (
                            <div className="flex-grow flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-3 gap-4 mb-6 flex-shrink-0">
                                    <div className="bg-green-50 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-green-700">{getStatusCounts().going}</div>
                                        <div className="text-xs font-medium text-green-600 uppercase">Going</div>
                                    </div>
                                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-yellow-700">{getStatusCounts().maybe}</div>
                                        <div className="text-xs font-medium text-yellow-600 uppercase">Maybe</div>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-red-700">{getStatusCounts().not_going}</div>
                                        <div className="text-xs font-medium text-red-600 uppercase">Not Going</div>
                                    </div>
                                </div>

                                <div className="overflow-y-auto flex-grow">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="p-3 text-sm font-semibold text-gray-600">Name</th>
                                                <th className="p-3 text-sm font-semibold text-gray-600">Email</th>
                                                <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {attendees.map(a => (
                                                <tr key={a._id} className="hover:bg-gray-50/50">
                                                    <td className="p-3 text-gray-900 font-medium">{a.user?.name || 'Unknown'}</td>
                                                    <td className="p-3 text-gray-500 text-sm">{a.user?.email || '-'}</td>
                                                    <td className="p-3">
                                                        {a.status === 'going' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Going</span>}
                                                        {a.status === 'maybe' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Maybe</span>}
                                                        {a.status === 'not_going' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Not Going</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                            {attendees.length === 0 && (
                                                <tr>
                                                    <td colSpan="3" className="p-4 text-center text-gray-500">No RSVPs yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
