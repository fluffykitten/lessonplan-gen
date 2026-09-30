import React, { useState } from 'react';
import {
  Sparkles,
  ListChecks,
  Settings2,
  ChevronDown,
  ChevronUp,
  Cpu,
  BookOpen,
  Wand2,
  Grid,
  Plus,
  Trash2,
  Check,
  MessageSquareText,
} from 'lucide-react';
import type { TeacherFormInput } from '../types/lessonPlan';
import { DEFAULT_GEMINI_MODELS } from '../data/models';

interface SidebarProps {
  input: TeacherFormInput;
  onChangeInput: (fields: Partial<TeacherFormInput>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generationStatus?: string;
  onOpenApiKeyModal: () => void;
  onOpenAktModal?: () => void;
  customModels: string[];
  onAddCustomModel: (modelId: string) => void;
  onRemoveCustomModel: (modelId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  input,
  onChangeInput,
  onGenerate,
  isGenerating,
  generationStatus,
  onOpenApiKeyModal,
  onOpenAktModal,
  customModels,
  onAddCustomModel,
  onRemoveCustomModel,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [newModelInput, setNewModelInput] = useState('');
  const [addedModelSuccess, setAddedModelSuccess] = useState<string | null>(null);

  const handleAddNewModel = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newModelInput.trim();
    if (!trimmed) return;
    onAddCustomModel(trimmed);
    setAddedModelSuccess(trimmed);
    setNewModelInput('');
    setIsAddingModel(false);
    setTimeout(() => setAddedModelSuccess(null), 3500);
  };

  const isCurrentModelCustom = customModels.includes(input.selectedModel);

  // Quick prefill helper for fast testing
  const handleApplyPresetExample = (type: 'chem10' | 'bio10' | 'chem11') => {
    if (type === 'chem10') {
      onChangeInput({
        mode: 'natural',
        gradePreset: 'grade10',
        subject: 'Chemistry',
        gradeSemester: 'Grade 10 / Semester 1',
        topicOfDiscussion: 'Ionic and Covalent Bonding',
        periodWeek: 'Week 4',
        chapterSubChapter: 'Chapter 3: Chemical Bonding',
        roughNotes:
          'Teach Grade 10 IGCSE Chemistry on Ionic and Covalent Bonding. 3 sessions (80m, 80m, 80m).\nSession 1 (80m): FC1 + CC2. Sodium + chlorine demo video, electron transfer between metals and non-metals to form stable octets, weave in Islamic reflection on Sunnatullah and atomic harmony (Ta’awun).\nSession 2 (80m): CC2 + PC3. Dot-and-cross diagrams on whiteboards in collaborative trios (H2, O2, H2O, CO2), differentiating with scaffolded model cutouts for students needing support.\nSession 3 (80m): CC4 + PC5. Hands-on laboratory testing electrical conductivity & melting points of ionic vs covalent compounds (salt vs wax/sugar) with evaluative exit ticket quiz.',
      });
    } else if (type === 'chem11') {
      onChangeInput({
        mode: 'natural',
        gradePreset: 'grade11',
        subject: 'Chemistry',
        gradeSemester: 'Grade 11 / Semester 1',
        topicOfDiscussion: 'Rates of Reaction & Collision Theory',
        periodWeek: 'Week 6',
        chapterSubChapter: 'Chapter 7: Chemical Kinetics',
        roughNotes:
          'Grade 11 IGCSE Chemistry: Factors affecting reaction rates and collision theory. 3 sessions (80m, 80m, 40m).\nSession 1 (80m): FC1 + CC2. Glowing glowsticks at different temperatures, collision theory criteria (activation energy, orientation), connect to human intentionality and deliberate action in Islam.\nSession 2 (80m): PC3 + CC4. Lab investigation on sodium thiosulfate and hydrochloric acid (disappearing cross experiment), collaborative graphing and rate calculations, differentiated with peer support pairs.\nSession 3 (40m): PC5 + MC6. Catalysts, Maxwell-Boltzmann curves, culminating evaluative problem on industrial synthesis conditions.',
      });
    } else if (type === 'bio10') {
      onChangeInput({
        mode: 'natural',
        gradePreset: 'grade10',
        subject: 'Biology',
        gradeSemester: 'Grade 10 / Semester 1',
        topicOfDiscussion: 'Enzyme Action and Denaturation',
        periodWeek: 'Week 5',
        chapterSubChapter: 'Chapter 5: Biological Molecules',
        roughNotes:
          'Grade 10 Biology: Enzymes as biological catalysts. 3 sessions (80m, 80m, 80m).\nSession 1 (80m): FC1 + CC2. Lock-and-key hypothesis, active sites, and substrate specificity, developing student inquiry and autonomy (Independence & Intelligence).\nSession 2 (80m): PC3 + CC4. Lab measuring catalase breakdown of hydrogen peroxide at varying temperatures, graphing Vmax and denaturation, differentiation by tiered data tables.\nSession 3 (80m): CC4 + PC5. Effect of pH on digestive enzymes, comparative evaluation of enzyme activity across organs, formative exit quiz.',
      });
    }
  };

  return (
    <aside className="sidebar-panel">
      {/* Input Mode Selector */}
      <div className="panel-card">
        <div className="panel-card-title">
          <Wand2 size={18} color="#105b8c" />
          <span>Generation Mode</span>
        </div>

        <div className="tabs-container">
          <button
            className={`tab-btn ${input.mode === 'natural' ? 'active' : ''}`}
            onClick={() => onChangeInput({ mode: 'natural' })}
          >
            <Sparkles size={14} />
            <span>Teacher Notes</span>
          </button>
          <button
            className={`tab-btn ${input.mode === 'structured' ? 'active' : ''}`}
            onClick={() => onChangeInput({ mode: 'structured' })}
          >
            <ListChecks size={14} />
            <span>Structured CP / TP</span>
          </button>
        </div>

        {/* Grade Presets */}
        <div className="form-group">
          <label className="form-label">
            <span>Weekly Session Structure</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--primary-500)', fontWeight: 600 }}>
              {input.gradePreset === 'grade10'
                ? 'G10: 80 - 80 - 80 min'
                : input.gradePreset === 'grade11'
                ? 'G11: 80 - 80 - 40 min'
                : 'Custom Durations'}
            </span>
          </label>
          <div className="presets-grid">
            <button
              type="button"
              className={`preset-chip ${input.gradePreset === 'grade10' ? 'active' : ''}`}
              onClick={() => onChangeInput({ gradePreset: 'grade10' })}
              title="Grade 10 Standard: Session 1 (80m), Session 2 (80m), Session 3 (80m)"
            >
              Grade 10 (80-80-80)
            </button>
            <button
              type="button"
              className={`preset-chip ${input.gradePreset === 'grade11' ? 'active' : ''}`}
              onClick={() => onChangeInput({ gradePreset: 'grade11' })}
              title="Grade 11 Standard: Session 1 (80m), Session 2 (80m), Session 3 (40m)"
            >
              Grade 11 (80-80-40)
            </button>
            <button
              type="button"
              className={`preset-chip ${input.gradePreset === 'custom' ? 'active' : ''}`}
              onClick={() => onChangeInput({ gradePreset: 'custom' })}
              title="Set custom minutes for each of the 3 sessions"
            >
              Custom
            </button>
          </div>

          {/* Custom Duration Inputs */}
          {input.gradePreset === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.4rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>S1 (min)</label>
                <input
                  type="number"
                  className="form-input"
                  value={input.customDurations?.[0] || 80}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 80;
                    onChangeInput({
                      customDurations: [val, input.customDurations[1], input.customDurations[2]],
                    });
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>S2 (min)</label>
                <input
                  type="number"
                  className="form-input"
                  value={input.customDurations?.[1] || 80}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 80;
                    onChangeInput({
                      customDurations: [input.customDurations[0], val, input.customDurations[2]],
                    });
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>S3 (min)</label>
                <input
                  type="number"
                  className="form-input"
                  value={input.customDurations?.[2] || 80}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 80;
                    onChangeInput({
                      customDurations: [input.customDurations[0], input.customDurations[1], val],
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Example Loaders */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '100%' }}>
            ⚡ Quick inspiration templates:
          </span>
          <button
            type="button"
            className="badge-tag"
            style={{ cursor: 'pointer' }}
            onClick={() => handleApplyPresetExample('chem10')}
          >
            Bonding (G10: 80-80-80)
          </button>
          <button
            type="button"
            className="badge-tag"
            style={{ cursor: 'pointer' }}
            onClick={() => handleApplyPresetExample('chem11')}
          >
            Kinetics (G11: 80-80-40)
          </button>
          <button
            type="button"
            className="badge-tag"
            style={{ cursor: 'pointer' }}
            onClick={() => handleApplyPresetExample('bio10')}
          >
            Enzymes (G10: 80-80-80)
          </button>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="panel-card">
        {input.mode === 'natural' ? (
          <div>
            <div className="panel-card-title">
              <Sparkles size={18} color="#cda34f" />
              <span>Describe Your Lesson Plan</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Describe casually how you want the week's lessons to unfold. The AI will weave it into <strong>AKT Matrix codes (F/C/P/M + C1-6)</strong>, ICM character values, differentiation, and strict timings.
            </p>
            <div className="form-group">
              <textarea
                className="form-textarea"
                rows={7}
                placeholder="e.g. Next week we are exploring ionic vs covalent bonding in Grade 10 (80-80-80 mins). Session 1: Sodium and chlorine demo, electron transfer... Session 2: Dot-and-cross diagrams... Session 3: Hands-on conductivity test... Connect to Islamic concept of divine balance..."
                value={input.roughNotes}
                onChange={(e) => onChangeInput({ roughNotes: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="panel-card-title" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} color="#105b8c" />
                <span>Syllabus Outcomes & Objectives</span>
              </div>
              {onOpenAktModal && (
                <button
                  type="button"
                  onClick={onOpenAktModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-500)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                  title="View full AKT F/C/P/M Matrix"
                >
                  <Grid size={13} /> AKT Guide
                </button>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Learning Outcomes (Capaian Pembelajaran / CP)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Paste the syllabus CP or overarching learning outcome..."
                value={input.learningOutcomesCP}
                onChange={(e) => onChangeInput({ learningOutcomesCP: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span>Learning Objectives (TP) – AKT (F/C/P/M + C1-6)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="1. FC1: Remember + Factual... 2. CC2: Understand + Conceptual... 3. PC3: Apply + Procedural..."
                value={input.learningObjectivesTP}
                onChange={(e) => onChangeInput({ learningObjectivesTP: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginTop: '0.85rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MessageSquareText size={14} color="#105b8c" />
                  <span>Teacher's Flow & Pedagogical Notes (Optional)</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Guides AI</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Instruct the AI on learning flow, specific experiments/activities, required lab materials, group discussions, summative/formative tasks, or Islamic values..."
                value={input.structuredNotes || ''}
                onChange={(e) => onChangeInput({ structuredNotes: e.target.value })}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                💡 Direct the AI on specific experiments, flow between sessions, materials to use, or summative items.
              </span>
            </div>
          </div>
        )}

        {/* Basic Course Metadata */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-input"
              value={input.subject}
              placeholder="e.g. Chemistry"
              onChange={(e) => onChangeInput({ subject: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Grade / Semester</label>
            <input
              type="text"
              className="form-input"
              value={input.gradeSemester}
              placeholder="e.g. Grade 10 / Semester 1"
              onChange={(e) => onChangeInput({ gradeSemester: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Topic of Discussion</label>
            <input
              type="text"
              className="form-input"
              value={input.topicOfDiscussion}
              placeholder="e.g. Chemical Bonding"
              onChange={(e) => onChangeInput({ topicOfDiscussion: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Period / Week</label>
            <input
              type="text"
              className="form-input"
              value={input.periodWeek}
              placeholder="e.g. Week 4"
              onChange={(e) => onChangeInput({ periodWeek: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Chapter / Sub-Chapter</label>
          <input
            type="text"
            className="form-input"
            value={input.chapterSubChapter}
            placeholder="e.g. Chapter 3: Chemical Bonding & Structure"
            onChange={(e) => onChangeInput({ chapterSubChapter: e.target.value })}
          />
        </div>
      </div>

      {/* Advanced / Administration Details Accordion */}
      <div className="panel-card">
        <button
          type="button"
          className="accordion-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Settings2 size={16} />
            <span>School Settings & Signatories</span>
          </span>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showAdvanced && (
          <div style={{ marginTop: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Teacher's Name</label>
              <input
                type="text"
                className="form-input"
                value={input.teacherName}
                placeholder="Salman Madani, S.Pd."
                onChange={(e) => onChangeInput({ teacherName: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input
                  type="text"
                  className="form-input"
                  value={input.academicYear}
                  placeholder="2026/2027"
                  onChange={(e) => onChangeInput({ academicYear: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date String</label>
                <input
                  type="text"
                  className="form-input"
                  value={input.locationDate}
                  placeholder="South Tangerang, September 30, 2026"
                  onChange={(e) => onChangeInput({ locationDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">High School Principal</label>
              <input
                type="text"
                className="form-input"
                value={input.principalName}
                placeholder="Chabib Mustofa S.Pd.I, M.Pd"
                onChange={(e) => onChangeInput({ principalName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Curriculum Vice Principal</label>
              <input
                type="text"
                className="form-input"
                value={input.curriculumVpName}
                placeholder="Nur Intan Kumalasari M.Pd"
                onChange={(e) => onChangeInput({ curriculumVpName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Cpu size={14} /> Gemini Model
                </span>
              </label>
              <select
                className="form-select"
                value={input.selectedModel}
                onChange={(e) => {
                  if (e.target.value === '__add_custom__') {
                    setIsAddingModel(true);
                  } else {
                    onChangeInput({ selectedModel: e.target.value });
                  }
                }}
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
            </div>
          </div>
        )}
      </div>

      {/* Dedicated AI Model Selection Card */}
      <div className="panel-card" style={{ marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <div className="panel-card-title" style={{ margin: 0, fontSize: '0.9rem' }}>
            <Cpu size={16} color="#105b8c" />
            <span>AI Model Selection</span>
          </div>
          {!isAddingModel && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '0.22rem 0.55rem', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => setIsAddingModel(true)}
              title="Write and add a custom Gemini model identifier"
            >
              <Plus size={13} /> Add Model
            </button>
          )}
        </div>

        {!isAddingModel ? (
          <div>
            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
              <select
                className="form-select"
                value={input.selectedModel}
                onChange={(e) => {
                  if (e.target.value === '__add_custom__') {
                    setIsAddingModel(true);
                  } else {
                    onChangeInput({ selectedModel: e.target.value });
                  }
                }}
                style={{ flex: 1, fontSize: '0.82rem' }}
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

              {isCurrentModelCustom && (
                <button
                  type="button"
                  className="btn-icon"
                  style={{ color: '#ef4444', padding: '0.45rem' }}
                  onClick={() => onRemoveCustomModel(input.selectedModel)}
                  title={`Remove custom model "${input.selectedModel}" from options`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div style={{ marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.73rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Active: <strong style={{ color: 'var(--primary-500)' }}>{input.selectedModel}</strong>
              </span>
              {addedModelSuccess && (
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Check size={12} /> Added & active!
                </span>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddNewModel} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-sub)' }}>
              Write Model Name / Identifier:
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem' }}
                placeholder="e.g. gemini-2.0-flash-exp, gemini-1.5-flash-8b"
                value={newModelInput}
                onChange={(e) => setNewModelInput(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                disabled={!newModelInput.trim()}
              >
                Add Option
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '0.45rem 0.55rem', fontSize: '0.78rem' }}
                onClick={() => {
                  setIsAddingModel(false);
                  setNewModelInput('');
                }}
              >
                Cancel
              </button>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
              Enter any Gemini model string. It will be added to your dropdown options and saved locally in your browser.
            </p>
          </form>
        )}
      </div>

      {/* Primary Generate Button */}
      <button
        type="button"
        className="btn btn-primary"
        style={{ padding: '0.85rem', fontSize: '0.95rem' }}
        onClick={() => {
          if (!input.apiKey || input.apiKey.trim() === '') {
            onOpenApiKeyModal();
            return;
          }
          onGenerate();
        }}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <div className="spinner" />
            <span>Generating Lesson Plan...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>Generate Lesson Plan with Gemini AI</span>
          </>
        )}
      </button>

      {/* Live Generation Progress & Retry Status */}
      {isGenerating && generationStatus && (
        <div
          style={{
            marginTop: '0.65rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 91, 140, 0.08)',
            border: '1px solid rgba(16, 91, 140, 0.25)',
            fontSize: '0.78rem',
            color: 'var(--text-sub)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            lineHeight: 1.35,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            className="spinner"
            style={{ width: '14px', height: '14px', borderWidth: '2px', flexShrink: 0 }}
          />
          <span>{generationStatus}</span>
        </div>
      )}

      {!input.apiKey && (
        <p
          style={{
            fontSize: '0.72rem',
            textAlign: 'center',
            color: 'var(--accent-gold)',
            cursor: 'pointer',
          }}
          onClick={onOpenApiKeyModal}
        >
          💡 Tip: Click here to enter your Gemini API Key first
        </p>
      )}
    </aside>
  );
};
