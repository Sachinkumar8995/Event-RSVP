import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Calendar, MapPin, Clock, ArrowLeft, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const EventDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rsvpStatus, setRsvpStatus] = useState(null); // 'going', 'not_going', 'maybe'

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data); // In real app, date format parsing needed

                if (user) {
                    // Check my existing RSVP (simple fetch for demo, ideally dedicated endpoint)
                    const myRsvps = await api.get('/rsvp/my');
                    const existing = myRsvps.data.find(r => r.event._id === id);
                    if (existing) setRsvpStatus(existing.status);
                }
            } catch (error) {
                console.error('Error loading event', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, user]);

    const handleRSVP = async (status) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post('/rsvp', { eventId: id, status });
            setRsvpStatus(status);
            alert(`RSVP Updated: ${status}`);
        } catch (error) {
            alert('Failed to update RSVP');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!event) return <div>Event not found.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Events
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                            <p className="text-gray-500 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> {event.location}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-3 rounded-lg h-fit">
                            <Calendar className="w-5 h-5" />
                            <span className="font-semibold">{event.date}</span>
                            <span className="w-px h-4 bg-primary-200 mx-2"></span>
                            <Clock className="w-5 h-5" />
                            <span className="font-semibold">{event.time}</span>
                        </div>
                    </div>

                    <div className="prose prose-blue max-w-none text-gray-600 mb-10">
                        <h3 className="text-gray-900 font-semibold text-lg mb-2">About this event</h3>
                        <p className="whitespace-pre-line leading-relaxed">{event.description}</p>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                        <h3 className="text-gray-900 font-semibold mb-6 flex items-center gap-2">
                            Your RSVP Status
                            {rsvpStatus && <span className="ml-auto text-sm font-normal text-gray-500">Current: <span className="uppercase font-semibold text-primary-600">{rsvpStatus.replace('_', ' ')}</span></span>}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button
                                onClick={() => handleRSVP('going')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${rsvpStatus === 'going' ? 'bg-green-50 border-green-200 text-green-700 ring-1 ring-green-500' : 'border-gray-200 hover:border-green-200 hover:bg-green-50/50'}`}
                            >
                                <CheckCircle className={`w-6 h-6 ${rsvpStatus === 'going' ? 'fill-current' : ''}`} />
                                <span className="font-semibold">Going</span>
                            </button>

                            <button
                                onClick={() => handleRSVP('maybe')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${rsvpStatus === 'maybe' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 ring-1 ring-yellow-500' : 'border-gray-200 hover:border-yellow-200 hover:bg-yellow-50/50'}`}
                            >
                                <HelpCircle className={`w-6 h-6 ${rsvpStatus === 'maybe' ? 'fill-current' : ''}`} />
                                <span className="font-semibold">Maybe</span>
                            </button>

                            <button
                                onClick={() => handleRSVP('not_going')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${rsvpStatus === 'not_going' ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500' : 'border-gray-200 hover:border-red-200 hover:bg-red-50/50'}`}
                            >
                                <XCircle className={`w-6 h-6 ${rsvpStatus === 'not_going' ? 'fill-current' : ''}`} />
                                <span className="font-semibold">Not Going</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
