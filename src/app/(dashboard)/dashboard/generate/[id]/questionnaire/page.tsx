'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sparkles, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { BusinessTypeSelector } from '@/components/generate/BusinessTypeSelector';
import { QuestionnaireNav } from '@/components/generate/QuestionnaireNav';
import { QuestionnaireSection } from '@/components/generate/QuestionnaireSection';
import { ProgressBar } from '@/components/generate/ProgressBar';
import {
  QUESTIONNAIRE_SCHEMA,
  type SectionKey,
} from '@/modules/multiAgent/questionnaire/questionnaireSchema';
import type { QuestionnaireAnswers } from '@/modules/multiAgent/types';

type SectionStatus = 'empty' | 'in-progress' | 'complete';

interface SessionData {
  id: string;
  businessType: string;
  state: string;
}

interface ProgressData {
  sections: Record<string, SectionStatus>;
  completionPercentage: number;
  canGenerate: boolean;
}

const SECTION_ORDER: SectionKey[] = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuestionnairePage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [progress, setProgress] = useState<ProgressData>({
    sections: {},
    completionPercentage: 0,
    canGenerate: false,
  });
  const [activeSection, setActiveSection] = useState<SectionKey>('A');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showBusinessType, setShowBusinessType] = useState(false);

  // Debounce timer ref
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Track pending saves to avoid race conditions
  const pendingSaveRef = useRef<{ section: string; answers: Record<string, unknown> } | null>(null);

  // Load session and questionnaire data
  useEffect(() => {
    const load = async () => {
      try {
        const [sessionRes, questionnaireRes] = await Promise.all([
          fetch(`/api/generate/sessions/${sessionId}`),
          fetch(`/api/generate/sessions/${sessionId}/questionnaire`),
        ]);

        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setSession(sessionData);
          if (sessionData.businessType === 'GUIDED') {
            setShowBusinessType(true);
          }
        }

        if (questionnaireRes.ok) {
          const qData = await questionnaireRes.json();
          setAnswers(qData.answers ?? {});
          setProgress(qData.progress ?? { sections: {}, completionPercentage: 0, canGenerate: false });
        }
      } catch (error) {
        console.error('Error loading questionnaire:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  // Debounced autosave
  const saveSection = useCallback(
    async (section: string, sectionAnswers: Record<string, unknown>) => {
      try {
        const res = await fetch(`/api/generate/sessions/${sessionId}/questionnaire`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section, answers: sectionAnswers }),
        });
        if (res.ok) {
          // Refresh progress
          const progressRes = await fetch(`/api/generate/sessions/${sessionId}/questionnaire`);
          if (progressRes.ok) {
            const qData = await progressRes.json();
            setProgress(qData.progress ?? { sections: {}, completionPercentage: 0, canGenerate: false });
          }
        }
      } catch (error) {
        console.error('Error saving section:', error);
      }
    },
    [sessionId],
  );

  const handleFieldChange = useCallback(
    (field: string, value: unknown) => {
      const sectionKey = `section${activeSection}` as keyof QuestionnaireAnswers;
      setAnswers((prev) => {
        const currentSection = (prev[sectionKey] as unknown as Record<string, unknown>) ?? {};
        const updated = { ...currentSection, [field]: value };
        const newAnswers = { ...prev, [sectionKey]: updated };

        // Debounced save
        pendingSaveRef.current = { section: activeSection, answers: updated };
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          if (pendingSaveRef.current) {
            saveSection(pendingSaveRef.current.section, pendingSaveRef.current.answers);
            pendingSaveRef.current = null;
          }
        }, 1000);

        return newAnswers;
      });
    },
    [activeSection, saveSection],
  );

  const handleBusinessTypeSelect = async (type: string) => {
    try {
      const res = await fetch(`/api/generate/sessions/${sessionId}/business-type`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType: type }),
      });
      if (res.ok) {
        setSession((prev) => (prev ? { ...prev, businessType: type } : prev));
        setShowBusinessType(false);
      }
    } catch (error) {
      console.error('Error updating business type:', error);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      router.push(`/dashboard/generate/${sessionId}/prompt`);
    } catch (error) {
      console.error('Error navigating to prompt:', error);
      setGenerating(false);
    }
  };

  const currentSectionIdx = SECTION_ORDER.indexOf(activeSection);
  const canGoNext = currentSectionIdx < SECTION_ORDER.length - 1;
  const canGoPrev = currentSectionIdx > 0;

  const goNext = () => {
    if (canGoNext) setActiveSection(SECTION_ORDER[currentSectionIdx + 1]);
  };
  const goPrev = () => {
    if (canGoPrev) setActiveSection(SECTION_ORDER[currentSectionIdx - 1]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-gray-400">Session not found.</p>
      </div>
    );
  }

  // Show business type selector if GUIDED
  if (showBusinessType) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">What are you building?</h1>
          <p className="text-gray-400">Select the type of digital business you want to create.</p>
        </div>
        <BusinessTypeSelector
          selected={session.businessType !== 'GUIDED' ? session.businessType : null}
          onSelect={handleBusinessTypeSelect}
        />
      </div>
    );
  }

  const sectionDef = QUESTIONNAIRE_SCHEMA[activeSection];
  const sectionKey = `section${activeSection}` as keyof QuestionnaireAnswers;
  const sectionAnswers = (answers[sectionKey] as unknown as Record<string, unknown>) ?? {};

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <ProgressBar percentage={progress.completionPercentage} />
      </div>

      <div className="flex gap-6">
        {/* Left nav */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <QuestionnaireNav
            sections={progress.sections}
            activeSection={activeSection}
            onSectionChange={(s) => setActiveSection(s as SectionKey)}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-900/80 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">{sectionDef.title}</h2>
              <p className="text-sm text-gray-400">{sectionDef.description}</p>
            </div>

            <QuestionnaireSection
              sectionId={activeSection}
              fields={sectionDef.fields}
              answers={sectionAnswers}
              businessType={session.businessType}
              onFieldChange={handleFieldChange}
            />

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={goPrev}
                disabled={!canGoPrev}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed
                  transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-3">
                {/* Mobile section indicator */}
                <span className="text-xs text-gray-500 md:hidden">
                  Section {activeSection} of F
                </span>

                {canGoNext ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!progress.canGenerate || generating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                      bg-gradient-to-r from-purple-600 to-purple-500 text-white
                      hover:from-purple-500 hover:to-purple-400
                      disabled:opacity-40 disabled:cursor-not-allowed
                      shadow-[0_0_15px_rgba(168,85,247,0.25)]
                      transition-all duration-200"
                  >
                    {generating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Generate Master Prompt
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}