import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LessonPlanPreview } from './components/LessonPlanPreview';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LogoCustomizerModal } from './components/LogoCustomizerModal';
import { AktMatrixModal } from './components/AktMatrixModal';
import { sampleLessonPlan } from './data/sampleLessonPlan';
import type { LessonPlanData, TeacherFormInput } from './types/lessonPlan';
import { generateLessonPlanWithGemini } from './services/geminiService';
import { exportLessonPlanToDocx, generateDocxFilename } from './services/docxGenerator';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export function App() {
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      localStorage.getItem('gemini_api_key') ||
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      ''
    );
  });
  const [customLeftLogo, setCustomLeftLogo] = useState<string>(() => {
    return localStorage.getItem('custom_left_logo') || '';
  });
  const [customRightLogo, setCustomRightLogo] = useState<string>(() => {
    return localStorage.getItem('custom_right_logo') || '';
  });

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isAktModalOpen, setIsAktModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Typography font & spacing customization
  const [fontFamily, setFontFamily] = useState<string>(() => {
    return localStorage.getItem('gemini_custom_font_family') || 'Arial';
  });
  const [fontSizePt, setFontSizePt] = useState<number>(() => {
    const saved = localStorage.getItem('gemini_custom_font_size');
    return saved ? parseInt(saved) || 11 : 11;
  });
  const [lineSpacing, setLineSpacing] = useState<number>(() => {
    const saved = localStorage.getItem('gemini_custom_line_spacing');
    return saved ? parseFloat(saved) || 1.5 : 1.5;
  });
  const [paragraphSpacing, setParagraphSpacing] = useState<number>(() => {
    const saved = localStorage.getItem('gemini_custom_para_spacing');
    return saved ? parseFloat(saved) || 1.5 : 1.5;
  });

  // LocalDraft: Lesson Plan document data (restored on refresh)
  const [plan, setPlan] = useState<LessonPlanData>(() => {
    try {
      const saved = localStorage.getItem('gemini_lesson_plan_draft');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not restore draft plan', e);
    }
    return sampleLessonPlan;
  });

  // Notification Toast
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Custom Gemini models added by user
  const [customModels, setCustomModels] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gemini_custom_models');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalDraft: Teacher input form state (restored on refresh)
  const [formInput, setFormInput] = useState<TeacherFormInput>(() => {
    let savedInput: any = null;
    try {
      const raw = localStorage.getItem('gemini_teacher_form_draft');
      if (raw) savedInput = JSON.parse(raw);
    } catch {}

    let savedModel =
      savedInput?.selectedModel ||
      localStorage.getItem('gemini_selected_model') ||
      'gemini-3.5-flash-lite';

    // Discard old unavailable models
    if (
      savedModel === 'gemini-2.5-flash' ||
      savedModel === 'gemini-1.5-flash' ||
      savedModel === 'gemini-2.0-flash' ||
      savedModel === 'gemini-1.5-pro'
    ) {
      savedModel = 'gemini-3.5-flash-lite';
      localStorage.setItem('gemini_selected_model', 'gemini-3.5-flash-lite');
    }

    return {
      mode: savedInput?.mode || 'natural',
      apiKey: apiKey,
      selectedModel: savedModel,
      gradePreset: savedInput?.gradePreset || 'grade10',
      academicYear: savedInput?.academicYear || '2026/2027',
      subject: savedInput?.subject || 'Chemistry',
      teacherName: savedInput?.teacherName || 'Salman Madani, S.Pd.',
      gradeSemester: savedInput?.gradeSemester || 'Grade 10 / Semester 1',
      topicOfDiscussion: savedInput?.topicOfDiscussion || 'Ionic and Covalent Bonding',
      periodWeek: savedInput?.periodWeek || 'Week 4',
      chapterSubChapter: savedInput?.chapterSubChapter || 'Chapter 3: Chemical Bonding & Structure',
      learningOutcomesCP: savedInput?.learningOutcomesCP || sampleLessonPlan.learningOutcomesCP,
      learningObjectivesTP: savedInput?.learningObjectivesTP || sampleLessonPlan.learningObjectivesTP,
      structuredNotes: savedInput?.structuredNotes || '',
      roughNotes:
        savedInput?.roughNotes ||
        'Teach Grade 10 IGCSE Chemistry on Ionic and Covalent Bonding. 3 sessions (80m, 80m, 80m).\nSession 1 (80m): FC1 + CC2. Sodium + chlorine demo video, electron transfer between metals and non-metals to form stable octets, weave in Islamic reflection on Sunnatullah and atomic harmony (Ta’awun).\nSession 2 (80m): CC2 + PC3. Dot-and-cross diagrams on whiteboards in collaborative trios (H2, O2, H2O, CO2), differentiating with scaffolded model cutouts for students needing support.\nSession 3 (80m): CC4 + PC5. Hands-on laboratory testing electrical conductivity & melting points of ionic vs covalent compounds (salt vs wax/sugar) with evaluative exit ticket quiz.',
      customDurations: savedInput?.customDurations || [80, 80, 80],
      principalName: savedInput?.principalName || 'Chabib Mustofa S.Pd.I, M.Pd',
      curriculumVpName: savedInput?.curriculumVpName || 'Nur Intan Kumalasari M.Pd',
      locationDate: savedInput?.locationDate || 'South Tangerang, September 30, 2026',
    };
  });
  const [generationStatus, setGenerationStatus] = useState<string>('');

  // Persist LocalDraft of plan to localStorage
  useEffect(() => {
    if (plan) {
      try {
        localStorage.setItem('gemini_lesson_plan_draft', JSON.stringify(plan));
      } catch (e) {
        console.warn('Draft save error:', e);
      }
    }
  }, [plan]);

  // Persist LocalDraft of formInput to localStorage
  useEffect(() => {
    if (formInput) {
      try {
        localStorage.setItem('gemini_teacher_form_draft', JSON.stringify(formInput));
      } catch (e) {
        console.warn('Form draft save error:', e);
      }
    }
  }, [formInput]);

  // Persist font & spacing settings
  useEffect(() => {
    localStorage.setItem('gemini_custom_font_family', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('gemini_custom_font_size', fontSizePt.toString());
  }, [fontSizePt]);

  useEffect(() => {
    localStorage.setItem('gemini_custom_line_spacing', lineSpacing.toString());
  }, [lineSpacing]);

  useEffect(() => {
    localStorage.setItem('gemini_custom_para_spacing', paragraphSpacing.toString());
  }, [paragraphSpacing]);

  // Persist selectedModel to localStorage
  useEffect(() => {
    if (formInput.selectedModel) {
      localStorage.setItem('gemini_selected_model', formInput.selectedModel);
    }
  }, [formInput.selectedModel]);

  // Sync apiKey to formInput
  useEffect(() => {
    setFormInput((prev) => ({ ...prev, apiKey }));
  }, [apiKey]);

  // Handle theme toggle
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
    }
  }, [isDarkMode]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('gemini_api_key', newKey);
    showToast('success', 'Gemini API Key successfully saved in your browser.');
  };

  const handleSaveLogos = (left: string, right: string) => {
    setCustomLeftLogo(left);
    setCustomRightLogo(right);
    localStorage.setItem('custom_left_logo', left);
    localStorage.setItem('custom_right_logo', right);
    showToast('success', 'Header logos updated! They will be used in previews and DOCX exports.');
  };

  const handleAddCustomModel = (modelId: string) => {
    const trimmed = modelId.trim();
    if (!trimmed) return;
    if (!customModels.includes(trimmed)) {
      const updated = [...customModels, trimmed];
      setCustomModels(updated);
      localStorage.setItem('gemini_custom_models', JSON.stringify(updated));
    }
    setFormInput((prev) => ({ ...prev, selectedModel: trimmed }));
    showToast('success', `Model "${trimmed}" added as option and selected!`);
  };

  const handleRemoveCustomModel = (modelId: string) => {
    const updated = customModels.filter((m) => m !== modelId);
    setCustomModels(updated);
    localStorage.setItem('gemini_custom_models', JSON.stringify(updated));
    if (formInput.selectedModel === modelId) {
      const fallback = 'gemini-3.5-flash-lite';
      setFormInput((prev) => ({ ...prev, selectedModel: fallback }));
    }
    showToast('info', `Removed custom model "${modelId}".`);
  };

  const handleUpdateForm = (fields: Partial<TeacherFormInput>) => {
    setFormInput((prev) => ({ ...prev, ...fields }));

    // Keep active plan metadata synchronized in real-time with form inputs
    setPlan((prevPlan) => {
      if (!prevPlan) return prevPlan;
      const metaPatch: Partial<LessonPlanData['metadata']> = {};
      if (fields.principalName !== undefined) metaPatch.principalName = fields.principalName;
      if (fields.curriculumVpName !== undefined) metaPatch.curriculumVpName = fields.curriculumVpName;
      if (fields.locationDate !== undefined) metaPatch.locationDate = fields.locationDate;
      if (fields.teacherName !== undefined) metaPatch.teacherName = fields.teacherName;
      if (fields.academicYear !== undefined) metaPatch.academicYear = fields.academicYear;
      if (fields.subject !== undefined) metaPatch.subject = fields.subject;
      if (fields.gradeSemester !== undefined) metaPatch.gradeSemester = fields.gradeSemester;
      if (fields.periodWeek !== undefined) metaPatch.periodWeek = fields.periodWeek;
      if (fields.chapterSubChapter !== undefined) metaPatch.chapterSubChapter = fields.chapterSubChapter;
      if (fields.topicOfDiscussion !== undefined) metaPatch.topicOfDiscussion = fields.topicOfDiscussion;

      if (Object.keys(metaPatch).length > 0) {
        return {
          ...prevPlan,
          metadata: {
            ...prevPlan.metadata,
            ...metaPatch,
          },
        };
      }
      return prevPlan;
    });
  };

  const handleUpdatePlan = (updatedPlan: LessonPlanData) => {
    setPlan(updatedPlan);
    if (updatedPlan.metadata) {
      setFormInput((prev) => ({
        ...prev,
        principalName: updatedPlan.metadata.principalName ?? prev.principalName,
        curriculumVpName: updatedPlan.metadata.curriculumVpName ?? prev.curriculumVpName,
        locationDate: updatedPlan.metadata.locationDate ?? prev.locationDate,
        teacherName: updatedPlan.metadata.teacherName ?? prev.teacherName,
        academicYear: updatedPlan.metadata.academicYear ?? prev.academicYear,
        subject: updatedPlan.metadata.subject ?? prev.subject,
        gradeSemester: updatedPlan.metadata.gradeSemester ?? prev.gradeSemester,
        periodWeek: updatedPlan.metadata.periodWeek ?? prev.periodWeek,
        chapterSubChapter: updatedPlan.metadata.chapterSubChapter ?? prev.chapterSubChapter,
        topicOfDiscussion: updatedPlan.metadata.topicOfDiscussion ?? prev.topicOfDiscussion,
      }));
    }
  };

  const handleResetSample = () => {
    try {
      localStorage.removeItem('gemini_lesson_plan_draft');
      localStorage.removeItem('gemini_teacher_form_draft');
    } catch {}
    setPlan(sampleLessonPlan);
    showToast('info', 'Loaded clean Grade 10 Chemistry sample template and reset local drafts.');
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }

    if (formInput.mode === 'natural' && (!formInput.roughNotes || formInput.roughNotes.trim().length < 10)) {
      showToast('error', 'Please provide a brief description of how you want the lesson to happen.');
      return;
    }

    if (formInput.mode === 'structured' && (!formInput.learningOutcomesCP || !formInput.topicOfDiscussion)) {
      showToast('error', 'Please fill in Topic of Discussion and Learning Outcomes (CP).');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('Preparing prompt and curriculum standards...');
    try {
      const generatedPlan = await generateLessonPlanWithGemini(
        {
          ...formInput,
          apiKey,
        },
        (status) => {
          setGenerationStatus(status);
        }
      );
      setPlan(generatedPlan);
      showToast('success', 'Lesson plan successfully generated with Gemini AI using AKT Matrix!');
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || 'Failed to generate lesson plan. Check your API key and try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStatus('');
    }
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      await exportLessonPlanToDocx(
        plan,
        customLeftLogo,
        customRightLogo,
        fontFamily,
        fontSizePt,
        lineSpacing,
        paragraphSpacing
      );
      const filename = generateDocxFilename(plan);
      showToast('success', `Downloaded Word document: ${filename}`);
    } catch (err: any) {
      console.error('Export error:', err);
      showToast('error', 'Failed to generate Word document. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? '#10b981' : '#105b8c',
            color: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            maxWidth: '420px',
          }}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle size={18} />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        apiKey={apiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        onOpenAktModal={() => setIsAktModalOpen(true)}
        onExportDocx={handleExportDocx}
        onResetSample={handleResetSample}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        isExporting={isExporting}
        selectedModel={formInput.selectedModel}
      />

      {/* App Workspace */}
      <div className="app-container">
        {/* Left Control Sidebar */}
        <Sidebar
          input={formInput}
          onChangeInput={handleUpdateForm}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          generationStatus={generationStatus}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          onOpenAktModal={() => setIsAktModalOpen(true)}
          customModels={customModels}
          onAddCustomModel={handleAddCustomModel}
          onRemoveCustomModel={handleRemoveCustomModel}
        />

        {/* Right Preview Panel */}
        <LessonPlanPreview
          plan={plan}
          onUpdatePlan={handleUpdatePlan}
          onExportDocx={handleExportDocx}
          isExporting={isExporting}
          customLeftLogo={customLeftLogo}
          customRightLogo={customRightLogo}
          onOpenLogoModal={() => setIsLogoModalOpen(true)}
          fontFamily={fontFamily}
          onChangeFontFamily={setFontFamily}
          fontSizePt={fontSizePt}
          onChangeFontSizePt={setFontSizePt}
          lineSpacing={lineSpacing}
          onChangeLineSpacing={setLineSpacing}
          paragraphSpacing={paragraphSpacing}
          onChangeParagraphSpacing={setParagraphSpacing}
          isDraftSaved={true}
        />
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
        selectedModel={formInput.selectedModel}
        onSelectModel={(model) => setFormInput((prev) => ({ ...prev, selectedModel: model }))}
        customModels={customModels}
        onAddCustomModel={handleAddCustomModel}
      />

      {/* Logo Customizer Modal */}
      <LogoCustomizerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        leftLogo={customLeftLogo}
        rightLogo={customRightLogo}
        onSaveLogos={handleSaveLogos}
      />

      {/* AKT 2D Matrix Modal */}
      <AktMatrixModal
        isOpen={isAktModalOpen}
        onClose={() => setIsAktModalOpen(false)}
      />
    </div>
  );
}

export default App;
