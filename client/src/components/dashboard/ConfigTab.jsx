import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, Trash2, FileText, Link as LinkIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const ConfigTab = ({ botConfig, updateBotConfig, fetchBotConfig, savingConfig }) => {
  const [localConfig, setLocalConfig] = useState(botConfig || { faqs: [], knowledgeSources: { notionLinks: [] } });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [pdfFile, setPdfFile] = useState(null);
  const [notionLink, setNotionLink] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLocalConfig(botConfig || { faqs: [], knowledgeSources: { notionLinks: [] } });
    setIsDirty(false);
  }, [botConfig]);

  const handleChange = (field, value) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAddFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    setLocalConfig(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), newFaq]
    }));
    setNewFaq({ question: '', answer: '' });
    setIsDirty(true);
  };

  const handleRemoveFaq = (index) => {
    setLocalConfig(prev => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const handleAddNotionLink = () => {
    if (!notionLink.trim()) return;
    setLocalConfig(prev => ({
      ...prev,
      knowledgeSources: {
        ...prev.knowledgeSources,
        notionLinks: [...(prev.knowledgeSources?.notionLinks || []), notionLink]
      }
    }));
    setNotionLink('');
    setIsDirty(true);
  };

  const handleRemoveNotionLink = (index) => {
    setLocalConfig(prev => ({
      ...prev,
      knowledgeSources: {
        ...prev.knowledgeSources,
        notionLinks: (prev.knowledgeSources?.notionLinks || []).filter((_, i) => i !== index)
      }
    }));
    setIsDirty(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setIsDirty(true);
    }
  };

  const handleSaveConfig = async () => {
    if (!isDirty) return;
    try {
      const formData = new FormData();
      formData.append('faqs', JSON.stringify(localConfig.faqs || []));
      formData.append('instructions', localConfig.instructions || '');
      formData.append('botName', localConfig.botName || '');
      formData.append('notionLinks', JSON.stringify(localConfig.knowledgeSources?.notionLinks || []));
      
      if (pdfFile) {
        formData.append('file', pdfFile);
      }
      
      await updateBotConfig(formData);
      await fetchBotConfig(); // Sync state after save
      
      setPdfFile(null);
      setNotionLink('');
      setIsDirty(false);
      toast.success('Bot configuration saved successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save configuration.');
    }
  };

  return (
    <motion.div 
      key="config"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Bot Identity */}
      <div className="card space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Bot Identity</h3>
          <button 
            onClick={handleSaveConfig}
            disabled={savingConfig || !isDirty}
            className="btn-primary py-1.5 px-6 text-sm"
          >
            {savingConfig ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Bot Name</label>
            <input 
              type="text" 
              value={localConfig.botName || ''}
              onChange={(e) => handleChange('botName', e.target.value)}
              className="input-field" 
              placeholder="e.g. Hermes Support"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">AI Instructions</label>
            <textarea 
              value={localConfig.instructions || ''}
              onChange={(e) => handleChange('instructions', e.target.value)}
              className="input-field h-11 resize-none" 
              placeholder="Be helpful and professional..."
            />
          </div>
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="text-accent" size={20} />
            <h3 className="text-lg font-bold text-white">Document Knowledge</h3>
          </div>
          <p className="text-sm text-muted">Upload PDFs containing technical docs or pricing lists.</p>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" 
              accept=".pdf"
            />
            <Upload size={32} className="mx-auto mb-4 text-muted group-hover:text-primary transition-colors" />
            <p className="text-sm font-medium text-white">{pdfFile ? pdfFile.name : 'Click to upload PDF'}</p>
            <p className="text-xs text-muted mt-1">Max file size: 5MB</p>
          </div>
        </div>

        <div className="card space-y-6">
          <div className="flex items-center gap-3">
            <LinkIcon className="text-accent" size={20} />
            <h3 className="text-lg font-bold text-white">External Links</h3>
          </div>
          <p className="text-sm text-muted">Link public Notion pages or documentation URLs.</p>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={notionLink}
                onChange={(e) => setNotionLink(e.target.value)}
                className="input-field" 
                placeholder="https://notion.site/..."
              />
              <button onClick={handleAddNotionLink} className="btn-secondary px-3">
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
              {(localConfig.knowledgeSources?.notionLinks || []).map((link, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2 bg-bg rounded border border-border">
                  <span className="truncate text-text">{link}</span>
                  <Trash2 onClick={() => handleRemoveNotionLink(i)} size={12} className="text-error cursor-pointer hover:text-red-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Editor */}
      <div className="card space-y-6">
        <h3 className="text-xl font-bold text-white">Smart FAQ Matching</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="User Question" 
              value={newFaq.question}
              onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
              className="input-field" 
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Instant Answer" 
                value={newFaq.answer}
                onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                className="input-field" 
              />
              <button 
                onClick={handleAddFaq}
                className="btn-primary px-4"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            {(localConfig.faqs || []).map((faq, index) => (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={index} 
                className="flex justify-between items-start p-4 bg-bg rounded-md border border-border group"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">Q: {faq.question}</p>
                  <p className="text-xs text-muted">A: {faq.answer}</p>
                </div>
                <button 
                  onClick={() => handleRemoveFaq(index)}
                  className="text-error opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfigTab;
