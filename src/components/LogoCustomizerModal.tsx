import React, { useState } from 'react';
import { Image as ImageIcon, X, Upload, RotateCcw, Check, Sparkles } from 'lucide-react';
import { createIcmLogoPng, createCambridgeLogoPng } from '../assets/logos';

interface LogoCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  leftLogo: string;
  rightLogo: string;
  onSaveLogos: (left: string, right: string) => void;
}

export const LogoCustomizerModal: React.FC<LogoCustomizerModalProps> = ({
  isOpen,
  onClose,
  leftLogo,
  rightLogo,
  onSaveLogos,
}) => {
  const defaultLeft = React.useMemo(() => createIcmLogoPng(), []);
  const defaultRight = React.useMemo(() => createCambridgeLogoPng(), []);

  const [currentLeft, setCurrentLeft] = useState<string>(leftLogo || defaultLeft);
  const [currentRight, setCurrentRight] = useState<string>(rightLogo || defaultRight);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: 'left' | 'right'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (side === 'left') {
        setCurrentLeft(result);
      } else {
        setCurrentRight(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLeft = () => {
    setCurrentLeft(defaultLeft);
  };

  const handleResetRight = () => {
    setCurrentRight(defaultRight);
  };

  const handleApply = () => {
    onSaveLogos(currentLeft, currentRight);
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <ImageIcon size={20} color="#105b8c" />
            <span>Customize Document Header Logos</span>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '1.25rem' }}>
          Customize the logos appearing at the top of both the <strong>interactive preview</strong> and your exported <strong>Microsoft Word (.docx)</strong> document.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Left Logo Card (ICM / School Logo) */}
          <div
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1rem',
              background: 'var(--input-bg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Left Logo (School)</span>
              <button
                type="button"
                className="btn-icon"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                onClick={handleResetLeft}
                title="Reset to default ICM Logo"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {/* Preview Box */}
            <div
              style={{
                height: '75px',
                background: '#ffffff',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                overflow: 'hidden',
              }}
            >
              <img
                src={currentLeft}
                alt="Left Logo Preview"
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Upload Button */}
            <label
              className="btn btn-outline"
              style={{ fontSize: '0.78rem', padding: '0.45rem', cursor: 'pointer' }}
            >
              <Upload size={14} />
              <span>Upload Custom Logo</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e, 'left')}
              />
            </label>
          </div>

          {/* Right Logo Card (Cambridge / Board Logo) */}
          <div
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1rem',
              background: 'var(--input-bg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Right Logo (Exam Board)</span>
              <button
                type="button"
                className="btn-icon"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                onClick={handleResetRight}
                title="Reset to default Cambridge Logo"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {/* Preview Box */}
            <div
              style={{
                height: '75px',
                background: '#ffffff',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                overflow: 'hidden',
              }}
            >
              <img
                src={currentRight}
                alt="Right Logo Preview"
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Upload Button */}
            <label
              className="btn btn-outline"
              style={{ fontSize: '0.78rem', padding: '0.45rem', cursor: 'pointer' }}
            >
              <Upload size={14} />
              <span>Upload Custom Logo</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e, 'right')}
              />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Supports PNG, JPEG, SVG with transparent or solid background.
          </span>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleApply}>
              {applied ? (
                <>
                  <Check size={16} /> Applied!
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Save & Apply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
