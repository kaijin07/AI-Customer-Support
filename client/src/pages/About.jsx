import React from 'react';

const About = () => {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-8 py-16">
      <h1 className="text-4xl font-bold mb-8">About Hermes AI</h1>
      
      <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>
          Welcome to Hermes AI, the next-generation platform for automating your business's customer support.
        </p>
        <p>
          We believe that support teams spend too much time answering the same redundant questions. Hermes AI allows you to configure specific FAQs and custom instructions for a powerful AI chatbot that handles Tier 1 support completely automatically.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Why AI Customer Support Matters</h2>
        <p>
          In a modern, fast-paced world, customers expect instant answers 24/7. By leveraging cutting-edge Large Language Models (LLMs), our chatbot understands semantic context, handles follow-up questions gracefully, and crucially—knows when to step aside.
        </p>
        <p>
          If a user becomes frustrated, or explicitly asks to talk to a human, our Smart Escalation system instantly routes their request into an organized Support Ticket, ensuring your human agents step in exactly when they are needed most.
        </p>
      </div>
    </div>
  );
};

export default About;
