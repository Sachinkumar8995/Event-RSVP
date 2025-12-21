import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle, HelpCircle, XCircle, AlertCircle } from 'lucide-react';

const MyRSVPsPage = () => {
    const [rsvps, setRsvps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

    const fetchRSVPs = async () => {
        try {
            const { data } = await api.get('/rsvp/my');
            setRsvps(data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load your RSVPs.');
            if (err.response?.status === 401) {
                // Optional: Redirect to login or show login prompt
                setError('Session expired. Please log in again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRSVPs();
    }, []);

    const handleCancelRSVP = async (eventId) => {
        if (!window.confirm("Are you sure you want to cancel your RSVP?")) return;
        try {
            await api.post('/rsvp', { eventId, status: 'not_going' });
            // Refresh list
            fetchRSVPs();
        } catch (error) {
            alert("Failed to cancel RSVP");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

    // Filter and Group Logic
    const now = new Date();
    // Helper to check if event is past (Comparing only Date string YYYY-MM-DD for simplicity, ideally use full timestamp)
    const isPast = (dateStr) => new Date(dateStr) < now.setHours(0, 0, 0, 0);

    const isStartingSoon = (dateStr) => {
        const eventDate = new Date(dateStr);
        const timeDiff = eventDate.getTime() - new Date().getTime();
        return timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000;
    };

    const validRsvps = rsvps.filter(r => r.event); // Safety check
    const pastRSVPs = validRsvps.filter(r => isPast(r.event.date));
    const upcomingRSVPs = validRsvps.filter(r => !isPast(r.event.date) && r.status !== 'not_going');

    // Group upcoming by status
    const goingEvents = upcomingRSVPs.filter(r => r.status === 'going');
    const maybeEvents = upcomingRSVPs.filter(r => r.status === 'maybe');

    const renderEventCard = (rsvp, isPastEvent = false) => (
        <div key={rsvp._id} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${isPastEvent ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            <div className="p-6 sm:flex items-start justify-between gap-6">
                <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                        {isPastEvent ? (
                            <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                                <Clock className="w-4 h-4" /> Past Event
                            </span>
                        ) : (
                            <>
                                {rsvp.status === 'going' ? (
                                    <span className="flex items-center gap-1 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                                        <CheckCircle className="w-4 h-4" /> Going
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full text-sm font-medium">
                                        <HelpCircle className="w-4 h-4" /> Maybe
                                    </span>
                                )}
                                {isStartingSoon(rsvp.event.date) && (
                                    <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                                        <AlertCircle className="w-4 h-4" /> Starts Soon
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                    <Link to={`/events/${rsvp.event._id}`} className="block group">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                            {rsvp.event.title}
                        </h3>
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-500 text-sm mt-3">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {rsvp.event.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {rsvp.event.time}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {rsvp.event.location}
                        </div>
                    </div>
                </div>

                <div className="mt-4 sm:mt-0 flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                    <Link
                        to={`/events/${rsvp.event._id}`}
                        className="btn-secondary w-full sm:w-auto text-center justify-center"
                    >
                        View Details
                    </Link>
                    {!isPastEvent && (
                        <button
                            onClick={() => handleCancelRSVP(rsvp.event._id)}
                            className="text-red-500 text-sm font-medium hover:text-red-700 py-2 transition-colors"
                        >
                            Cancel RSVP
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My RSVPs</h1>

            <div className="flex gap-4 border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'upcoming' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Upcoming ({upcomingRSVPs.length})
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'past' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Past Events ({pastRSVPs.length})
                </button>
            </div>

            {activeTab === 'upcoming' && (
                <div className="space-y-8">
                    {goingEvents.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" /> Going
                            </h2>
                            <div className="grid gap-4">
                                {goingEvents.map(rsvp => renderEventCard(rsvp))}
                            </div>
                        </div>
                    )}

                    {maybeEvents.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-yellow-500" /> Maybe
                            </h2>
                            <div className="grid gap-4">
                                {maybeEvents.map(rsvp => renderEventCard(rsvp))}
                            </div>
                        </div>
                    )}

                    {upcomingRSVPs.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No upcoming RSVPs.</p>
                            <Link to="/" className="text-primary-600 font-medium hover:underline mt-2 inline-block">Explore Events</Link>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'past' && (
                <div className="grid gap-4">
                    {pastRSVPs.length > 0 ? (
                        pastRSVPs.map(rsvp => renderEventCard(rsvp, true))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500">No past events found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyRSVPsPage;
