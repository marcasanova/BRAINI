import React, { useState } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { CheckCircle, X, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatearTexto } from '@/components/activities/utils/textFormatter';

interface Ses1Act1Props {
  userProgress?: UserActivity;
  activityId: number;
  levelId: string;
  userId: string;
  activityData?: {
    duracion_min?: number;
    duracion_max?: number;
    como_se_juega?: string;
    retroalimentacion?: string;
  };
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
  activityData
}) => {
  const { toast } = useToast();
  
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
      
      // Mostrar toast de éxito
      toast({
        title: "¡Correcto! 🎉",
        description: `Has emparejado ${emocion.nombre} correctamente`,
      });

      // Si completó todas las parejas
      if (nuevasCompletadas.length === EMOCIONES.length) {
        setJuegoCompletado(true);

        toast({
          title: "¡Fantástico! 🏆",
          description: "Has completado todas las parejas",
        });
      }
    } else {
      // ❌ ERROR - Mostrar feedback visual
      setError(true);
      setParIncorrecto({ emocionId: emocion.id, fraseId: frase.id });
      setSeleccion(null);
      
      toast({
        title: "Incorrecto",
        description: "Las emociones no coinciden. ¡Inténtalo de nuevo!",
        variant: "destructive",
      });

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

  // ====================================================
  // RENDERIZADO
  // ====================================================
  return (
    <div className="space-y-6">
      {/* Instrucciones con datos del backend */}
      {activityData && (
        <div className="bg-gradient-to-r from-braini-blue/10 to-braini-turquoise/10 p-6 rounded-xl border border-braini-blue/20">
          {/* Duración del backend */}
          {activityData.duracion_min && activityData.duracion_max && (
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong className="text-braini-blue-dark">Duración:</strong> {activityData.duracion_min} - {activityData.duracion_max} minutos
            </p>
          )}
          {/* ¿Cómo se juega? del backend - Con formateo */}
          {activityData.como_se_juega && (
            <div className="text-gray-700 leading-relaxed">
              {formatearTexto(activityData.como_se_juega)}
            </div>
          )}
        </div>
      )}

      {/* Área de juego - Grid con altura equilibrada */}
      <div className="grid md:grid-cols-2 gap-6 items-start min-h-[600px]">
        {/* Columna izquierda: Imágenes */}
        <div className="space-y-3 h-full flex flex-col">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            Imágenes de Emociones
          </h4>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {EMOCIONES.map((emocion) => (
              <button
                key={emocion.id}
                onClick={() => handleImagenClick(emocion)}
                disabled={estaCompletada(emocion.id)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200
                  ${estaCompletada(emocion.id)
                    ? 'bg-green-50 border-green-300 opacity-75 cursor-not-allowed'
                    : parIncorrecto?.emocionId === emocion.id
                    ? 'bg-red-50 border-red-500 shadow-lg animate-shake'
                    : estaSeleccionadaImagen(emocion.id)
                    ? 'bg-blue-100 border-blue-500 shadow-lg transform scale-105'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                  }
                `}
              >
                {emocion.imagen ? (
                  <img
                    src={emocion.imagen}
                    alt={emocion.nombre}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                    onError={(e) => {
                      // Fallback si la imagen no carga
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj57ZW1vY2lvbi5ub21icmV9PC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">{emocion.nombre.charAt(0)}</span>
                  </div>
                )}
                <p className="text-sm font-medium text-gray-700">{emocion.nombre}</p>
                
                {parIncorrecto?.emocionId === emocion.id && (
                  <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1 animate-pulse">
                    <X className="w-5 h-5 text-white" />
                  </div>
                )}
                
                {estaCompletada(emocion.id) && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Columna derecha: Frases */}
        <div className="space-y-3 h-full flex flex-col">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            Frases de Reflexión
          </h4>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {FRASES.map((frase) => (
              <button
                key={frase.id}
                onClick={() => handleFraseClick(frase)}
                disabled={completadas.some(emocionId => {
                  const emocion = EMOCIONES.find(e => e.id === emocionId);
                  return emocion && emocion.fraseId === frase.id;
                })}
                className={`
                  w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${completadas.some(emocionId => {
                    const emocion = EMOCIONES.find(e => e.id === emocionId);
                    return emocion && emocion.fraseId === frase.id;
                  })
                    ? 'bg-green-50 border-green-300 opacity-75 cursor-not-allowed'
                    : parIncorrecto?.fraseId === frase.id
                    ? 'bg-red-50 border-red-500 shadow-lg animate-shake'
                    : estaSeleccionadaFrase(frase.id)
                    ? 'bg-blue-100 border-blue-500 shadow-lg transform scale-102'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                  }
                `}
              >
                <p className="text-sm text-gray-700 font-medium">{frase.texto}</p>
                
                {parIncorrecto?.fraseId === frase.id && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <X className="w-4 h-4" />
                    <span className="text-xs font-bold">Inténtalo de nuevo</span>
                  </div>
                )}
                
                {completadas.some(emocionId => {
                  const emocion = EMOCIONES.find(e => e.id === emocionId);
                  return emocion && emocion.fraseId === frase.id;
                }) && (
                  <div className="mt-2 flex items-center gap-2 text-braini-turquoise">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Completada</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progreso */}
      <div className="bg-braini-yellow/10 p-4 rounded-xl border border-braini-yellow/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-braini-yellow-dark">
              Parejas Completadas
            </p>
            <p className="text-2xl font-bold text-braini-yellow-dark">
              {completadas.length} / {EMOCIONES.length}
            </p>
          </div>
          <div className="w-full max-w-xs ml-4 bg-braini-yellow/20 rounded-full h-3">
            <div
              className="bg-braini-yellow h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completadas.length / EMOCIONES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Retroalimentación final - del backend */}
      {juegoCompletado && activityData?.retroalimentacion && (
        <div className="bg-braini-turquoise/10 p-6 rounded-xl border-2 border-braini-turquoise animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-braini-turquoise" />
            <h3 className="text-2xl font-bold text-braini-turquoise-dark">
              ¡Fantástico!
            </h3>
          </div>
            <p className="text-braini-turquoise-dark">
            {activityData.retroalimentacion}
          </p>
        </div>
      )}

    </div>
  );
};

export default Ses1Act1;

