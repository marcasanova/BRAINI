import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { CheckCircle, X, BookOpen } from 'lucide-react';
import { formatearTexto } from '@/components/activities/utils/TextFormatter';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import ActivityInstructions from '@/components/activities/utils/ActivityInstructions';
import SciBasePopup from '@/components/activities/utils/SciBasePopup';
import { 
  getPrimaryButtonClasses, 
  getSecondaryButtonClasses, 
  getInstructionsContainerClasses, 
  getDurationTextClasses,
  getSimpleButtonClasses,
  getBorderClasses,
  getMainTitleTextClasses
} from '@/components/activities/utils/ActivityColors';

interface Ses10Act1Props {
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

const SUPABASE_STORAGE_URL = 'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images';

// Pares de emociones contrarias
const PARES_EMOCIONES: { emocion1: string; emocion2: string }[] = [
  { emocion1: "Contento", emocion2: "Triste" },
  { emocion1: "Ilusión", emocion2: "Desilusión" },
  { emocion1: "Entusiasmo", emocion2: "Enfado" },
  { emocion1: "Amabilidad", emocion2: "Envidia" },
  { emocion1: "Felicidad", emocion2: "Miedo" },
  { emocion1: "Ternura", emocion2: "Celos" },
];

// Mapeo de nombres de emociones a IDs e imágenes
const emocionMap: { [key: string]: { id: number; imagen: string } } = {
  "Contento": { id: 18, imagen: `${SUPABASE_STORAGE_URL}/18.%20Contento.jpg` },
  "Triste": { id: 2, imagen: `${SUPABASE_STORAGE_URL}/2.%20Tristeza.jpg` },
  "Ilusión": { id: 10, imagen: `${SUPABASE_STORAGE_URL}/10.%20Ilusion.jpg` },
  "Desilusión": { id: 47, imagen: `${SUPABASE_STORAGE_URL}/47.%20Desilusion.jpg` },
  "Entusiasmo": { id: 19, imagen: `${SUPABASE_STORAGE_URL}/19.%20Entusiasmo.jpg` },
  "Enfado": { id: 20, imagen: `${SUPABASE_STORAGE_URL}/20.%20Enfado.jpg` },
  "Amabilidad": { id: 22, imagen: `${SUPABASE_STORAGE_URL}/22.%20Amabilidad.jpg` },
  "Envidia": { id: 8, imagen: `${SUPABASE_STORAGE_URL}/8.%20Envidia.jpg` },
  "Felicidad": { id: 13, imagen: `${SUPABASE_STORAGE_URL}/13.%20Felicidad.jpg` },
  "Miedo": { id: 3, imagen: `${SUPABASE_STORAGE_URL}/3.%20Miedo.jpg` },
  "Ternura": { id: 23, imagen: `${SUPABASE_STORAGE_URL}/23.%20Ternura.jpg` },
  "Celos": { id: 6, imagen: `${SUPABASE_STORAGE_URL}/6.%20Celos.jpg` },
};

/**
 * Actividad 1 - Sesión 10
 * Emociones de todos los colores: Emparejar emociones contrarias
 */
const Ses10Act1: React.FC<Ses10Act1Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityType,
  activityData,
  onPuzzleComplete
}) => {
  // Estados del juego
  const [emociones, setEmociones] = useState<Emocion[]>([]);
  const [seleccion, setSeleccion] = useState<Emocion | null>(null);
  const [completadas, setCompletadas] = useState<number[]>([]);
  const [error, setError] = useState(false);
  const [parIncorrecto, setParIncorrecto] = useState<{ emocion1Id: number; emocion2Id: number } | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);
  const [juegoCompletado, setJuegoCompletado] = useState(false);
  const [isActivityCompleted, setIsActivityCompleted] = useState(false);

  // Inicializar emociones mezcladas al montar el componente
  useEffect(() => {
    const todasEmociones: Emocion[] = [];
    
    PARES_EMOCIONES.forEach(par => {
      // Agregar emoción 1
      if (emocionMap[par.emocion1]) {
        todasEmociones.push({
          id: emocionMap[par.emocion1].id,
          nombre: par.emocion1,
          imagen: emocionMap[par.emocion1].imagen
        });
      }
      // Agregar emoción 2
      if (emocionMap[par.emocion2]) {
        todasEmociones.push({
          id: emocionMap[par.emocion2].id,
          nombre: par.emocion2,
          imagen: emocionMap[par.emocion2].imagen
        });
      }
    });

    // Mezclar aleatoriamente
    const shuffled = [...todasEmociones].sort(() => Math.random() - 0.5);
    setEmociones(shuffled);
    setCompletadas([]);
    setSeleccion(null);
    setJuegoCompletado(false);
    setIsActivityCompleted(false);
  }, []);

  // Función para verificar si dos emociones forman un par
  const sonPareja = (emocion1: Emocion, emocion2: Emocion): boolean => {
    return PARES_EMOCIONES.some(par => 
      (par.emocion1 === emocion1.nombre && par.emocion2 === emocion2.nombre) ||
      (par.emocion1 === emocion2.nombre && par.emocion2 === emocion1.nombre)
    );
  };

  // Función para manejar click en emoción
  const handleEmocionClick = (emocion: Emocion) => {
    // Si ya está completada, no hacer nada
    if (completadas.includes(emocion.id)) return;

    // Si ya había una selección previa, verificar si forman pareja
    if (seleccion) {
      // Si es la misma emoción, deseleccionar
      if (seleccion.id === emocion.id) {
        setSeleccion(null);
        return;
      }

      // Verificar si forman pareja
      if (sonPareja(seleccion, emocion)) {
        // ✅ PAREJA CORRECTA
        const nuevasCompletadas = [...completadas, seleccion.id, emocion.id];
        setCompletadas(nuevasCompletadas);
        setSeleccion(null);
        setError(false);
        setParIncorrecto(null);

        // Si completó todas las parejas (12 emociones = 6 parejas)
        if (nuevasCompletadas.length === emociones.length) {
          setJuegoCompletado(true);
          setIsActivityCompleted(true);
          setTimeout(() => {
            setShowSuccessPopup(true);
          }, 500);
        }
      } else {
        // ❌ ERROR - Mostrar feedback visual
        setError(true);
        setParIncorrecto({ emocion1Id: seleccion.id, emocion2Id: emocion.id });
        setSeleccion(null);

        // Limpiar error y feedback visual después de 500ms
        setTimeout(() => {
          setError(false);
          setParIncorrecto(null);
        }, 500);
      }
    } else {
      // Nueva selección
      setSeleccion(emocion);
    }
  };

  // Función para verificar estados
  const estaCompletada = (emocionId: number) => completadas.includes(emocionId);
  const estaSeleccionada = (emocionId: number) => seleccion?.id === emocionId;
  const estaEnError = (emocionId: number) => 
    parIncorrecto?.emocion1Id === emocionId || parIncorrecto?.emocion2Id === emocionId;

  // Calcular progreso
  const parejasCompletadas = completadas.length / 2;
  const totalParejas = PARES_EMOCIONES.length;

  // Función para reiniciar la actividad
  const resetActivity = () => {
    const todasEmociones: Emocion[] = [];
    
    PARES_EMOCIONES.forEach(par => {
      if (emocionMap[par.emocion1]) {
        todasEmociones.push({
          id: emocionMap[par.emocion1].id,
          nombre: par.emocion1,
          imagen: emocionMap[par.emocion1].imagen
        });
      }
      if (emocionMap[par.emocion2]) {
        todasEmociones.push({
          id: emocionMap[par.emocion2].id,
          nombre: par.emocion2,
          imagen: emocionMap[par.emocion2].imagen
        });
      }
    });

    const shuffled = [...todasEmociones].sort(() => Math.random() - 0.5);
    setEmociones(shuffled);
    setCompletadas([]);
    setSeleccion(null);
    setJuegoCompletado(false);
    setIsActivityCompleted(false);
    setShowSuccessPopup(false);
    setError(false);
    setParIncorrecto(null);
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

      {/* Introducción */}
      <div className={`${getInstructionsContainerClasses(activityType)} p-6 rounded-xl`}>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3">
          Hoy vamos a descubrir que el corazón siente emociones de todos los colores.
        </p>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
          Unas nos gustan más que otras, pero todas nos enseñan algo importante.
        </p>
      </div>

      {/* Instrucción de la actividad */}
      <div className={`${getInstructionsContainerClasses(activityType)} p-6 rounded-xl`}>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg font-semibold text-center">
          Empareja cada emoción con su contraria.
        </p>
      </div>

      {/* Barra de progreso */}
      {!isActivityCompleted && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="font-medium">Progreso</span>
            <span className="font-bold">{parejasCompletadas} de {totalParejas} parejas encontradas</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                activityType === 'inteligencia-emocional'
                  ? 'bg-braini-green'
                  : activityType === 'atencion'
                  ? 'bg-braini-blue'
                  : activityType === 'memoria'
                  ? 'bg-braini-purple'
                  : 'bg-braini-orange'
              }`}
              style={{ width: `${(parejasCompletadas / totalParejas) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Área de juego - Dos filas separadas */}
      {!isActivityCompleted ? (
        <div className="space-y-6">
          {/* Primera fila: Emociones del primer grupo */}
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              Emociones Grupo 1
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {emociones.slice(0, 6).map((emocion) => (
                <button
                  key={`${emocion.id}-${emocion.nombre}`}
                  onClick={() => handleEmocionClick(emocion)}
                  disabled={estaCompletada(emocion.id)}
                  className={`
                    relative p-2 rounded-xl border-2 transition-all duration-200
                    ${estaCompletada(emocion.id)
                      ? 'bg-braini-green/10 border-braini-green opacity-75 cursor-not-allowed'
                      : estaEnError(emocion.id)
                      ? 'bg-braini-pink/10 border-braini-pink shadow-lg animate-shake'
                      : estaSeleccionada(emocion.id)
                      ? 'bg-blue-100 border-blue-500 shadow-lg transform scale-105'
                      : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                    }
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
                  
                  {estaEnError(emocion.id) && (
                    <div className="absolute top-1 right-1 bg-braini-pink rounded-full p-1 animate-pulse">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {estaCompletada(emocion.id) && (
                    <div className="absolute top-1 right-1 bg-braini-green rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Segunda fila: Emociones del segundo grupo */}
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              Emociones Grupo 2
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {emociones.slice(6, 12).map((emocion) => (
                <button
                  key={`${emocion.id}-${emocion.nombre}`}
                  onClick={() => handleEmocionClick(emocion)}
                  disabled={estaCompletada(emocion.id)}
                  className={`
                    relative p-2 rounded-xl border-2 transition-all duration-200
                    ${estaCompletada(emocion.id)
                      ? 'bg-braini-green/10 border-braini-green opacity-75 cursor-not-allowed'
                      : estaEnError(emocion.id)
                      ? 'bg-braini-pink/10 border-braini-pink shadow-lg animate-shake'
                      : estaSeleccionada(emocion.id)
                      ? 'bg-blue-100 border-blue-500 shadow-lg transform scale-105'
                      : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                    }
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
                  
                  {estaEnError(emocion.id) && (
                    <div className="absolute top-1 right-1 bg-braini-pink rounded-full p-1 animate-pulse">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {estaCompletada(emocion.id) && (
                    <div className="absolute top-1 right-1 bg-braini-green rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Pantalla de actividad completada */
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border-0 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className={`text-3xl font-black ${getMainTitleTextClasses(activityType)} mb-4`}>
              ¡Actividad Completada!
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Has emparejado todas las emociones contrarias. Recuerda que todas las emociones nos enseñan algo importante.
            </p>
          </div>
          <Button
            onClick={resetActivity}
            className={getPrimaryButtonClasses(activityType)}
          >
            Repetir Actividad
          </Button>
        </div>
      )}

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => {
            setShowSuccessPopup(false);
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

export default Ses10Act1;
