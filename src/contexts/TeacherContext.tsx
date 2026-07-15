import React, { createContext, useContext, type ReactNode } from "react";
import { useTeacher, type Teacher } from "@/hooks/useTeacher";
import type { User } from "@supabase/supabase-js";

type TeacherContextValue = {
  user: User | null;
  teacher: Teacher | null;
  isTeacher: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const TeacherContext = createContext<TeacherContextValue | null>(null);

export function TeacherProvider({ children }: { children: ReactNode }) {
  const value = useTeacher();
  return (
    <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
  );
}

export function useTeacherContext(): TeacherContextValue {
  const ctx = useContext(TeacherContext);
  if (!ctx) {
    throw new Error("useTeacherContext debe usarse dentro de TeacherProvider");
  }
  return ctx;
}
