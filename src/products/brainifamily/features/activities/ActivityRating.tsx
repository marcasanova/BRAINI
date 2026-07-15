import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ActivityRatingProps } from '@/products/brainifamily/hooks/useUserActivities';

const ActivityRating: React.FC<ActivityRatingProps> = ({ 
  activityId, 
  childId,
  missionId,
  activityType,
  onRatingSubmitted,
  onMedalEarned
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  // Función para obtener las clases del botón según el tipo de actividad
  const getButtonClasses = () => {
    const baseClasses = "text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200";
    
    switch (activityType) {
      case 'inteligencia_emocional':
        return `${baseClasses} bg-braini-blue hover:bg-braini-blue-dark`;
      case 'regulacion_emocional':
        return `${baseClasses} bg-braini-turquoise hover:bg-braini-turquoise-dark`;
      case 'vinculo_afectivo':
        return `${baseClasses} bg-braini-pink hover:bg-braini-pink-dark`;
      case 'acompañamiento_emocional':
        return `${baseClasses} bg-braini-yellow hover:bg-braini-yellow-dark`;
      default:
        return `${baseClasses} bg-braini-blue hover:bg-braini-blue-dark`;
    }
  };

  useEffect(() => {
    const loadExistingRating = async () => {
      if (childId && activityId) {
        const { data, error } = await supabase
          .from('child_activities')
          .select('puntuacion, opinion')
          .eq('child_id', childId)
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
  }, [childId, activityId]);

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  // Solo mostrar popup de medalla cuando la misión acaba de completarse (4ª actividad valorada).
  // No comprobamos child_medals: el trigger en BD ya inserta la medalla; mostramos el popup si la misión está completada tras esta valoración.
  const checkMissionCompletion = async (currentMissionId: number) => {
    if (!onMedalEarned || !childId) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const { data: missionData, error: missionError } = await supabase
        .from('child_missions')
        .select('status, completed_at')
        .eq('child_id', childId)
        .eq('mission_id', currentMissionId)
        .single();

      if (missionError || !missionData) return;
      if (missionData.status !== 'completed' || !missionData.completed_at) return;

      const { data: medalData, error: medalError } = await supabase
        .from('medals')
        .select('id, mission_id, nombre, descripcion, icono, color')
        .eq('mission_id', currentMissionId)
        .single();

      if (!medalError && medalData) {
        onMedalEarned(medalData);
      }
    } catch (error) {
      console.error('Error al verificar completado de la misión:', error);
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
        title: "⭐ Antes de guardar",
        description: "Elige al menos una estrella para valorar tu experiencia.",
        variant: "destructive",
      });
      return;
    }

    // Prevenir múltiples clics
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const updateData: any = { 
        puntuacion: rating,
        opinion: comment.trim() || null
      };

      const { error } = await supabase
        .from('child_activities')
        .update(updateData)
        .eq('child_id', childId)
        .eq('activity_id', activityId);

      if (error) throw error;

      setHasRated(true);
      
      // Resetear el estado de submitting antes de mostrar el toast
      setIsSubmitting(false);
      
      // Quitar el focus del botón para evitar que se quede en estado activo
      if (buttonRef.current) {
        buttonRef.current.blur();
      }
      
      toast({
        title: "✨ ¡Gracias por tu opinión!",
        description: "Nos ayuda a seguir mejorando Braini Emotions.",
      });

      if (missionId != null) {
        checkMissionCompletion(missionId).catch(() => {});
      }

      if (onRatingSubmitted) {
        onRatingSubmitted();
      }

    } catch (error) {
      setIsSubmitting(false);
      
      // Quitar el focus del botón en caso de error también
      if (buttonRef.current) {
        buttonRef.current.blur();
      }
      
      toast({
        title: "❌ Error al guardar la valoración",
        description: "No hemos podido guardar tu opinión. Por favor, verifica tu conexión e inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      {/* Primera prioridad: Título principal - Mismo tamaño que "Información de la actividad" */}
      <h3 className="text-2xl font-bold text-gray-700 mb-4">
        Valorar la actividad
      </h3>
      
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-[1fr_1.5fr] md:gap-3">
        {/* Sistema de Estrellas - Izquierda en desktop */}
        <div>
          {/* Segunda prioridad: Label de puntuación - Tamaño medio, destacado */}
          <p className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
            {hasRated ? 'Tu puntuación' : 'Selecciona una puntuación:'}
          </p>
          <div className="flex items-center gap-1 mb-2">
            {renderStars()}
          </div>
          {/* Tercera prioridad: Texto de ayuda - Más pequeño y menos destacado */}
          <p className="text-xs sm:text-sm text-gray-500">
            {rating === 0 && 'Toca una estrella para valorar'}
            {rating === 1 && 'No me gustó'}
            {rating === 2 && 'Me gustó poco'}
            {rating === 3 && 'Me gustó'}
            {rating === 4 && 'Me gustó mucho'}
            {rating === 5 && '¡Me encantó!'}
          </p>
        </div>

        {/* Campo de Opinión (Opcional) - Derecha en desktop */}
        <div>
          {/* Segunda prioridad: Label de opinión - Tamaño medio, destacado */}
          <label htmlFor="comment" className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
            Tu opinión (opcional)
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con esta actividad, qué te gustó, qué mejorarías..."
            className="resize-none text-base sm:text-sm text-gray-600 placeholder:text-gray-400"
            rows={3}
            maxLength={500}
          />
          {/* Contador de caracteres */}
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500">
              {comment.length}/500 caracteres
            </span>
          </div>
        </div>

      </div>

      {/* Botón de Envío - Fuera del grid, alineado a la derecha */}
      <div className="flex justify-end mt-4">
        <Button
          ref={buttonRef}
          onClick={handleRatingSubmit}
          disabled={isSubmitting || rating === 0}
          className={`${getButtonClasses()} w-full sm:w-auto sm:min-w-[200px] relative active:scale-95`}
          type="button"
        >
          <span className={`inline-block text-center transition-opacity duration-200 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
            {hasRated ? 'Actualizar Valoración' : 'Enviar Valoración'}
          </span>
          {isSubmitting && (
            <span className="absolute inset-0 flex items-center justify-center text-center">
              Guardando...
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ActivityRating;
