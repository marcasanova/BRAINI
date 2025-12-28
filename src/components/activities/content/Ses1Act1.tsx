import React, { useState } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { CheckCircle, X, Sparkles, BookOpen } from 'lucide-react';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import ActivityInstructions from '@/components/activities/utils/ActivityInstructions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  getSecondaryButtonClasses, 
  getInstructionsContainerClasses, 
  getDurationTextClasses,
  getSimpleButtonClasses,
  getBorderClasses,
  getScientificBaseTitleClasses,
  getScientificBaseIconClasses
} from '@/components/activities/utils/activityColors';

interface Ses1Act1Props {
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
  imagen: string; // Ruta del bucket de Supabase
  fraseId: number;
}

interface Frase {
  id: number;
  texto: string;
}

interface JugadaSeleccionada {
  tipo: 'imagen' | 'frase';
  elemento: Emocion | Frase;
}

/**
 * Actividad 1 - Sesión 1
 * Puzzle de Emociones: Empareja la imagen de la emoción con su frase de reflexión
 */
const Ses1Act1: React.FC<Ses1Act1Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityType,
  activityData,
  onPuzzleComplete
}) => {
  // ====================================================
  // DATOS HARDCODEADOS - Orden aleatorio cada vez
  // ====================================================
  const EMOCIONES_ORIGINALES: Emocion[] = [
    { id: 1, nombre: "Alegría", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/1.%20Alegria.jpg", fraseId: 1 },
    { id: 2, nombre: "Tristeza", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/2.%20Tristeza.jpg", fraseId: 2 },
    { id: 3, nombre: "Miedo", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/3.%20Miedo.jpg", fraseId: 3 },
    { id: 5, nombre: "Rabia", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/5.%20Rabia.jpg", fraseId: 5 },
    { id: 7, nombre: "Vergüenza", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/7.%20Vergueza.jpg", fraseId: 7 },
    { id: 9, nombre: "Sorpresa", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/9.%20Sorpresa.jpg", fraseId: 9 },
    { id: 13, nombre: "Felicidad", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/13.%20Felicidad.jpg", fraseId: 13 },
    { id: 15, nombre: "Asustado", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/15.%20Asustado.jpg", fraseId: 15 },
    { id: 18, nombre: "Contento", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/18.%20Contento.jpg", fraseId: 18 },
    { id: 20, nombre: "Enfado", imagen: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/20.%20Enfado.jpg", fraseId: 20 },
  ];

  const FRASES_ORIGINALES: Frase[] = [
    { id: 1, texto: "Siento alegría cuando…" },
    { id: 2, texto: "Una vez me sentí triste porque…" },
    { id: 3, texto: "Me da miedo…" },
    { id: 5, texto: "Un día sentí mucha rabia …" },
    { id: 7, texto: "Tengo vergüenza cuando…" },
    { id: 9, texto: "La sorpresa que más me gustó fue…" },
    { id: 13, texto: "Una cosa que me hace muy feliz es…" },
    { id: 15, texto: "Me asusta…" },
    { id: 18, texto: "Me siento contento/a cuando…" },
    { id: 20, texto: "Un día me enfadé porque…" },
  ];

  // Randomizar el orden al cargar
  const [EMOCIONES] = useState(() => 
    [...EMOCIONES_ORIGINALES].sort(() => Math.random() - 0.5)
  );
  
  const [FRASES] = useState(() => 
    [...FRASES_ORIGINALES].sort(() => Math.random() - 0.5)
  );

  // ====================================================
  // ESTADO DEL JUEGO
  // ====================================================
  const [completadas, setCompletadas] = useState<number[]>([]);
  const [seleccion, setSeleccion] = useState<JugadaSeleccionada | null>(null);
  const [error, setError] = useState(false);
  const [juegoCompletado, setJuegoCompletado] = useState(false);
  const [parIncorrecto, setParIncorrecto] = useState<{emocionId?: number, fraseId?: number} | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  // ====================================================
  // FUNCIONES DE LÓGICA
  // ====================================================
  const handleImagenClick = (emocion: Emocion) => {
    // Si ya está completada, no hacer nada
    if (completadas.includes(emocion.id)) return;

    // Si ya había una selección previa del mismo tipo, reemplazarla
    if (seleccion?.tipo === 'imagen') {
      setSeleccion({ tipo: 'imagen', elemento: emocion });
      return;
    }

    // Si había una frase seleccionada, verificar coincidencia
    if (seleccion?.tipo === 'frase') {
      const frase = seleccion.elemento as Frase;
      verificarCoincidencia(emocion, frase);
      return;
    }

    // Nueva selección de imagen
    setSeleccion({ tipo: 'imagen', elemento: emocion });
  };

  const handleFraseClick = (frase: Frase) => {
    // Si ya hay una selección del mismo tipo, reemplazarla
    if (seleccion?.tipo === 'frase') {
      setSeleccion({ tipo: 'frase', elemento: frase });
      return;
    }

    // Si había una imagen seleccionada, verificar coincidencia
    if (seleccion?.tipo === 'imagen') {
      const emocion = seleccion.elemento as Emocion;
      verificarCoincidencia(emocion, frase);
      return;
    }

    // Nueva selección de frase
    setSeleccion({ tipo: 'frase', elemento: frase });
  };

  const verificarCoincidencia = async (emocion: Emocion, frase: Frase) => {
    setError(false);
    setParIncorrecto(null);

    if (emocion.fraseId === frase.id) {
      // ✅ COINCIDENCIA CORRECTA
      const nuevasCompletadas = [...completadas, emocion.id];
      setCompletadas(nuevasCompletadas);
      setSeleccion(null);

      // Si completó todas las parejas
      if (nuevasCompletadas.length === EMOCIONES.length) {
        setJuegoCompletado(true);
        setShowSuccessPopup(true);
      }
    } else {
      // ❌ ERROR - Mostrar feedback visual
      setError(true);
      setParIncorrecto({ emocionId: emocion.id, fraseId: frase.id });
      setSeleccion(null);

      // Limpiar error y feedback visual después de 2 segundos
      setTimeout(() => {
        setError(false);
        setParIncorrecto(null);
      }, 500);
    }
  };

  const estaCompletada = (emocionId: number) => completadas.includes(emocionId);
  const estaSeleccionadaImagen = (emocionId: number) => 
    seleccion?.tipo === 'imagen' && (seleccion.elemento as Emocion).id === emocionId;
  const estaSeleccionadaFrase = (fraseId: number) => 
    seleccion?.tipo === 'frase' && (seleccion.elemento as Frase).id === fraseId;

  // Función para renderizar frase con emoción en negrita
  const renderFraseConEmocion = (frase: Frase) => {
    // Mapeo de fraseId a nombre de emoción (como aparece en el texto)
    const emocionMap: { [key: number]: string } = {
      1: 'alegría',
      2: 'triste',
      3: 'miedo',
      5: 'rabia',
      7: 'vergüenza',
      9: 'sorpresa',
      13: 'feliz',
      15: 'asusta',
      18: 'contento',
      20: 'enfadé'
    };

    const emocionNombre = emocionMap[frase.id];
    if (!emocionNombre) {
      // Si no hay emoción mapeada, devolver texto normal
      return <span className="font-normal">{frase.texto}</span>;
    }

    // Buscar la emoción en el texto (case insensitive)
    const texto = frase.texto;
    const regex = new RegExp(`(${emocionNombre})`, 'gi');
    const partes = texto.split(regex);

    return (
      <span className="font-normal">
        {partes.map((parte, index) => {
          // Si la parte coincide con el nombre de la emoción (case insensitive)
          if (parte.toLowerCase() === emocionNombre.toLowerCase()) {
            return <strong key={index} className="font-bold">{parte}</strong>;
          }
          return <span key={index}>{parte}</span>;
        })}
      </span>
    );
  };

  // ====================================================
  // RENDERIZADO
  // ====================================================
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

      {/* Área de juego - Dos filas horizontales */}
      <div className="space-y-6">
        {/* Primera fila: Imágenes de Emociones */}
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            Imágenes de Emociones
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {EMOCIONES.map((emocion) => (
              <button
                key={emocion.id}
                onClick={() => handleImagenClick(emocion)}
                disabled={estaCompletada(emocion.id)}
                className={`
                  relative p-2 rounded-xl border-2 transition-all duration-200
                  ${estaCompletada(emocion.id)
                    ? 'bg-braini-green/10 border-braini-green opacity-75 cursor-not-allowed'
                    : parIncorrecto?.emocionId === emocion.id
                    ? 'bg-braini-pink/10 border-braini-pink shadow-lg animate-shake'
                    : estaSeleccionadaImagen(emocion.id)
                    ? 'bg-blue-100 border-blue-500 shadow-lg transform scale-105'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                  }
                `}
              >
                {emocion.imagen ? (
                  <div className="w-full h-32 mb-1.5 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={emocion.imagen}
                      alt={emocion.nombre}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback si la imagen no carga
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj57ZW1vY2lvbi5ub21icmV9PC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-1.5">
                    <span className="text-2xl">{emocion.nombre.charAt(0)}</span>
                  </div>
                )}
                <p className="text-xs font-medium text-gray-700 text-center leading-tight">{emocion.nombre}</p>
                
                {parIncorrecto?.emocionId === emocion.id && (
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

        {/* Segunda fila: Frases de Reflexión */}
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            Frases de Reflexión
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {FRASES.map((frase) => (
              <button
                key={frase.id}
                onClick={() => handleFraseClick(frase)}
                disabled={completadas.some(emocionId => {
                  const emocion = EMOCIONES.find(e => e.id === emocionId);
                  return emocion && emocion.fraseId === frase.id;
                })}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all duration-200
                  min-h-[80px] flex flex-col justify-center
                  ${completadas.some(emocionId => {
                    const emocion = EMOCIONES.find(e => e.id === emocionId);
                    return emocion && emocion.fraseId === frase.id;
                  })
                    ? 'bg-braini-green/10 border-braini-green opacity-75 cursor-not-allowed'
                    : parIncorrecto?.fraseId === frase.id
                    ? 'bg-braini-pink/10 border-braini-pink shadow-lg animate-shake'
                    : estaSeleccionadaFrase(frase.id)
                    ? 'bg-blue-100 border-blue-500 shadow-lg transform scale-105'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                  }
                `}
              >
                <p className="text-sm text-gray-800 leading-relaxed">
                  {renderFraseConEmocion(frase)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

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
      <Dialog open={showScientificBase} onOpenChange={setShowScientificBase}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className={`text-3xl font-bold ${getScientificBaseTitleClasses(activityType)} flex items-center gap-2`}>
              <svg className={`w-7 h-7 ${getScientificBaseIconClasses(activityType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Base Científica
            </DialogTitle>
            <DialogDescription className="text-gray-700 font-semibold text-base">
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
              className={getSimpleButtonClasses(activityType) + " hover:shadow-xl transform hover:scale-105"}
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ses1Act1;

