import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const EmbedTab = ({ user }) => {
  const [copied, setCopied] = useState(false);

  // Ensure we don't duplicate /api in the path
  const apiBase = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const cleanApiBase = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
  const embedCode = `<script src="${cleanApiBase}/embed/script?businessId=${user?._id}"></script>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success('Embed code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      key="embed"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-8"
    >
      <div className="card space-y-8 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-5 blur-3xl rounded-full"></div>
        
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Embed Your Chatbot</h2>
          <p className="text-muted mb-8">Deploy your intelligent assistant to any website with a single line of code. Simply paste this snippet before the <code className="text-accent">&lt;/body&gt;</code> tag.</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <pre className="bg-bg p-6 rounded-lg border border-border text-sm font-mono overflow-x-auto text-accent">
              {embedCode}
            </pre>
            <button 
              onClick={copyEmbedCode}
              className="absolute top-4 right-4 p-2 bg-surface border border-border rounded-md hover:text-white transition-colors"
            >
              {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
            </button>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Check size={14} className="text-success" />
              <span>Instant updates</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Check size={14} className="text-success" />
              <span>Zero configuration needed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Check size={14} className="text-success" />
              <span>Fully responsive widget</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-linear-to-br from-surface to-bg">
          <h3 className="font-bold mb-4 text-white">Need help?</h3>
          <p className="text-sm text-muted mb-6">Check our documentation for advanced customization options like custom themes and event tracking.</p>
          <button className="btn-secondary w-full">Read Docs</button>
        </div>
        <div className="card border-primary/30 border-dashed">
          <h3 className="font-bold mb-4 text-white">Custom Branding</h3>
          <p className="text-sm text-muted mb-6">Upgrade to Premium to remove "Powered by Hermes" and use your own custom CSS.</p>
          <button className="btn-primary w-full">Upgrade Now</button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmbedTab;
