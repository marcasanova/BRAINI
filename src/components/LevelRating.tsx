import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, StarOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
// Removed medalUtils import - now using SQL function

interface LevelRatingProps {
  levelId: number;
  userId: string;
  onMedalEarned?: (medal: any) => void; // Callback para cuando se gana una medalla
}

const LevelRating: React.FC<LevelRatingProps> = ({ levelId, userId, onMedalEarned }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const { toast } = useToast();

  // Cargar valoración existente
  useEffect(() => {
    const loadExistingRating = async () => {
      try {
        const { data, error } = await supabase
          .from('parents_levels')
          .select('puntuacion, opinion')
          .eq('user_id', userId)
          .eq('level_id', levelId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading rating:', error);
          return;
        }

        if (data) {
          if (data.puntuacion > 0) {
            setRating(data.puntuacion);
            setHasRated(true);
          }
          if (data.opinion) {
            setComment(data.opinion);
          }
        }
      } catch (error) {
        console.error('Error loading existing rating:', error);
      }
    };

    if (userId && levelId) {
      loadExistingRating();
    }
  }, [userId, levelId]);

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
      // Actualizar la puntuación - el trigger automáticamente manejará las medallas
      const { error } = await supabase
        .from('parents_levels')
        .update({ 
          puntuacion: rating,
          opinion: comment.trim() || null 
        })
        .eq('user_id', userId)
        .eq('level_id', levelId);

      if (error) throw error;

      setHasRated(true);
      toast({
        title: "¡Valoración guardada! ⭐",
        description: "Gracias por compartir tu opinión sobre este nivel.",
      });

      console.log('Valoración guardada, verificando medalla inmediatamente...');

      // Verificar inmediatamente si se ganó una medalla
      const checkMedalImmediately = async () => {
        try {
          // Verificar si el nivel se completó
          const { data: levelData, error: levelError } = await supabase
            .from('parents_levels')
            .select('status, completed_at')
            .eq('user_id', userId)
            .eq('level_id', levelId)
            .single();

          console.log('Estado del nivel después de valorar:', levelData);

          if (levelError) {
            console.log('Error obteniendo estado del nivel:', levelError);
            return false;
          }

          // Si el nivel se completó, obtener la medalla
          if (levelData.status === 'completed' && levelData.completed_at) {
            console.log('Nivel completado, obteniendo medalla...');
            
            // Obtener la medalla que corresponde a este nivel
            const { data: medalData, error: medalError } = await supabase
              .from('medals')
              .select('id, level_id, nombre, descripcion, icono, color')
              .eq('level_id', levelId)
              .single();

            if (medalError) {
              console.log('Error obteniendo datos de medalla:', medalError);
              return false;
            }

            console.log('¡Medalla encontrada!', medalData);
            if (onMedalEarned) {
              onMedalEarned(medalData);
            }
            return true;
          } else {
            console.log('Nivel no se completó aún');
            return false;
          }
        } catch (err) {
          console.log('Error verificando medalla:', err);
          return false;
        }
      };

      // Verificar inmediatamente
      let medalFound = await checkMedalImmediately();

      // Si no se encontró la medalla inmediatamente, hacer verificaciones adicionales rápidas
      if (!medalFound) {
        const checkInterval = setInterval(async () => {
          medalFound = await checkMedalImmediately();
          if (medalFound) {
            clearInterval(checkInterval);
          }
        }, 200); // Verificar cada 200ms

        // Parar después de 3 segundos máximo
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!medalFound) {
            console.log('No se encontró medalla después de 3 segundos');
          }
        }, 3000);
      }

    } catch (error) {
      console.error('Error saving rating:', error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar tu valoración. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-700 mb-4">
        ¿Qué te pareció este nivel?
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
            placeholder="Comparte tu experiencia con este nivel, qué te gustó, qué mejorarías..."
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

export default LevelRating; 