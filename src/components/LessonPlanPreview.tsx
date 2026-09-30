import React from 'react';
import {
  Download,
  Copy,
  Printer,
  CheckCircle2,
  FileCheck,
  Type,
} from 'lucide-react';
import type { LessonPlanData, LessonSession } from '../types/lessonPlan';
import { createIcmLogoPng, createCambridgeLogoPng } from '../assets/logos';

interface LessonPlanPreviewProps {
  plan: LessonPlanData;
  onUpdatePlan: (updatedPlan: LessonPlanData) => void;
  onExportDocx: () => void;
  isExporting?: boolean;
  customLeftLogo?: string;
  customRightLogo?: string;
  onOpenLogoModal?: () => void;
  fontFamily: string;
  onChangeFontFamily: (font: string) => void;
  fontSizePt: number;
  onChangeFontSizePt: (size: number) => void;
  lineSpacing: number;
  onChangeLineSpacing: (spacing: number) => void;
  paragraphSpacing: number;
  onChangeParagraphSpacing: (spacing: number) => void;
  isDraftSaved?: boolean;
}

export const LessonPlanPreview: React.FC<LessonPlanPreviewProps> = ({
  plan,
  onUpdatePlan,
  onExportDocx,
  isExporting = false,
  customLeftLogo,
  customRightLogo,
  onOpenLogoModal,
  fontFamily,
  onChangeFontFamily,
  fontSizePt,
  onChangeFontSizePt,
  lineSpacing = 1.5,
  onChangeLineSpacing,
  paragraphSpacing = 1.5,
  onChangeParagraphSpacing,
  isDraftSaved = true,
}) => {
  const [copied, setCopied] = React.useState(false);

  const icmLogoData = React.useMemo(() => createIcmLogoPng(360, 110), []);
  const cambridgeLogoData = React.useMemo(() => createCambridgeLogoPng(420, 110), []);

  const activeLeftLogo = customLeftLogo || icmLogoData;
  const activeRightLogo = customRightLogo || cambridgeLogoData;

  const handleCopyFormattedText = () => {
    const el = document.getElementById('lesson-plan-paper');
    if (!el) return;

    // Use clipboard API
    try {
      const type = 'text/html';
      const blob = new Blob([el.innerHTML], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      navigator.clipboard.write(data).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // fallback
      navigator.clipboard.writeText(el.innerText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Updaters for session fields
  const updateSession = (idx: number, patch: Partial<LessonSession>) => {
    const newSessions = [...plan.sessions];
    newSessions[idx] = { ...newSessions[idx], ...patch };
    onUpdatePlan({ ...plan, sessions: newSessions });
  };

  const updateIcmIndicator = (
    idx: number,
    key: keyof LessonSession['icmIndicators']
  ) => {
    const current = plan.sessions[idx].icmIndicators;
    const updated = { ...current, [key]: !current[key] };
    updateSession(idx, { icmIndicators: updated });
  };

  const updateTeachingSequence = (
    idx: number,
    key: keyof LessonSession['sequenceOfTeaching']
  ) => {
    const current = plan.sessions[idx].sequenceOfTeaching;
    const updated = { ...current, [key]: !current[key] };
    updateSession(idx, { sequenceOfTeaching: updated });
  };

  const updateDifferentiation = (
    idx: number,
    key: keyof LessonSession['differentiation']
  ) => {
    const current = plan.sessions[idx].differentiation;
    const updated = { ...current, [key]: !current[key] };
    updateSession(idx, { differentiation: updated });
  };

  return (
    <main className="preview-panel">
      {/* Top Preview Action Bar */}
      <div className="preview-toolbar">
        <div className="preview-toolbar-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <FileCheck size={20} color="#105b8c" />
          <span>Interactive Document Preview</span>
          {isDraftSaved && (
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
              title="All edits and notes are automatically saved to your browser local draft."
            >
              <CheckCircle2 size={11} /> Draft Saved
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Font Family & Size Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              borderRight: '1px solid var(--border-color)',
              paddingRight: '0.55rem',
              marginRight: '0.2rem',
            }}
          >
            <Type size={14} color="var(--primary-500)" />
            <select
              className="form-select"
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', width: 'auto' }}
              value={fontFamily}
              onChange={(e) => onChangeFontFamily(e.target.value)}
              title="Change typography font for document preview and Word export"
            >
              <option value="Arial">Arial (ICM Standard)</option>
              <option value="Calibri">Calibri (Office)</option>
              <option value="Times New Roman">Times New Roman (Academic)</option>
              <option value="Aptos">Aptos (Modern MS)</option>
              <option value="Inter">Inter (Sans)</option>
              <option value="Georgia">Georgia (Editorial)</option>
              <option value="Garamond">Garamond (Classic Serif)</option>
            </select>
            <select
              className="form-select"
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', width: 'auto' }}
              value={fontSizePt}
              onChange={(e) => onChangeFontSizePt(parseInt(e.target.value))}
              title="Adjust base font size"
            >
              <option value={10}>10 pt (Compact)</option>
              <option value={11}>11 pt (Standard)</option>
              <option value={12}>12 pt (Medium)</option>
              <option value={13}>13 pt (Large)</option>
            </select>
            <select
              className="form-select"
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', width: 'auto' }}
              value={lineSpacing}
              onChange={(e) => onChangeLineSpacing(parseFloat(e.target.value))}
              title="Line spacing (default 1.5)"
            >
              <option value={1.0}>1.0 (Single)</option>
              <option value={1.15}>1.15</option>
              <option value={1.25}>1.25</option>
              <option value={1.5}>1.5 (Default)</option>
              <option value={1.75}>1.75</option>
              <option value={2.0}>2.0 (Double)</option>
            </select>
            <select
              className="form-select"
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', width: 'auto' }}
              value={paragraphSpacing}
              onChange={(e) => onChangeParagraphSpacing(parseFloat(e.target.value))}
              title="Paragraph spacing (default 1.5)"
            >
              <option value={1.0}>¶ 1.0 (Compact)</option>
              <option value={1.25}>¶ 1.25 (Tight)</option>
              <option value={1.5}>¶ 1.5 (Default)</option>
              <option value={1.75}>¶ 1.75 (Relaxed)</option>
              <option value={2.0}>¶ 2.0 (Spacious)</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
            onClick={handleCopyFormattedText}
            title="Copy formatted content to paste directly into Microsoft Word or Google Docs"
          >
            {copied ? (
              <>
                <CheckCircle2 size={14} color="#10b981" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
            onClick={handlePrint}
            title="Print or Save as PDF via browser"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
            onClick={onExportDocx}
            disabled={isExporting}
            title="Download true Microsoft Word (.docx) file matching this template"
          >
            {isExporting ? (
              <div className="spinner" />
            ) : (
              <>
                <Download size={14} />
                <span>Download .docx</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Replicated Paper Document */}
      <div
        className="paper-document"
        id="lesson-plan-paper"
        style={{
          fontFamily: fontFamily || 'Arial',
          fontSize: `${fontSizePt || 11}pt`,
          lineHeight: lineSpacing || 1.5,
          ['--doc-line-height' as any]: lineSpacing || 1.5,
          ['--doc-para-spacing' as any]: paragraphSpacing || 1.5,
        }}
      >
        {/* Header with Logos and Academic Year */}
        <div className="doc-header-table">
          <div
            onClick={onOpenLogoModal}
            style={{ cursor: onOpenLogoModal ? 'pointer' : 'default', position: 'relative' }}
            title="Click to customize left school logo"
          >
            {activeLeftLogo ? (
              <img src={activeLeftLogo} alt="School Logo" className="doc-logo-img" />
            ) : (
              <strong>ICM INSAN CENDEKIA MADANI</strong>
            )}
          </div>
          <div>
            <div
              onClick={onOpenLogoModal}
              style={{ cursor: onOpenLogoModal ? 'pointer' : 'default', position: 'relative' }}
              title="Click to customize right exam board logo"
            >
              {activeRightLogo ? (
                <img
                  src={activeRightLogo}
                  alt="Exam Board Logo"
                  className="doc-logo-img"
                />
              ) : (
                <small>Cambridge Assessment International Education</small>
              )}
            </div>
            <div className="doc-academic-year">
              Academic Year:{' '}
              <span
                contentEditable
                suppressContentEditableWarning
                className="editable-text"
                onBlur={(e) =>
                  onUpdatePlan({
                    ...plan,
                    metadata: { ...plan.metadata, academicYear: e.currentTarget.innerText },
                  })
                }
              >
                {plan.metadata.academicYear || '2026/2027'}
              </span>
            </div>
          </div>
        </div>

        {/* School Title */}
        <div className="doc-title">
          INSAN CENDEKIA MADANI HIGH SCHOOL PROGRAM LESSON PLANNING
        </div>

        {/* Metadata Table */}
        <table className="doc-table">
          <tbody>
            <tr>
              <td className="doc-field-label">Subject</td>
              <td>: {plan.metadata.subject}</td>
            </tr>
            <tr>
              <td className="doc-field-label">Teacher’s Name</td>
              <td>: {plan.metadata.teacherName}</td>
            </tr>
            <tr>
              <td className="doc-field-label">Grade / Semester</td>
              <td>: {plan.metadata.gradeSemester}</td>
            </tr>
            <tr>
              <td className="doc-field-label">Topic of Discussion</td>
              <td>: {plan.metadata.topicOfDiscussion}</td>
            </tr>
            <tr>
              <td className="doc-field-label">Period / Week</td>
              <td>: {plan.metadata.periodWeek}</td>
            </tr>
            <tr>
              <td className="doc-field-label">Chapter / Sub-Chapter</td>
              <td>: {plan.metadata.chapterSubChapter}</td>
            </tr>
          </tbody>
        </table>

        {/* Learning Outcomes & Objectives Table */}
        <table className="doc-table">
          <thead>
            <tr>
              <th className="doc-header-cell" style={{ textAlign: 'left' }}>
                Learning Outcomes (Capaian Pembelajaran / CP)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="editable-text"
                  onBlur={(e) =>
                    onUpdatePlan({ ...plan, learningOutcomesCP: e.currentTarget.innerText })
                  }
                >
                  {plan.learningOutcomesCP}
                </div>
              </td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th className="doc-header-cell" style={{ textAlign: 'left' }}>
                Learning Objectives (Tujuan Pembelajaran/ TP) – Anderson Kratwohl Taxonomy
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="editable-text"
                  style={{ whiteSpace: 'pre-line' }}
                  onBlur={(e) =>
                    onUpdatePlan({ ...plan, learningObjectivesTP: e.currentTarget.innerText })
                  }
                >
                  {plan.learningObjectivesTP}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 3 Weekly Sessions */}
        {plan.sessions.map((session, sIdx) => (
          <div key={`session-view-${sIdx}`} style={{ marginBottom: '1.75rem' }}>
            <table className="doc-table">
              {/* Session Banner */}
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    className="doc-header-cell"
                    style={{ textAlign: 'left', fontSize: '0.95rem' }}
                  >
                    Session {session.sessionNumber}: {session.durationText} :{' '}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="editable-text"
                      onBlur={(e) =>
                        updateSession(sIdx, { sessionTitle: e.currentTarget.innerText })
                      }
                    >
                      {session.sessionTitle}
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* Micro LO Header & Content */}
                <tr>
                  <td colSpan={2} className="doc-header-cell" style={{ fontWeight: 700 }}>
                    Learning Objectives (Indicator) / Micro TP
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ width: '100%' }}>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="editable-text"
                      style={{ whiteSpace: 'pre-line' }}
                      onBlur={(e) =>
                        updateSession(sIdx, {
                          microLearningObjectives: e.currentTarget.innerText,
                        })
                      }
                    >
                      {session.microLearningObjectives}
                    </div>
                  </td>
                </tr>

                {/* ICM Indicators */}
                <tr>
                  <td colSpan={2} className="doc-header-cell" style={{ fontWeight: 700 }}>
                    Insan Cendekia Madani Indicators:
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label className="check-item">
                        <input
                          type="checkbox"
                          checked={session.icmIndicators.faithful}
                          onChange={() => updateIcmIndicator(sIdx, 'faithful')}
                        />
                        <span>Faithful</span>
                      </label>
                      <label className="check-item">
                        <input
                          type="checkbox"
                          checked={session.icmIndicators.adabAkhlaq}
                          onChange={() => updateIcmIndicator(sIdx, 'adabAkhlaq')}
                        />
                        <span>Adab Aqhlaq</span>
                      </label>
                      <label className="check-item">
                        <input
                          type="checkbox"
                          checked={session.icmIndicators.independence}
                          onChange={() => updateIcmIndicator(sIdx, 'independence')}
                        />
                        <span>Independence</span>
                      </label>
                      <label className="check-item">
                        <input
                          type="checkbox"
                          checked={session.icmIndicators.intelligence}
                          onChange={() => updateIcmIndicator(sIdx, 'intelligence')}
                        />
                        <span>Intelligence</span>
                      </label>
                      <label className="check-item">
                        <input
                          type="checkbox"
                          checked={session.icmIndicators.leadership}
                          onChange={() => updateIcmIndicator(sIdx, 'leadership')}
                        />
                        <span>Leadership</span>
                      </label>
                    </div>
                    <div style={{ fontSize: '0.82rem' }}>
                      <strong>Explanation: </strong>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        className="editable-text"
                        onBlur={(e) =>
                          updateSession(sIdx, {
                            icmIndicators: {
                              ...session.icmIndicators,
                              explanation: e.currentTarget.innerText,
                            },
                          })
                        }
                      >
                        {session.icmIndicators.explanation}
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Teaching Sequence & Differentiation Header */}
                <tr>
                  <td className="doc-header-cell" style={{ width: '50%', fontWeight: 700 }}>
                    Sequence of Teaching (checklist)
                  </td>
                  <td className="doc-header-cell" style={{ width: '50%', fontWeight: 700 }}>
                    Differentiation (checklist)
                  </td>
                </tr>

                {/* Teaching Sequence & Differentiation Content */}
                <tr>
                  <td>
                    <div>
                      <label className="check-item" style={{ display: 'flex' }}>
                        <input
                          type="checkbox"
                          checked={session.sequenceOfTeaching.exposure}
                          onChange={() => updateTeachingSequence(sIdx, 'exposure')}
                        />
                        <span>Exposure</span>
                      </label>
                      <label className="check-item" style={{ display: 'flex' }}>
                        <input
                          type="checkbox"
                          checked={session.sequenceOfTeaching.miniLesson}
                          onChange={() => updateTeachingSequence(sIdx, 'miniLesson')}
                        />
                        <span>Mini lesson (guided practice)</span>
                      </label>
                      <label className="check-item" style={{ display: 'flex' }}>
                        <input
                          type="checkbox"
                          checked={session.sequenceOfTeaching.groupPractice}
                          onChange={() => updateTeachingSequence(sIdx, 'groupPractice')}
                        />
                        <span>Group practice/Collaborative Workshop</span>
                      </label>
                      <label className="check-item" style={{ display: 'flex' }}>
                        <input
                          type="checkbox"
                          checked={session.sequenceOfTeaching.independentPractice}
                          onChange={() => updateTeachingSequence(sIdx, 'independentPractice')}
                        />
                        <span>Independent practice</span>
                      </label>
                      <label className="check-item" style={{ display: 'flex' }}>
                        <input
                          type="checkbox"
                          checked={session.sequenceOfTeaching.assessment}
                          onChange={() => updateTeachingSequence(sIdx, 'assessment')}
                        />
                        <span>Formative / Summative assessment</span>
                      </label>
                      {session.sequenceOfTeaching.details && (
                        <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', fontStyle: 'italic' }}>
                          Flow: {session.sequenceOfTeaching.details}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <label className="check-item" style={{ display: 'flex' }}>
                        <input
                          type="checkbox"
                          checked={session.differentiation.content}
                          onChange={() => updateDifferentiation(sIdx, 'content')}
                        />
                        <span>Content</span>
                      </label>
                      <label className="check-item" style={{ display: 'flex' }}>
                        <input
                          type="checkbox"
                          checked={session.differentiation.process}
                          onChange={() => updateDifferentiation(sIdx, 'process')}
                        />
                        <span>Process</span>
                      </label>
                      <label className="check-item" style={{ display: 'flex' }}>
                        <input
                          type="checkbox"
                          checked={session.differentiation.product}
                          onChange={() => updateDifferentiation(sIdx, 'product')}
                        />
                        <span>Product</span>
                      </label>
                      <label className="check-item" style={{ display: 'flex' }}>
                        <input
                          type="checkbox"
                          checked={session.differentiation.readinessInterestProfile}
                          onChange={() => updateDifferentiation(sIdx, 'readinessInterestProfile')}
                        />
                        <span>Readiness / Interest / Learning profile</span>
                      </label>
                      <div style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          className="editable-text"
                          onBlur={(e) =>
                            updateSession(sIdx, {
                              differentiation: {
                                ...session.differentiation,
                                explanation: e.currentTarget.innerText,
                              },
                            })
                          }
                        >
                          {session.differentiation.explanation || 'N/A for this session'}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Vocabulary & Essential Question Headers */}
                <tr>
                  <td className="doc-header-cell" style={{ width: '50%', fontWeight: 700 }}>
                    Vocabulary, Terminology and Phrases:
                  </td>
                  <td className="doc-header-cell" style={{ width: '50%', fontWeight: 700 }}>
                    Essential Question:
                  </td>
                </tr>

                {/* Vocabulary & Essential Question Content */}
                <tr>
                  <td style={{ width: '50%' }}>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="editable-text"
                      onBlur={(e) =>
                        updateSession(sIdx, { vocabulary: e.currentTarget.innerText })
                      }
                    >
                      {session.vocabulary}
                    </div>
                  </td>
                  <td style={{ width: '50%' }}>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="editable-text"
                      onBlur={(e) =>
                        updateSession(sIdx, { essentialQuestion: e.currentTarget.innerText })
                      }
                    >
                      {session.essentialQuestion}
                    </div>
                  </td>
                </tr>

                {/* Context & Trigger Question Header */}
                <tr>
                  <td colSpan={2} className="doc-header-cell" style={{ fontWeight: 700 }}>
                    Context & Trigger Question:
                  </td>
                </tr>

                {/* Context & Trigger Question Content */}
                <tr>
                  <td colSpan={2}>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="editable-text"
                      onBlur={(e) =>
                        updateSession(sIdx, {
                          contextTriggerQuestion: e.currentTarget.innerText,
                        })
                      }
                    >
                      {session.contextTriggerQuestion}
                    </div>
                  </td>
                </tr>

                {/* Plan Banner */}
                <tr>
                  <td colSpan={2} className="doc-header-cell" style={{ fontWeight: 700 }}>
                    Plan
                  </td>
                </tr>

                {/* Activities Table Container */}
                <tr>
                  <td colSpan={2} style={{ padding: 0 }}>
                    <table className="activities-table">
                      <thead>
                        <tr>
                          <th style={{ width: '18%' }}>
                            Planned Timings
                          </th>
                          <th style={{ width: '62%' }}>
                            Planning Activity
                          </th>
                          <th style={{ width: '20%' }}>
                            Resources/ Materials
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Beginning */}
                        <tr>
                          <td style={{ width: '18%', textAlign: 'center' }}>
                            <strong>Beginning ({session.planActivities.beginning.timingMinutes}')</strong>
                          </td>
                          <td style={{ width: '62%' }}>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="editable-text"
                              onBlur={(e) => {
                                const acts = { ...session.planActivities };
                                acts.beginning.description = e.currentTarget.innerText;
                                updateSession(sIdx, { planActivities: acts });
                              }}
                            >
                              {session.planActivities.beginning.description}
                            </div>
                          </td>
                          <td style={{ width: '20%' }}>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="editable-text"
                              onBlur={(e) => {
                                const acts = { ...session.planActivities };
                                acts.beginning.resources = e.currentTarget.innerText;
                                updateSession(sIdx, { planActivities: acts });
                              }}
                            >
                              {session.planActivities.beginning.resources}
                            </div>
                          </td>
                        </tr>

                        {/* Middle */}
                        <tr>
                          <td style={{ width: '18%', textAlign: 'center' }}>
                            <strong>Middle ({session.planActivities.middle.timingMinutes}')</strong>
                          </td>
                          <td style={{ width: '62%' }}>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="editable-text"
                              onBlur={(e) => {
                                const acts = { ...session.planActivities };
                                acts.middle.description = e.currentTarget.innerText;
                                updateSession(sIdx, { planActivities: acts });
                              }}
                            >
                              {session.planActivities.middle.description}
                            </div>
                          </td>
                          <td style={{ width: '20%' }}>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="editable-text"
                              onBlur={(e) => {
                                const acts = { ...session.planActivities };
                                acts.middle.resources = e.currentTarget.innerText;
                                updateSession(sIdx, { planActivities: acts });
                              }}
                            >
                              {session.planActivities.middle.resources}
                            </div>
                          </td>
                        </tr>

                        {/* End */}
                        <tr>
                          <td style={{ width: '18%', textAlign: 'center' }}>
                            <strong>End ({session.planActivities.end.timingMinutes}')</strong>
                          </td>
                          <td style={{ width: '62%' }}>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="editable-text"
                              onBlur={(e) => {
                                const acts = { ...session.planActivities };
                                acts.end.description = e.currentTarget.innerText;
                                updateSession(sIdx, { planActivities: acts });
                              }}
                            >
                              {session.planActivities.end.description}
                            </div>
                          </td>
                          <td style={{ width: '20%' }}>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="editable-text"
                              onBlur={(e) => {
                                const acts = { ...session.planActivities };
                                acts.end.resources = e.currentTarget.innerText;
                                updateSession(sIdx, { planActivities: acts });
                              }}
                            >
                              {session.planActivities.end.resources}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* Reflection and Evaluation Banner */}
                <tr>
                  <td colSpan={2} className="doc-header-cell" style={{ fontWeight: 700 }}>
                    Reflection and Evaluation
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div style={{ marginBottom: '0.65rem' }}>
                      <div className="doc-sub-label">Reflection and Evaluation:</div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="editable-text"
                        onBlur={(e) =>
                          updateSession(sIdx, {
                            reflectionEvaluation: e.currentTarget.innerText,
                          })
                        }
                      >
                        {session.reflectionEvaluation}
                      </div>
                    </div>
                    <div style={{ marginBottom: session.plannedAssessment ? '0.65rem' : 0 }}>
                      <div className="doc-sub-label">Next Plan/Follow-up:</div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="editable-text"
                        onBlur={(e) =>
                          updateSession(sIdx, {
                            nextPlanFollowUp: e.currentTarget.innerText,
                          })
                        }
                      >
                        {session.nextPlanFollowUp}
                      </div>
                    </div>
                    {session.plannedAssessment && (
                      <div style={{ marginTop: '0.65rem' }}>
                        <div className="doc-sub-label">Planned Assessment:</div>
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          className="editable-text"
                          onBlur={(e) =>
                            updateSession(sIdx, {
                              plannedAssessment: e.currentTarget.innerText,
                            })
                          }
                        >
                          {session.plannedAssessment}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        {/* Administrative Approval Sign-off Footer */}
        <div className="doc-signature-section">
          <div className="doc-date-line">
            <span
              contentEditable
              suppressContentEditableWarning
              className="editable-text"
              onBlur={(e) =>
                onUpdatePlan({
                  ...plan,
                  metadata: { ...plan.metadata, locationDate: e.currentTarget.innerText.trim() },
                })
              }
            >
              {plan.metadata.locationDate || 'South Tangerang, September 30, 2026'}
            </span>
          </div>

          <div className="doc-signatures-grid">
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>
                Checked and Approved By:
              </div>
              <div className="doc-approvers-col">
                <div className="sig-block">
                  <div className="sig-role">High School Principal</div>
                  <div className="sig-name">
                    (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="editable-text"
                      onBlur={(e) =>
                        onUpdatePlan({
                          ...plan,
                          metadata: {
                            ...plan.metadata,
                            principalName: e.currentTarget.innerText.trim(),
                          },
                        })
                      }
                    >
                      {plan.metadata.principalName?.replace(/^\s*\(\s*|\s*\)\s*$/g, '') ||
                        'Chabib Mustofa S.Pd.I, M.Pd'}
                    </span>
                    )
                  </div>
                </div>
                <div className="sig-block">
                  <div className="sig-role">Curriculum Vice Principal</div>
                  <div className="sig-name">
                    (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="editable-text"
                      onBlur={(e) =>
                        onUpdatePlan({
                          ...plan,
                          metadata: {
                            ...plan.metadata,
                            curriculumVpName: e.currentTarget.innerText.trim(),
                          },
                        })
                      }
                    >
                      {plan.metadata.curriculumVpName?.replace(/^\s*\(\s*|\s*\)\s*$/g, '') ||
                        'Nur Intan Kumalasari M.Pd'}
                    </span>
                    )
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>
                Designed By:
              </div>
              <div className="sig-block">
                <div className="sig-role">Subject Teacher,</div>
                <div className="sig-name">
                  (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    className="editable-text"
                    onBlur={(e) =>
                      onUpdatePlan({
                        ...plan,
                        metadata: {
                          ...plan.metadata,
                          teacherName: e.currentTarget.innerText.trim(),
                        },
                      })
                    }
                  >
                    {plan.metadata.teacherName?.replace(/^\s*\(\s*|\s*\)\s*$/g, '') ||
                      'Salman Madani, S.Pd.'}
                  </span>
                  )
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
