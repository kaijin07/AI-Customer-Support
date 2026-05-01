import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareText, Settings, Bot } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 text-center flex flex-col items-center">
        <div className="p-4 bg-primary/10 rounded-full mb-6 text-primary">
          <Bot size={64} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white max-w-3xl">
          AI-Powered Customer Support for Modern Businesses
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
          Automate your support, resolve queries instantly with intelligent FAQs, and escalate seamlessly to human agents when needed.
        </p>
        <div className="flex gap-4">
          <Link to="/signup" className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-md transition-colors text-lg">
            Get Started Free
          </Link>
          <Link to="/login" className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-md transition-colors text-lg">
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center flex flex-col items-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full mb-4">
              <MessageSquareText size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Responses</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Deliver semantic, context-aware responses to user queries instantly using state-of-the-art language models.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center flex flex-col items-center">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full mb-4">
              <Bot size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Automation</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Save tokens and time with instant FAQ exact-matching. Set custom instructions to guide bot behavior.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center flex flex-col items-center">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-full mb-4">
              <Settings size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ticket System</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Automatically detect frustrated users or explicit requests for human support, escalating them instantly into trackable tickets.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
