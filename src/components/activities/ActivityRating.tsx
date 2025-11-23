import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { ActivityRatingProps } from '@/hooks/useUserActivities';

const ActivityRating: React.FC<ActivityRatingProps> = ({ 
  activityId, 
  userId,
  levelId,
  activityType,
  onRatingSubmitted,
  onMedalEarned
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  // Función para obtener las clases del botón según el tipo de actividad
  const getButtonClasses = () => {
    const baseClasses = "text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200";
    
    switch (activityType) {
      case 'inteligencia_emocional':
        return `${baseClasses} bg-braini-blue hover:bg-braini-blue-dark`;
      case 'actividad_tecnica':
        return `${baseClasses} bg-braini-turquoise hover:bg-braini-turquoise-dark`;
      case 'vinculo_afectivo':
        return `${baseClasses} bg-braini-pink hover:bg-braini-pink-dark`;
      case 'acompañamiento_emocional':
        return `${baseClasses} bg-braini-yellow hover:bg-braini-yellow-dark`;
      default:
        return `${baseClasses} bg-braini-blue hover:bg-braini-blue-dark`;
    }
  };

  // Cargar valoración existente
  useEffect(() => {
    const loadExistingRating = async () => {
      if (userId && activityId) {
        const { data, error } = await supabase
          .from('parents_activities')
          .select('puntuacion, opinion')
          .eq('user_id', userId)
          .eq('activity_id', activityId)
          .single();

        if (data && !error) {
          setRating(data.puntuacion || 0);
          setComment(data.opinion || '');
          setHasRated(!!data.puntuacion);
        }
      }
    };

    loadExistingRating();
  }, [userId, activityId]);

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  // Función para verificar si el nivel se completó y se ganó medalla
  const checkLevelCompletion = async (currentLevelId: number) => {
    try {
      // Esperar un poco para que el trigger se ejecute
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verificar si el nivel se completó
      const { data: levelData, error: levelError } = await supabase
        .from('parents_levels')
        .select('status, completed_at')
        .eq('user_id', userId)
        .eq('level_id', currentLevelId)
        .single();

      if (levelError) {
        return;
      }

      // Si el nivel se completó, obtener la medalla
      if (levelData.status === 'completed' && levelData.completed_at) {
        // Obtener la medalla que corresponde a este nivel
        const { data: medalData, error: medalError } = await supabase
          .from('medals')
          .select('id, level_id, nombre, descripcion, icono, color')
          .eq('level_id', currentLevelId)
          .single();

        if (medalError || !medalData) {
          return;
        }

        // Verificar si la medalla ya existe antes de mostrarla
        const { data: existingMedal, error: checkError } = await supabase
          .from('parents_medals')
          .select('medal_id')
          .eq('user_id', userId)
          .eq('medal_id', medalData.id)
          .single();

        // Solo mostrar medalla si no existe (es nueva)
        if (!checkError && !existingMedal && onMedalEarned) {
          onMedalEarned(medalData);
        }
      }
    } catch (error) {
      // Silenciar errores en la verificación
      console.error('Error al verificar completado del nivel:', error);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;
      
      return (
        <button
          key={starValue}
          onClick={() => handleStarClick(starValue)}
          className="focus:outline-none transition-transform hover:scale-110"
          aria-label={`${starValue} estrella${starValue > 1 ? 's' : ''}`}
        >
          {isFilled ? (
            <Star className="w-8 h-8 text-yellow-400 fill-current" />
          ) : (
            <Star className="w-8 h-8 text-gray-300 hover:text-yellow-300 transition-colors" />
          )}
        </button>
      );
    });
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Valoración requerida",
        description: "Por favor, selecciona una puntuación antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Solo actualizar completed_at si es la primera valoración
      const updateData: any = { 
        puntuacion: rating,
        opinion: comment.trim() || null
      };
      
      // Solo añadir completed_at si no se ha valorado antes
      if (!hasRated) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('parents_activities')
        .update(updateData)
        .eq('user_id', userId)
        .eq('activity_id', activityId);

      if (error) throw error;

      setHasRated(true);
      toast({
        title: "¡Valoración guardada! ⭐",
        description: "Gracias por compartir tu opinión sobre esta actividad.",
      });

      // Verificar si se completó el nivel y se ganó medalla
      if (levelId) {
        await checkLevelCompletion(levelId);
      }

      if (onRatingSubmitted) {
        onRatingSubmitted();
      }

    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar tu valoración. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-700 mb-4">
        ¿Qué te pareció esta actividad?
      </h3>
      
      <div className="space-y-4">
        {/* Sistema de Estrellas */}
        <div>
          <p className="text-sm text-gray-600 mb-3">
            {hasRated ? 'Tu valoración:' : 'Selecciona una puntuación:'}
          </p>
          <div className="flex items-center gap-1 mb-2">
            {renderStars()}
          </div>
          <p className="text-sm text-gray-500">
            {rating === 0 && 'Toca una estrella para valorar'}
            {rating === 1 && 'No me gustó'}
            {rating === 2 && 'Me gustó poco'}
            {rating === 3 && 'Me gustó'}
            {rating === 4 && 'Me gustó mucho'}
            {rating === 5 && '¡Me encantó!'}
          </p>
        </div>

        {/* Campo de Opinión (Opcional) */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Tu opinión (opcional)
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con esta actividad, qué te gustó, qué mejorarías..."
            className="resize-none"
            rows={3}
          />
        </div>

        {/* Botón de Envío */}
        <div className="flex justify-end">
          <Button
            onClick={handleRatingSubmit}
            disabled={isSubmitting || rating === 0}
            className={getButtonClasses()}
          >
            {isSubmitting ? 'Guardando...' : hasRated ? 'Actualizar Valoración' : 'Enviar Valoración'}
          </Button>
        </div>

        {/* Mensaje de confirmación */}
        {hasRated && (
          <div className="text-sm text-braini-turquoise-dark bg-braini-turquoise/10 p-3 rounded-lg">
            ✅ Tu valoración ha sido guardada correctamente
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityRating;
