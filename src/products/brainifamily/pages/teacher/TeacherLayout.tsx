import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Button } from '@/shared/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTeacherContext } from '@/products/brainifamily/contexts/TeacherContext';
import { useToast } from '@/shared/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  TEACHER_AVATARS,
  isTeacherAvatarId,
  pickRandomTeacherAvatarId,
  teacherAvatarSrc,
  type TeacherAvatarId,
} from '@/products/brainifamily/lib/teacherAvatars';

function teacherInitial(nombre: string | undefined): string {
  const trimmed = nombre?.trim() ?? '';
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

const TeacherLayout: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { teacher, refetch } = useTeacherContext();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const assigningRef = useRef(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/brainifamily/login');
  };

  const goHome = () => navigate('/brainifamily/teacher');

  const persistAvatar = async (avatarId: TeacherAvatarId) => {
    if (!teacher?.id) return;
    setSaving(true);
    const { error } = await supabase
      .from('teachers')
      .update({ avatar_id: avatarId })
      .eq('id', teacher.id);
    setSaving(false);
    if (error) {
      toast({
        title: 'No se pudo guardar el avatar',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    setPickerOpen(false);
    await refetch();
  };

  useEffect(() => {
    if (!teacher?.id || assigningRef.current) return;
    if (isTeacherAvatarId(teacher.avatar_id)) return;
    assigningRef.current = true;
    const avatarId = pickRandomTeacherAvatarId();
    void supabase
      .from('teachers')
      .update({ avatar_id: avatarId })
      .eq('id', teacher.id)
      .then(async ({ error }) => {
        if (error) {
          assigningRef.current = false;
          return;
        }
        await refetch();
      });
  }, [teacher?.id, teacher?.avatar_id, refetch]);

  return (
    <div className="min-h-screen font-montserrat bg-linear-to-br from-braini-blue/10 via-white to-braini-turquoise/10 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              {isTeacherAvatarId(teacher?.avatar_id) ? (
                <img
                  src={teacherAvatarSrc(teacher.avatar_id)}
                  alt={teacher?.nombre ? `Avatar de ${teacher.nombre}` : 'Avatar del profesorado'}
                  className="h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44 rounded-full object-cover bg-white shadow-md"
                />
              ) : (
                <div
                  className="h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44 rounded-full bg-braini-yellow flex items-center justify-center text-4xl sm:text-5xl font-black text-gray-800 shadow-md"
                  aria-hidden
                >
                  {teacherInitial(teacher?.nombre)}
                </div>
              )}
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                disabled={!teacher?.id || saving}
                className="text-xs sm:text-sm font-semibold text-braini-blue hover:underline disabled:opacity-50"
              >
                Cambiar avatar
              </button>
            </div>
            <button type="button" onClick={goHome} className="text-left">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontWeight: 900 }}>
                Panel de profesorado
              </h1>
              <p className="text-gray-600 text-sm">{teacher?.nombre ?? 'Tus clases'}</p>
            </button>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-braini-blue/30">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </header>
        <Outlet />
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Elige un avatar</DialogTitle>
            <DialogDescription>
              {teacher?.nombre
                ? `Perfil de ${teacher.nombre}`
                : 'Elige el personaje de tu perfil'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {TEACHER_AVATARS.map((avatar) => {
              const selected = teacher?.avatar_id === avatar.id;
              return (
                <button
                  key={avatar.id}
                  type="button"
                  disabled={saving}
                  onClick={() => void persistAvatar(avatar.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl p-1.5 border-2 transition-colors ${
                    selected
                      ? 'border-braini-blue bg-braini-blue/10'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={teacherAvatarSrc(avatar.id)}
                    alt={avatar.label}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                  />
                  <span className="text-[10px] font-medium text-gray-700">{avatar.label}</span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherLayout;
