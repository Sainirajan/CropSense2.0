import React from 'react';
import { Phone, Globe } from 'lucide-react';

const Contact = ({ t }) => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in-up">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.contact.title}</h1>
                <p className="text-xl text-gray-600">{t.contact.subtitle}</p>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-slide-up">
                <div className="contact-icon w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <Phone className="h-12 w-12 text-white animate-ring" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in">{t.contact.phone}</h2>
                <div className="phone-number text-4xl font-bold text-green-600 mb-6 animate-pulse-gentle">99411-75799</div>

                <div className="contact-info bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <p className="text-lg text-gray-700 mb-2">{t.contact.languages}</p>
                    <p className="text-green-600 font-semibold">{t.contact.hours}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="language-item flex items-center justify-center space-x-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <Globe className="h-5 w-5 text-green-600" />
                        <span>മലയാളം</span>
                    </div>
                    <div className="language-item flex items-center justify-center space-x-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <Globe className="h-5 w-5 text-blue-600" />
                        <span>தமிழ்</span>
                    </div>
                    <div className="language-item flex items-center justify-center space-x-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        <Globe className="h-5 w-5 text-purple-600" />
                        <span>English</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Contact;