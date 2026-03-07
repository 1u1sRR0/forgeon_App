'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  levels: CourseLevel[];
}

interface CourseLevel {
  id: string;
  title: string;
  description: string;
  order: number;
  learningObjectives: string[];
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  content: any[];
  quiz?: Quiz;
}

interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  questions: any[];
}

interface CourseContextType {
  course: Course | null;
  loading: boolean;
  error: string | null;
  refreshCourse: () => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/projects/${projectId}/course`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }

      const data = await response.json();
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchCourse();
    }
  }, [projectId]);

  return (
    <CourseContext.Provider
      value={{
        course,
        loading,
        error,
        refreshCourse: fetchCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}
