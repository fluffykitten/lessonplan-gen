import React from 'react';
import {
  FileText,
  Key,
  Download,
  Moon,
  Sun,
  RotateCcw,
  Image as ImageIcon,
  Grid,
  Cpu,
} from 'lucide-react';

interface HeaderProps {
  apiKey: string;
  onOpenApiKeyModal: () => void;
  onOpenLogoModal: () => void;
  onOpenAktModal: () => void;
  onExportDocx: () => void;
  onResetSample: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isExporting?: boolean;
  selectedModel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  apiKey,
  onOpenApiKeyModal,
  onOpenLogoModal,
  onOpenAktModal,
  onExportDocx,
  onResetSample,
  isDarkMode,
  onToggleTheme,
  isExporting = false,
  selectedModel,
}) => {
  const hasKey = Boolean(apiKey && apiKey.trim().length > 5);

  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-icon-box">
          <FileText size={24} />
        </div>
        <div className="brand-title-group">
          <h1>ICM Lesson Plan Studio</h1>
          <div className="brand-subtitle">
            <span>Insan Cendekia Madani & Cambridge</span>
            <span className="badge-tag">SPK Standard</span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        {/* Customize Header Logos */}
        <button
          className="btn btn-outline"
          onClick={onOpenLogoModal}
          title="Change or upload custom header logos for ICM and Cambridge"
        >
          <ImageIcon size={15} />
          <span>Change Logos</span>
        </button>

        {/* AKT 2D Matrix Helper */}
        <button
          className="btn btn-outline"
          onClick={onOpenAktModal}
          title="View Anderson-Krathwohl Taxonomy (AKT) F/C/P/M + C1-6 Matrix Guide"
        >
          <Grid size={15} />
          <span>AKT Matrix (F/C/P/M)</span>
        </button>

        {/* API Key Status / Config */}
        <button
          className={`btn ${hasKey ? 'btn-outline' : 'btn-accent'}`}
          onClick={onOpenApiKeyModal}
          title={hasKey ? 'Gemini API Key Connected' : 'Connect Gemini API Key'}
        >
          <Key size={15} />
          <span>{hasKey ? 'API Key Active' : 'Set Gemini Key'}</span>
          {hasKey && (
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
              }}
            />
          )}
        </button>

        {/* Active AI Model Badge */}
        {selectedModel && (
          <div
            title={`Current active model: ${selectedModel}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--input-bg)',
              color: 'var(--primary-600)',
            }}
          >
            <Cpu size={14} color="#105b8c" />
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedModel}
            </span>
          </div>
        )}

        {/* Reset to Sample Plan */}
        <button
          className="btn btn-outline"
          onClick={onResetSample}
          title="Load default Grade 10 Chemistry sample"
        >
          <RotateCcw size={15} />
          <span>Reset Sample</span>
        </button>

        {/* Primary Export to Word .docx Button */}
        <button
          className="btn btn-primary"
          onClick={onExportDocx}
          disabled={isExporting}
          title="Download production-ready Microsoft Word (.docx) file"
        >
          {isExporting ? (
            <div className="spinner" />
          ) : (
            <>
              <Download size={16} />
              <span>Export Word (.docx)</span>
            </>
          )}
        </button>

        {/* Dark/Light Theme Switcher */}
        <button
          className="btn-icon"
          onClick={onToggleTheme}
          aria-label="Toggle color theme"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
