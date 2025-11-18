import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { CheckCircle, X, BookOpen, Play, Heart, HeartOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Ses3Act1Props {
  userProgress?: UserActivity;
  activityId: number;
  levelId: string;
  userId: string;
  activityData?: {
    duracion_min?: number;
    duracion_max?: number;
    como_se_juega?: string;
    investigacion_beneficios?: string;
  };
  onPuzzleComplete?: () => void;
}

interface Emocion {
  id: number;
  nombre: string;
  imagen: string;
}

const EMOCIONES_ORIGINALES: Emocion[] = [
  { id: 10, nombre: "Ilusión", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/10.%20Ilusion.jpg" },
  { id: 47, nombre: "Desilusión", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/47.%20Desilusion.jpg" },
  { id: 1, nombre: "Alegría", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/1.%20Alegria.jpg" },
  { id: 2, nombre: "Tristeza", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/2.%20Tristeza.jpg" },
  { id: 18, nombre: "Contento", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/18.%20Contento.jpg" },
  { id: 20, nombre: "Enfado", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/20.%20Enfado.jpg" },
  { id: 21, nombre: "Paciencia", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/21.%20Paciencia.jpg" },
  { id: 16, nombre: "Impaciencia", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/16.%20Impaciencia.jpg" },
  { id: 12, nombre: "Tranquila", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/12.%20Tranquilidad.jpg" },
  { id: 16, nombre: "Nervioso", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/16.%20Nervioso.jpg" },
];

/**
 * Actividad 1 - Sesión 3
 * Me gusta, no me gusta: Clasificación de emociones según preferencias
 */
const Ses3Act1: React.FC<Ses3Act1Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityData,
  onPuzzleComplete
}) => {
  const { toast } = useToast();
  
  // Randomizar el orden al cargar
  const [emocionesOrdenadas] = useState(() => 
    [...EMOCIONES_ORIGINALES].sort(() => Math.random() - 0.5)
  );

  // Estados del juego
  const [emocionesMeGusta, setEmocionesMeGusta] = useState<Emocion[]>([]);
  const [emocionesNoMeGusta, setEmocionesNoMeGusta] = useState<Emocion[]>([]);
  const [emocionSeleccionada, setEmocionSeleccionada] = useState<Emocion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);
  const [juegoCompletado, setJuegoCompletado] = useState(false);


  const totalClasificadas = emocionesMeGusta.length + emocionesNoMeGusta.length;
  const totalEmociones = EMOCIONES_ORIGINALES.length;
  const todasClasificadas = totalClasificadas === totalEmociones;

  // Efecto para detectar cuando todas las emociones están clasificadas
  useEffect(() => {
    if (todasClasificadas && showActivityDialog && !juegoCompletado) {
      setJuegoCompletado(true);
      setTimeout(() => {
        setShowActivityDialog(false);
        setShowSuccessPopup(true);
      }, 500);
    }
  }, [todasClasificadas, showActivityDialog, juegoCompletado]);

  // Función para abrir modal de clasificación
  const handleEmocionClick = (emocion: Emocion) => {
    // Si ya está clasificada, permitir cambiar de categoría
    // Usar nombre además de ID para manejar IDs duplicados
    const enMeGusta = emocionesMeGusta.some(e => e.id === emocion.id && e.nombre === emocion.nombre);
    const enNoMeGusta = emocionesNoMeGusta.some(e => e.id === emocion.id && e.nombre === emocion.nombre);
    
    if (enMeGusta || enNoMeGusta) {
      // Remover de la categoría actual
      if (enMeGusta) {
        setEmocionesMeGusta(prev => prev.filter(e => !(e.id === emocion.id && e.nombre === emocion.nombre)));
      } else {
        setEmocionesNoMeGusta(prev => prev.filter(e => !(e.id === emocion.id && e.nombre === emocion.nombre)));
      }
      // Abrir modal para reclasificar
      setEmocionSeleccionada(emocion);
      setShowModal(true);
    } else {
      // Nueva clasificación
      setEmocionSeleccionada(emocion);
      setShowModal(true);
    }
  };

  // Función para clasificar emoción
  const handleClasificar = (categoria: 'meGusta' | 'noMeGusta') => {
    if (!emocionSeleccionada) return;

    if (categoria === 'meGusta') {
      // Remover de "No me gusta" si está ahí (usando nombre también)
      setEmocionesNoMeGusta(prev => prev.filter(e => !(e.id === emocionSeleccionada.id && e.nombre === emocionSeleccionada.nombre)));
      // Agregar a "Me gusta" solo si no está ya
      setEmocionesMeGusta(prev => {
        const yaExiste = prev.some(e => e.id === emocionSeleccionada.id && e.nombre === emocionSeleccionada.nombre);
        return yaExiste ? prev : [...prev, emocionSeleccionada];
      });
    } else {
      // Remover de "Me gusta" si está ahí (usando nombre también)
      setEmocionesMeGusta(prev => prev.filter(e => !(e.id === emocionSeleccionada.id && e.nombre === emocionSeleccionada.nombre)));
      // Agregar a "No me gusta" solo si no está ya
      setEmocionesNoMeGusta(prev => {
        const yaExiste = prev.some(e => e.id === emocionSeleccionada.id && e.nombre === emocionSeleccionada.nombre);
        return yaExiste ? prev : [...prev, emocionSeleccionada];
      });
    }

    setShowModal(false);
    setEmocionSeleccionada(null);

    // Verificar si se completó después de actualizar el estado
    // Usamos useEffect para detectar cuando todas están clasificadas
  };

  // Función para abrir dialog de actividad
  const openActivityDialog = () => {
    // Resetear todo
    setEmocionesMeGusta([]);
    setEmocionesNoMeGusta([]);
    setEmocionSeleccionada(null);
    setShowModal(false);
    setJuegoCompletado(false);
    setShowActivityDialog(true);
  };

  // Función para verificar si una emoción está clasificada
  const estaClasificada = (emocion: Emocion) => {
    return emocionesMeGusta.some(e => e.id === emocion.id && e.nombre === emocion.nombre) || 
           emocionesNoMeGusta.some(e => e.id === emocion.id && e.nombre === emocion.nombre);
  };

  // Función para obtener la categoría de una emoción
  const obtenerCategoria = (emocion: Emocion): 'meGusta' | 'noMeGusta' | null => {
    if (emocionesMeGusta.some(e => e.id === emocion.id && e.nombre === emocion.nombre)) return 'meGusta';
    if (emocionesNoMeGusta.some(e => e.id === emocion.id && e.nombre === emocion.nombre)) return 'noMeGusta';
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones con datos del backend */}
      {activityData && (
        <div className="bg-gradient-to-r from-braini-blue/10 to-braini-blue/5 p-6 rounded-xl border border-braini-blue/20">
          {/* Duración del backend */}
          {activityData.duracion_min && activityData.duracion_max && (
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong className="text-braini-blue-dark">Duración:</strong> {activityData.duracion_min} - {activityData.duracion_max} minutos
            </p>
          )}
          {/* ¿Cómo se juega? del backend - Con formateo */}
          {activityData.como_se_juega && (
            <div className="text-gray-700 leading-relaxed mb-4">
              {formatearTexto(activityData.como_se_juega)}
            </div>
          )}
          {/* Botones de acción */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              onClick={openActivityDialog}
              className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Empezar Actividad
            </Button>
            {activityData.investigacion_beneficios && (
              <Button
                onClick={() => setShowScientificBase(true)}
                variant="outline"
                className="bg-white/80 hover:bg-white border-braini-blue/30 text-braini-blue hover:text-braini-blue-dark hover:border-braini-blue transition-all duration-300 px-6 py-3 text-lg"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Ver Base Científica
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Dialog de la actividad interactiva */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg p-0">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-braini-blue-dark mb-2">
                Me gusta, no me gusta
              </h2>
              <p className="text-gray-600">
                Clasifica las emociones según lo que te hace sentir
              </p>
            </div>

            {/* Indicador de progreso */}
            <div className="mb-6 p-4 bg-gradient-to-r from-braini-blue/10 to-braini-blue/5 rounded-xl border border-braini-blue/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Progreso</span>
                <span className="text-sm font-bold text-braini-blue">
                  {totalClasificadas} de {totalEmociones} emociones clasificadas
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-braini-blue to-braini-blue-light h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(totalClasificadas / totalEmociones) * 100}%` }}
                />
              </div>
            </div>

            {/* Layout de 3 filas */}
            <div className="space-y-6">
              {/* Primera fila: Todas las emociones */}
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
                  Emociones
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {emocionesOrdenadas.map((emocion) => {
                    const clasificada = estaClasificada(emocion);
                    const categoria = obtenerCategoria(emocion);
                    
                    return (
                      <button
                        key={`${emocion.id}-${emocion.nombre}`}
                        onClick={() => handleEmocionClick(emocion)}
                        className={`
                          relative p-2 rounded-xl border-2 transition-all duration-200
                          ${clasificada
                            ? categoria === 'meGusta'
                              ? 'bg-green-50 border-green-300'
                              : 'bg-red-50 border-red-300'
                            : 'bg-white border-gray-300 hover:border-braini-blue hover:shadow-md'
                          }
                          cursor-pointer
                        `}
                      >
                        {emocion.imagen ? (
                          <div className="w-full h-24 mb-1.5 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                            <img
                              src={emocion.imagen}
                              alt={emocion.nombre}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj57ZW1vY2lvbi5ub21icmV9PC90ZXh0Pjwvc3ZnPg==';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-1.5">
                            <span className="text-2xl">{emocion.nombre.charAt(0)}</span>
                          </div>
                        )}
                        <p className="text-xs font-medium text-gray-700 text-center leading-tight">
                          {emocion.nombre}
                        </p>
                        
                        {clasificada && (
                          <div className="absolute top-1 right-1">
                            {categoria === 'meGusta' ? (
                              <div className="bg-green-500 rounded-full p-1">
                                <Heart className="w-3 h-3 text-white fill-current" />
                              </div>
                            ) : (
                              <div className="bg-red-500 rounded-full p-1">
                                <HeartOff className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Segunda y tercera fila: Me gusta y No me gusta (mismo ancho) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Fila 2: Me gusta */}
                <div>
                  <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 min-h-[300px]">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="w-6 h-6 text-green-600 fill-current" />
                      <h3 className="text-lg font-bold text-green-700">
                        Me gusta
                      </h3>
                      <span className="ml-auto bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {emocionesMeGusta.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {emocionesMeGusta.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <p className="text-sm">Haz click en una emoción</p>
                          <p className="text-xs mt-1">para clasificarla aquí</p>
                        </div>
                      ) : (
                        emocionesMeGusta.map((emocion) => (
                          <div
                            key={`${emocion.id}-${emocion.nombre}`}
                            onClick={() => handleEmocionClick(emocion)}
                            className="bg-white p-3 rounded-lg border border-green-300 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              {emocion.imagen ? (
                                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                                  <img
                                    src={emocion.imagen}
                                    alt={emocion.nombre}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-lg">{emocion.nombre.charAt(0)}</span>
                                </div>
                              )}
                              <span className="font-medium text-gray-700 flex-1">
                                {emocion.nombre}
                              </span>
                              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Fila 3: No me gusta */}
                <div>
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 min-h-[300px]">
                    <div className="flex items-center gap-2 mb-4">
                      <HeartOff className="w-6 h-6 text-red-600" />
                      <h3 className="text-lg font-bold text-red-700">
                        No me gusta
                      </h3>
                      <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {emocionesNoMeGusta.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {emocionesNoMeGusta.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <p className="text-sm">Haz click en una emoción</p>
                          <p className="text-xs mt-1">para clasificarla aquí</p>
                        </div>
                      ) : (
                        emocionesNoMeGusta.map((emocion) => (
                          <div
                            key={`${emocion.id}-${emocion.nombre}`}
                            onClick={() => handleEmocionClick(emocion)}
                            className="bg-white p-3 rounded-lg border border-red-300 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              {emocion.imagen ? (
                                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                                  <img
                                    src={emocion.imagen}
                                    alt={emocion.nombre}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-lg">{emocion.nombre.charAt(0)}</span>
                                </div>
                              )}
                              <span className="font-medium text-gray-700 flex-1">
                                {emocion.nombre}
                              </span>
                              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje de completado */}
            {todasClasificadas && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-xl text-center">
                <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  <span>¡Todas las emociones clasificadas! La actividad se completará automáticamente.</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para clasificar emoción */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Clasificar emoción
            </DialogTitle>
            <DialogDescription>
              ¿Cómo te hace sentir esta emoción?
            </DialogDescription>
          </DialogHeader>
          {emocionSeleccionada && (
            <div className="mt-4">
              <div className="flex flex-col items-center mb-6">
                {emocionSeleccionada.imagen ? (
                  <div className="w-32 h-32 mb-4 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={emocionSeleccionada.imagen}
                      alt={emocionSeleccionada.nombre}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">{emocionSeleccionada.nombre.charAt(0)}</span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-800">
                  {emocionSeleccionada.nombre}
                </h3>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleClasificar('meGusta')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3"
                >
                  <Heart className="w-5 h-5 mr-2 fill-current" />
                  Me gusta
                </Button>
                <Button
                  onClick={() => handleClasificar('noMeGusta')}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3"
                >
                  <HeartOff className="w-5 h-5 mr-2" />
                  No me gusta
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => {
            setShowSuccessPopup(false);
            if (onPuzzleComplete) {
              onPuzzleComplete();
            }
          }}
        />
      )}

      {/* Dialog de Base Científica */}
      <Dialog open={showScientificBase} onOpenChange={setShowScientificBase}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-indigo-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Base Científica
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Información respaldada por investigaciones científicas
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {activityData?.investigacion_beneficios && (
              <div className="text-gray-700 leading-relaxed">
                {formatearTexto(activityData.investigacion_beneficios)}
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setShowScientificBase(false)}
              className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ses3Act1;

