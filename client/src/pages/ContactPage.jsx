import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Get in Touch</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">Have questions? We'd love to hear from you.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Contact Info */}
                <div className="space-y-8 col-span-1">
                    <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl text-primary-600 dark:text-primary-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Email Us</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">noreplyeventhub12@gmail.com</p>
                            </div>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">We usually respond within 24 hours.</p>
                    </div>

                    <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl text-primary-600 dark:text-primary-400">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Call Us</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">+91 1234567890</p>
                            </div>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Mon-Fri from 9am to 6pm.</p>
                    </div>

                    <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl text-primary-600 dark:text-primary-400">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Visit Us</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Lovely professional university <br /> Phagwara  Punjab  </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-2 bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
                    <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                <input type="text" className="input-field dark:bg-dark-900 dark:border-dark-600 dark:text-white" placeholder="Enter your first name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                <input type="text" className="input-field dark:bg-dark-900 dark:border-dark-600 dark:text-white" placeholder="Enter your last name" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <input type="email" className="input-field dark:bg-dark-900 dark:border-dark-600 dark:text-white" placeholder="Enter your email" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                            <textarea rows="5" className="input-field dark:bg-dark-900 dark:border-dark-600 dark:text-white" placeholder="Enter your message"></textarea>
                        </div>

                        <button className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                            <Send className="w-5 h-5" /> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
