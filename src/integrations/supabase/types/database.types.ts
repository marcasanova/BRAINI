/**
 * Tipos mínimos del esquema Supabase usados por la capa de queries del frontend.
 * Sustituir por `supabase gen types` cuando esté disponible en CI.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      missions: {
        Row: {
          id: number;
          titulo: string;
          descripcion: string | null;
        };
      };
      child_missions: {
        Row: {
          child_id: string;
          mission_id: number;
          status: string;
        };
      };
      activities: {
        Row: {
          id: number;
          titulo_actividad: string;
          mission_id: number;
          objetivo: string | null;
          duracion_min: number | null;
          duracion_max: number | null;
          como_se_juega: string | null;
          investigacion_beneficios: string | null;
          tipo_actividad: string | null;
          contenido_vinculo: Json | null;
          contenido_apoyo: string | null;
        };
      };
      child_activities: {
        Row: {
          child_id: string;
          activity_id: number;
          puntuacion: number | null;
          opinion: string | null;
          started_at: string | null;
        };
      };
      medals: {
        Row: {
          id: number;
        };
      };
      child_medals: {
        Row: {
          id: number;
          child_id: string;
          medal_id: number;
          fecha_obtencion: string;
        };
      };
      emotional_diary: {
        Row: {
          id: number;
          user_id: string;
          child_id: string;
          emotion_names: string[];
          observations: string | null;
          entry_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          child_id: string;
          emotion_names: string[];
          observations?: string | null;
          entry_date: string;
          updated_at?: string;
        };
      };
      teachers: {
        Row: {
          id: string;
          email: string | null;
          nombre: string;
          school_id: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      classes: {
        Row: {
          id: string;
          name: string;
          course_id: number;
          nivel_educativo: string | null;
          teacher_id: string;
          active: boolean;
        };
      };
      children: {
        Row: {
          id: string;
          parent_id: string;
          nombre: string;
          apellidos: string | null;
          nivel_educativo: string | null;
          course_id: number | null;
          profile_completed: boolean;
          school_id: string | null;
          class_id: string | null;
          active: boolean;
          created_at: string;
        };
      };
      parents: {
        Row: {
          id: string;
        };
      };
      parent_invited: {
        Row: {
          child_id: string;
          token: string;
          email: string | null;
          status: string;
          expires_at: string;
          created_at: string;
        };
      };
    };
  };
}
