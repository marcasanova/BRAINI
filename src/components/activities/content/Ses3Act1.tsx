import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { CheckCircle, X, BookOpen, Heart, HeartOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatearTexto } from '@/components/activities/utils/TextFormatter';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import ActivityInstructions from '@/components/activities/utils/ActivityInstructions';
import SciBasePopup from '@/components/activities/utils/SciBasePopup';
import { EMOTIONS_INFANTIL_URL } from '@/constants/emotionsStorage';
import { 
  getPrimaryButtonClasses, 
  getSecondaryButtonClasses, 
  getInstructionsContainerClasses, 
  getDurationTextClasses,
  getMainTitleTextClasses,
  getSimpleButtonClasses,
  getBorderClasses,
  getScientificBaseIconClasses,
  getProgressBarColor
} from '@/components/activities/utils/ActivityColors';

interface Ses3Act1Props {
  userProgress?: UserActivity;
  activityId: number;
  levelId: string;
  userId: string;
  activityType?: string;
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
  { id: 10, nombre: "Ilusión", imagen: `${EMOTIONS_INFANTIL_URL}/10.%20Ilusion.png` },
  { id: 47, nombre: "Desilusión", imagen: `${EMOTIONS_INFANTIL_URL}/47.%20Desilusion.png` },
  { id: 1, nombre: "Alegría", imagen: `${EMOTIONS_INFANTIL_URL}/1.%20Alegria.png` },
  { id: 2, nombre: "Tristeza", imagen: `${EMOTIONS_INFANTIL_URL}/2.%20Tristeza.png` },
  { id: 18, nombre: "Contento", imagen: `${EMOTIONS_INFANTIL_URL}/18.%20Contento.png` },
  { id: 20, nombre: "Enfado", imagen: `${EMOTIONS_INFANTIL_URL}/20.%20Enfado.png` },
  { id: 21, nombre: "Paciencia", imagen: `${EMOTIONS_INFANTIL_URL}/21.%20Paciencia.png` },
  { id: 16, nombre: "Impaciencia", imagen: `${EMOTIONS_INFANTIL_URL}/16.%20Nerviosismo.png` },
  { id: 12, nombre: "Tranquila", imagen: `${EMOTIONS_INFANTIL_URL}/12.%20Tranquilidad.png` },
  { id: 16, nombre: "Nervioso", imagen: `${EMOTIONS_INFANTIL_URL}/16.%20Nerviosismo.png` },
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
  activityType,
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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);
  const [juegoCompletado, setJuegoCompletado] = useState(false);


  const totalClasificadas = emocionesMeGusta.length + emocionesNoMeGusta.length;
  const totalEmociones = EMOCIONES_ORIGINALES.length;
  const todasClasificadas = totalClasificadas === totalEmociones;

  // Precargar imágenes de emociones al montar para evitar parpadeos
  useEffect(() => {
    EMOCIONES_ORIGINALES.forEach((e) => {
      if (e.imagen) {
        const img = new Image();
        img.src = e.imagen;
      }
    });
  }, []);

  // Efecto para detectar cuando todas las emociones están clasificadas
  useEffect(() => {
    if (todasClasificadas && !juegoCompletado) {
      setJuegoCompletado(true);
      setTimeout(() => {
        setShowSuccessPopup(true);
      }, 500);
    }
  }, [todasClasificadas, juegoCompletado]);

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
      <ActivityInstructions
        activityType={activityType}
        duracionMin={activityData?.duracion_min}
        duracionMax={activityData?.duracion_max}
        comoSeJuega={activityData?.como_se_juega}
        investigacionBeneficios={activityData?.investigacion_beneficios}
        onShowScientificBase={() => setShowScientificBase(true)}
      />

      {/* Área de juego */}
      <div className="space-y-6">
        {/* Layout de 3 filas */}
        <div className="space-y-6">
          {/* Primera fila: Todas las emociones */}
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4">
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
                              ? 'bg-braini-green/10 border-braini-green'
                              : 'bg-braini-pink/10 border-braini-pink'
                            : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md'
                          }
                          cursor-pointer
                        `}
                      >
                        {emocion.imagen ? (
                          <div className="w-full h-24 mb-1.5 flex items-center justify-center bg-white rounded-lg overflow-hidden relative">
                            <img
                              src={emocion.imagen}
                              alt={emocion.nombre}
                              className="w-full h-full object-contain"
                              loading="eager"
                              onError={(e) => {
                                const t = e.currentTarget;
                                t.style.display = 'none';
                                const fb = t.nextElementSibling as HTMLElement;
                                if (fb) fb.style.display = 'flex';
                              }}
                            />
                            <div className="absolute inset-0 hidden items-center justify-center bg-gray-100 text-gray-500 text-2xl font-bold" style={{ display: 'none' }} aria-hidden>
                              {emocion.nombre.charAt(0)}
                            </div>
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
                              <div className="bg-braini-green rounded-full p-1">
                                <Heart className="w-3 h-3 text-white fill-current" />
                              </div>
                            ) : (
                              <div className="bg-braini-pink rounded-full p-1">
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
                  <div className="bg-braini-green/10 border-2 border-braini-green rounded-xl p-4 min-h-[200px]">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="w-6 h-6 text-braini-green fill-current" />
                      <h3 className="text-lg font-bold text-braini-green">
                        Me gusta
                      </h3>
                      <span className="ml-auto bg-braini-green text-white text-xs font-bold px-2 py-1 rounded-full">
                        {emocionesMeGusta.length}
                      </span>
                    </div>
                    <div className={emocionesMeGusta.length > 4 ? "grid grid-cols-2 gap-3" : "space-y-3"}>
                      {emocionesMeGusta.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 col-span-2">
                          <p className="text-sm">Haz click en una emoción</p>
                          <p className="text-xs mt-1">para clasificarla aquí</p>
                        </div>
                      ) : (
                        emocionesMeGusta.map((emocion) => (
                          <div
                            key={`${emocion.id}-${emocion.nombre}`}
                            onClick={() => handleEmocionClick(emocion)}
                            className="bg-white p-3 rounded-lg border border-braini-green cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              {emocion.imagen ? (
                                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white relative">
                                  <img
                                    src={emocion.imagen}
                                    alt={emocion.nombre}
                                    className="w-full h-full object-contain"
                                    loading="eager"
                                    onError={(e) => {
                                      const t = e.currentTarget;
                                      t.style.display = 'none';
                                      const fb = t.nextElementSibling as HTMLElement;
                                      if (fb) fb.style.display = 'flex';
                                    }}
                                  />
                                  <div className="absolute inset-0 hidden items-center justify-center bg-gray-100 text-gray-500 font-bold" style={{ display: 'none' }} aria-hidden>{emocion.nombre.charAt(0)}</div>
                                </div>
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-lg">{emocion.nombre.charAt(0)}</span>
                                </div>
                              )}
                              <span className="font-medium text-gray-700 flex-1">
                                {emocion.nombre}
                              </span>
                              <X className="w-4 h-4 text-gray-400 hover:text-braini-pink" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
            </div>

            {/* Fila 3: No me gusta */}
            <div>
                  <div className="bg-braini-pink/10 border-2 border-braini-pink rounded-xl p-4 min-h-[200px]">
                    <div className="flex items-center gap-2 mb-4">
                      <HeartOff className="w-6 h-6 text-braini-pink" />
                      <h3 className="text-lg font-bold text-braini-pink">
                        No me gusta
                      </h3>
                      <span className="ml-auto bg-braini-pink text-white text-xs font-bold px-2 py-1 rounded-full">
                        {emocionesNoMeGusta.length}
                      </span>
                    </div>
                    <div className={emocionesNoMeGusta.length > 4 ? "grid grid-cols-2 gap-3" : "space-y-3"}>
                      {emocionesNoMeGusta.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 col-span-2">
                          <p className="text-sm">Haz click en una emoción</p>
                          <p className="text-xs mt-1">para clasificarla aquí</p>
                        </div>
                      ) : (
                        emocionesNoMeGusta.map((emocion) => (
                          <div
                            key={`${emocion.id}-${emocion.nombre}`}
                            onClick={() => handleEmocionClick(emocion)}
                            className="bg-white p-3 rounded-lg border border-braini-pink cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              {emocion.imagen ? (
                                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white relative">
                                  <img
                                    src={emocion.imagen}
                                    alt={emocion.nombre}
                                    className="w-full h-full object-contain"
                                    loading="eager"
                                    onError={(e) => {
                                      const t = e.currentTarget;
                                      t.style.display = 'none';
                                      const fb = t.nextElementSibling as HTMLElement;
                                      if (fb) fb.style.display = 'flex';
                                    }}
                                  />
                                  <div className="absolute inset-0 hidden items-center justify-center bg-gray-100 text-gray-500 font-bold" style={{ display: 'none' }} aria-hidden>{emocion.nombre.charAt(0)}</div>
                                </div>
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-lg">{emocion.nombre.charAt(0)}</span>
                                </div>
                              )}
                              <span className="font-medium text-gray-700 flex-1">
                                {emocion.nombre}
                              </span>
                              <X className="w-4 h-4 text-gray-400 hover:text-braini-pink" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
            </div>
          </div>
        </div>
      </div>

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
                  <div className="w-32 h-32 mb-4 rounded-lg overflow-hidden bg-white relative">
                    <img
                      src={emocionSeleccionada.imagen}
                      alt={emocionSeleccionada.nombre}
                      className="w-full h-full object-contain"
                      loading="eager"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.display = 'none';
                        const fb = t.nextElementSibling as HTMLElement;
                        if (fb) fb.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 hidden items-center justify-center bg-gray-100 text-gray-500 text-4xl font-bold" style={{ display: 'none' }} aria-hidden>{emocionSeleccionada.nombre.charAt(0)}</div>
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
                  className="flex-1 bg-braini-green hover:bg-braini-green-dark text-white font-semibold py-3"
                >
                  <Heart className="w-5 h-5 mr-2 fill-current" />
                  Me gusta
                </Button>
                <Button
                  onClick={() => handleClasificar('noMeGusta')}
                  className="flex-1 bg-braini-pink hover:bg-braini-pink-dark text-white font-semibold py-3"
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
            // Al cerrar el popup, nos quedamos en la misma página para poder valorar la actividad
          }}
          activityType={activityType}
        />
      )}

      {/* Dialog de Base Científica */}
      <SciBasePopup
        open={showScientificBase}
        onOpenChange={setShowScientificBase}
        activityType={activityType}
        investigacionBeneficios={activityData?.investigacion_beneficios}
      />
    </div>
  );
};

export default Ses3Act1;

