import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeacherMissionList from '@/components/teacher/TeacherMissionList';
import TeacherEmotionalDiary from '@/components/teacher/TeacherEmotionalDiary';
import TeacherActivityList from '@/components/teacher/TeacherActivityList';
import TeacherMedalList from '@/components/teacher/TeacherMedalList';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';

const ChildView: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [childName, setChildName] = useState<string>('');

  useEffect(() => {
    if (!childId) return;
    supabase
      .from('children')
      .select('nombre, apellidos')
      .eq('id', childId)
      .single()
      .then(({ data }) => {
        if (data) {
          setChildName([data.nombre, data.apellidos].filter(Boolean).join(' '));
        }
      });
  }, [childId]);

  if (!childId) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No se ha especificado ningún niño.</p>
        <Button variant="link" onClick={() => navigate('/brainifamily/teacher')}>
          Volver al dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/brainifamily/teacher')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al listado
        </Button>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">
        {childName || 'Cargando...'} — Progreso
      </h1>

      <Tabs defaultValue="misiones" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="misiones">Misiones</TabsTrigger>
          <TabsTrigger value="diario">Diario emocional</TabsTrigger>
          <TabsTrigger value="actividades">Actividades</TabsTrigger>
          <TabsTrigger value="medallas">Medallas</TabsTrigger>
        </TabsList>
        <TabsContent value="misiones">
          <TeacherMissionList childId={childId} />
        </TabsContent>
        <TabsContent value="diario">
          <TeacherEmotionalDiary childId={childId} />
        </TabsContent>
        <TabsContent value="actividades">
          <TeacherActivityList childId={childId} />
        </TabsContent>
        <TabsContent value="medallas">
          <TeacherMedalList childId={childId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChildView;
