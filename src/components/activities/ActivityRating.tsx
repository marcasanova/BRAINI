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
  onRatingSubmitted 
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

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
            className="bg-braini-blue hover:bg-braini-blue-dark text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isSubmitting ? 'Guardando...' : hasRated ? 'Actualizar Valoración' : 'Enviar Valoración'}
          </Button>
        </div>

        {/* Mensaje de confirmación */}
        {hasRated && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            ✅ Tu valoración ha sido guardada correctamente
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityRating;
