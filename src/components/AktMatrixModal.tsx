import React, { useState } from 'react';
import { Grid, X, Info } from 'lucide-react';

interface AktMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCode?: (code: string) => void;
}

const KNOWLEDGE_DIMS = [
  {
    key: 'F',
    name: 'Factual',
    desc: 'Basic elements, terminology, specific details, formulas, symbols',
  },
  {
    key: 'C',
    name: 'Conceptual',
    desc: 'Interrelations among elements, classifications, principles, theories, models',
  },
  {
    key: 'P',
    name: 'Procedural',
    desc: 'Methods of inquiry, skills, techniques, algorithms, criteria for using methods',
  },
  {
    key: 'M',
    name: 'Metacognitive',
    desc: 'Strategic knowledge, cognitive tasks, self-reflection, contextual learning',
  },
];

const COGNITIVE_LEVELS = [
  { code: 'C1', name: 'Remember', verbs: 'Recall, recognize, list, name, define' },
  { code: 'C2', name: 'Understand', verbs: 'Explain, summarize, classify, infer, compare' },
  { code: 'C3', name: 'Apply', verbs: 'Execute, implement, solve, construct, calculate' },
  { code: 'C4', name: 'Analyze', verbs: 'Differentiate, organize, relate, compare/contrast' },
  { code: 'C5', name: 'Evaluate', verbs: 'Check, critique, judge, assess, defend' },
  { code: 'C6', name: 'Create', verbs: 'Generate, plan, produce, design, formulate' },
];

export const AktMatrixModal: React.FC<AktMatrixModalProps> = ({
  isOpen,
  onClose,
  onSelectCode,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, cognitive: string, knowledge: string) => {
    const formatted = `${code}: ${cognitive} + ${knowledge}`;
    navigator.clipboard.writeText(formatted);
    setCopiedCode(code);
    if (onSelectCode) onSelectCode(formatted);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <Grid size={20} color="#105b8c" />
            <span>Anderson-Krathwohl Taxonomy (AKT) 2D Matrix</span>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            background: 'rgba(16, 91, 140, 0.08)',
            border: '1px solid rgba(16, 91, 140, 0.2)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.82rem',
            color: 'var(--text-main)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem',
          }}
        >
          <Info size={18} color="#105b8c" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Formula: F/C/P/M + C1-6</strong>
            <p style={{ marginTop: '2px', color: 'var(--text-sub)' }}>
              Click on any cell below to copy its standard notation (e.g.,{' '}
              <code>FC1: Remember + Factual</code>, <code>CC2: Understand + Conceptual</code>,{' '}
              <code>PC3: Apply + Procedural</code>, <code>CC4: Analyze + Conceptual</code>).
            </p>
          </div>
        </div>

        {/* Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.78rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ background: 'var(--input-bg)' }}>
                <th
                  style={{
                    border: '1px solid var(--border-color)',
                    padding: '0.5rem',
                    width: '18%',
                  }}
                >
                  Knowledge \ Cognitive
                </th>
                {COGNITIVE_LEVELS.map((col) => (
                  <th
                    key={col.code}
                    style={{
                      border: '1px solid var(--border-color)',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--primary-500)' }}>
                      {col.code}
                    </div>
                    <div>{col.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KNOWLEDGE_DIMS.map((row) => (
                <tr key={row.key}>
                  <td
                    style={{
                      border: '1px solid var(--border-color)',
                      padding: '0.55rem',
                      background: 'var(--input-bg)',
                    }}
                  >
                    <strong>
                      {row.key}: {row.name}
                    </strong>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                      }}
                    >
                      {row.desc}
                    </div>
                  </td>
                  {COGNITIVE_LEVELS.map((col) => {
                    const code = `${row.key}${col.code}`;
                    const isCopied = copiedCode === code;
                    return (
                      <td
                        key={code}
                        onClick={() => handleCopy(code, col.name, row.name)}
                        style={{
                          border: '1px solid var(--border-color)',
                          padding: '0.5rem 0.35rem',
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: isCopied
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'transparent',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isCopied)
                            e.currentTarget.style.backgroundColor =
                              'rgba(16, 91, 140, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isCopied)
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                          {code}
                        </div>
                        <div
                          style={{
                            fontSize: '0.68rem',
                            color: 'var(--text-muted)',
                            marginTop: '2px',
                          }}
                        >
                          {col.name}
                        </div>
                        {isCopied && (
                          <div
                            style={{
                              fontSize: '0.65rem',
                              color: '#10b981',
                              fontWeight: 700,
                              marginTop: '2px',
                            }}
                          >
                            ✓ Copied
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: '1.25rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button className="btn btn-primary" onClick={onClose}>
            Close Matrix Reference
          </button>
        </div>
      </div>
    </div>
  );
};
