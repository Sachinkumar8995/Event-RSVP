import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, Clock, Search, Filter, X, Tag } from 'lucide-react';

const ExplorePage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchParams, setSearchParams] = useSearchParams();

    const categories = [
        'All',
        'Music & Concerts',
        'Tech & Workshops',
        'Food & Drink',
        'Arts & Culture',
        'Sports & Fitness',
        'Business',
        'Networking',
        'Charity'
    ];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/events');
                setEvents(data);
                setFilteredEvents(data);
            } catch (error) {
                console.error('Failed to load events', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Check URL parameter for category on mount
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam && categories.includes(categoryParam)) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    useEffect(() => {
        const results = events.filter(event => {
            const matchesSearch = (event.title + event.description + event.location).toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        setFilteredEvents(results);
    }, [searchTerm, events, selectedCategory]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 dark:border-dark-800 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Events</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Discover what's happening around you</p>
                </div>

                {/* Search Bar */}
                <div className="w-full md:w-auto relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search events, locations..."
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full md:w-80 bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X className="h-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                <Tag className="w-5 h-5 text-gray-400 flex-shrink-0" />
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <Link key={event._id} to={`/events/${event._id}`} className="group relative block h-full">
                        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-dark-700 h-full flex flex-col hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                            {/* Dummy Image for visual appeal - using random hash to keep it consistent per event */}
                            <div className="h-48 bg-gray-200 dark:bg-dark-700 relative overflow-hidden">
                                <img
                                    src={`https://images.unsplash.com/photo-${event._id.charCodeAt(0) % 2 === 0 ? '1492684223066-81342ee5ff30' : '1501281668745-13bc6a60fe3d'}?auto=format&fit=crop&w=800&q=80`}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-600 dark:text-primary-400">
                                    {event.date}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                                    {event.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-grow">{event.description}</p>

                                <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-dark-700 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-xl border border-dashed border-gray-200 dark:border-dark-700">
                    <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No events found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search terms</p>
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
