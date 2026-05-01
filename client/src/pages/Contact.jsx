import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    // Just UI mock
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Have questions about Hermes AI? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">support@hermesai.example.com</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Phone</h3>
              <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Office</h3>
              <p className="text-gray-600 dark:text-gray-400">123 AI Boulevard, Tech District<br/>San Francisco, CA 94105</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
          {submitted && (
            <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-md text-center">
              Thank you! Your message has been sent.
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:ring-2 focus:ring-primary"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={onChange}
                required
                rows="4"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:ring-2 focus:ring-primary"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-md transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
