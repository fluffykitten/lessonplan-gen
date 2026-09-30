import React, { useState } from 'react';
import { Key, X, ExternalLink, ShieldCheck, Check, Cpu, Plus } from 'lucide-react';
import { DEFAULT_GEMINI_MODELS } from '../data/models';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
  selectedModel?: string;
  onSelectModel?: (model: string) => void;
  customModels?: string[];
  onAddCustomModel?: (model: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
  selectedModel = 'gemini-2.5-flash',
  onSelectModel,
  customModels = [],
  onAddCustomModel,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [newModelInput, setNewModelInput] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(tempKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  const handleAddNewModel = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newModelInput.trim();
    if (!trimmed) return;
    if (onAddCustomModel) {
      onAddCustomModel(trimmed);
    }
    if (onSelectModel) {
      onSelectModel(trimmed);
    }
    setNewModelInput('');
    setIsAddingModel(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Key size={20} color="#105b8c" />
            <span>Google Gemini Settings</span>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '1rem' }}>
          Your Gemini API key and model choices are stored <strong>locally in your browser</strong> and never transmitted to any third-party server.
        </p>

        <div className="form-group">
          <label className="form-label" htmlFor="api-key-input">
            Gemini API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            className="form-input"
            placeholder="AIzaSy..."
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            autoFocus
          />
        </div>

        {/* Model Selection in Modal */}
        {onSelectModel && (
          <div className="form-group" style={{ marginTop: '0.85rem', padding: '0.75rem', background: 'var(--input-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Cpu size={14} color="#105b8c" /> AI Model
                </span>
              </label>
              {!isAddingModel && onAddCustomModel && (
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '0.15rem 0.45rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}
                  onClick={() => setIsAddingModel(true)}
                >
                  <Plus size={11} /> Add Model
                </button>
              )}
            </div>

            {!isAddingModel ? (
              <select
                className="form-select"
                value={selectedModel}
                onChange={(e) => {
                  if (e.target.value === '__add_custom__') {
                    setIsAddingModel(true);
                  } else {
                    onSelectModel(e.target.value);
                  }
                }}
                style={{ fontSize: '0.82rem' }}
              >
                <optgroup label="Default Models">
                  {DEFAULT_GEMINI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </optgroup>
                {customModels.length > 0 && (
                  <optgroup label="Custom Added Models">
                    {customModels.map((m) => (
                      <option key={m} value={m}>
                        {m} (Custom)
                      </option>
                    ))}
                  </optgroup>
                )}
                <option value="__add_custom__">+ Write / Add New Model...</option>
              </select>
            ) : (
              <form onSubmit={handleAddNewModel} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.55rem' }}
                    placeholder="e.g. gemini-2.0-flash-exp"
                    value={newModelInput}
                    onChange={(e) => setNewModelInput(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                    disabled={!newModelInput.trim()}
                  >
                    Add Option
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.55rem', fontSize: '0.75rem' }}
                    onClick={() => {
                      setIsAddingModel(false);
                      setNewModelInput('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem',
            marginTop: '0.85rem',
          }}
        >
          <ShieldCheck size={16} color="#10b981" />
          <span>Need a free key? Get one from </span>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'var(--primary-500)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Google AI Studio <ExternalLink size={12} />
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? (
              <>
                <Check size={16} /> Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
