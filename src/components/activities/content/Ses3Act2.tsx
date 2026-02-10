import React, { useState } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { Play, ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import ActivityInstructions from '@/components/activities/utils/ActivityInstructions';
import SciBasePopup from '@/components/activities/utils/SciBasePopup';
import { NUBE_IMAGE_URL, SOL_IMAGE_URL } from '@/constants/actividadesInfantilStorage';
import {
  getPrimaryButtonClasses,
  getMainTitleTextClasses,
  getBorderClasses,
  getLightBgClasses,
  getProgressBarColor,
} from '@/components/activities/utils/ActivityColors';

interface Ses3Act2Props {
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

interface Situacion {
  id: number;
  titulo: string;
  situacionTexto: string;
  respuestaCorrecta: 'nube' | 'sol';
  pensamientosAyuda: string[];
}

const SITUACIONES: Situacion[] = [
  {
    id: 1,
    titulo: 'NO TOCA JUGAR',
    situacionTexto: 'Quiero jugar, pero tengo que terminar de comer. Me enfado y mi cuerpo se siente mal.',
    respuestaCorrecta: 'nube',
    pensamientosAyuda: [
      'Ahora toca comer.',
      'Después podré jugar.',
      'Puedo esperar un poquito.',
      'Respiro… y espero un poco más.',
    ],
  },
  {
    id: 2,
    titulo: 'AL PARQUE OTRO DÍA SÍ',
    situacionTexto: 'Hoy no voy al parque, pero sé que otro día iré. Mi cuerpo se siente bien.',
    respuestaCorrecta: 'sol',
    pensamientosAyuda: [
      'Hoy no vamos al parque.',
      'Otro día sí.',
      'Ahora puedo jugar aquí.',
      'Respiro…',
    ],
  },
  {
    id: 3,
    titulo: 'A RECOGER',
    situacionTexto: 'Estoy jugando y ya toca recoger. No quiero y me enfado. Mi cuerpo se siente mal.',
    respuestaCorrecta: 'nube',
    pensamientosAyuda: [
      'Ahora toca recoger.',
      'Después podré jugar otra vez.',
      'Recojo.',
      'Respiro… hasta que todo esté en su lugar.',
    ],
  },
  {
    id: 4,
    titulo: 'VESTIRSE TRANQUILO/A',
    situacionTexto: 'Me tengo que vestir para ir al colegio. Mi cuerpo está tranquilo, me visto yo solo y si no puedo, pido que me ayuden.',
    respuestaCorrecta: 'sol',
    pensamientosAyuda: [
      'Ahora toca vestirse.',
      'Me visto.',
      'Respiro… y así me visto super bien.',
    ],
  },
];

type Pantalla = 'inicio' | 'situacion';

/**
 * Actividad 2 - Sesión 3
 * La nube y el sol: ¿Dónde se pondrá este pensamiento? Nube o Sol
 */
const Ses3Act2: React.FC<Ses3Act2Props> = ({
  userProgress,
  activityId,
  levelId,
  userId,
  activityType,
  activityData,
  onPuzzleComplete,
}) => {
  const [pantalla, setPantalla] = useState<Pantalla>('inicio');
  const [indiceSituacion, setIndiceSituacion] = useState(0);
  const [haElegido, setHaElegido] = useState(false);
  const [eleccion, setEleccion] = useState<'nube' | 'sol' | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  const situacionActual = SITUACIONES[indiceSituacion];
  const esUltimaSituacion = indiceSituacion === SITUACIONES.length - 1;

  const handleEmpezarReto = () => {
    setPantalla('situacion');
    setIndiceSituacion(0);
    setHaElegido(false);
    setEleccion(null);
  };

  const handleElegirNubeOSol = (opcion: 'nube' | 'sol') => {
    setEleccion(opcion);
    setHaElegido(true);
  };

  const handleSiguiente = () => {
    if (esUltimaSituacion) {
      setShowSuccessPopup(true);
    } else {
      setIndiceSituacion((i) => i + 1);
      setHaElegido(false);
      setEleccion(null);
    }
  };

  const handleCerrarPopup = () => {
    setShowSuccessPopup(false);
    setPantalla('inicio');
    setIndiceSituacion(0);
    setHaElegido(false);
    setEleccion(null);
  };

  return (
    <div className="space-y-6">
      <ActivityInstructions
        activityType={activityType}
        duracionMin={activityData?.duracion_min}
        duracionMax={activityData?.duracion_max}
        comoSeJuega={activityData?.como_se_juega}
        investigacionBeneficios={activityData?.investigacion_beneficios}
        onShowScientificBase={() => setShowScientificBase(true)}
      />

      <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
        {/* Pantalla inicial (Nube y Sol como en Gigante/Ratón de Ses1Act2) */}
        {pantalla === 'inicio' && (
          <div className="min-h-[350px] flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5">
                {/* Izquierda: Imagen Nube */}
                <div className="flex flex-col items-center shrink-0">
                  <img
                    src={NUBE_IMAGE_URL}
                    alt="Nube"
                    className="h-40 sm:h-52 md:h-56 w-auto object-contain drop-shadow-md block"
                  />
                  <span className={`text-sm font-bold -mt-1 leading-tight ${getMainTitleTextClasses(activityType)}`}>Nube</span>
                </div>

                {/* Centro: Texto y botón */}
                <div className="flex-1 text-center">
                  <h2 className={`text-3xl font-black ${getMainTitleTextClasses(activityType)} mb-4`}>
                    ¡Prepárate!
                  </h2>
                  <p className="text-xl text-gray-700 mb-8">
                    Algunos pensamientos son como una nube gris… otros como un sol.
                    <br />
                    <strong>¡Vamos a aprender y descubrir juntos más sobre ellos!</strong>
                  </p>
                  <Button
                    onClick={handleEmpezarReto}
                    className={getPrimaryButtonClasses(activityType)}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Empezar Reto
                  </Button>
                </div>

                {/* Derecha: Imagen Sol */}
                <div className="flex flex-col items-center shrink-0">
                  <img
                    src={SOL_IMAGE_URL}
                    alt="Sol"
                    className="h-40 sm:h-52 md:h-56 w-auto object-contain drop-shadow-md block"
                  />
                  <span className={`text-sm font-bold -mt-1 leading-tight ${getMainTitleTextClasses(activityType)}`}>Sol</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pantalla de situación */}
        {pantalla === 'situacion' && situacionActual && (
          <div className="space-y-6">
            {/* Indicador de progreso */}
            <p className="text-sm font-medium text-gray-500">
              Situación {indiceSituacion + 1} de {SITUACIONES.length}
            </p>

            {/* Título de la situación */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {situacionActual.titulo}
            </h2>

            {/* Situación: texto normal, sin recuadro */}
            <div>
              <h3 className="text-lg font-semibold text-black uppercase tracking-wide mb-2">
                Situación
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {situacionActual.situacionTexto}
              </p>
            </div>

            {/* Nube y Sol debajo de la situación (solo antes de elegir) */}
            {!haElegido && (
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-3">
                  ¿Dónde se pondrá este pensamiento?
                </p>
                <div className="flex flex-row gap-4 justify-start flex-wrap">
                  <button
                    type="button"
                    onClick={() => !haElegido && handleElegirNubeOSol('nube')}
                    disabled={haElegido}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 min-w-[130px] transition-all ${
                      !haElegido
                        ? 'border-gray-300 hover:border-gray-500 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'
                        : situacionActual.respuestaCorrecta === 'nube'
                          ? `${getLightBgClasses(activityType)} ${getBorderClasses(activityType)} cursor-default`
                          : eleccion === 'nube'
                            ? 'border-red-500 bg-red-50 cursor-default'
                            : 'border-gray-300 bg-gray-50/50 cursor-default'
                    }`}
                  >
                    {haElegido && situacionActual.respuestaCorrecta === 'nube' && (
                      <span
                        className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/80 shadow-sm"
                        style={{ backgroundColor: getProgressBarColor(activityType) }}
                      >
                        <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                      </span>
                    )}
                    {haElegido && eleccion === 'nube' && situacionActual.respuestaCorrecta !== 'nube' && (
                      <span className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-red-500 bg-red-500">
                        <X className="h-3.5 w-3.5 text-white stroke-[3]" />
                      </span>
                    )}
                    <img
                      src={NUBE_IMAGE_URL}
                      alt="Nube - Pensamientos limitantes"
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-2"
                    />
                    <span className={`text-xs font-semibold ${
                      !haElegido ? 'text-gray-700' :
                      situacionActual.respuestaCorrecta === 'nube' ? getMainTitleTextClasses(activityType) :
                      eleccion === 'nube' ? 'text-red-700' : 'text-gray-500'
                    }`}>
                      Nube
                    </span>
                    <span className={`text-[10px] mt-0.5 ${
                      !haElegido ? 'text-gray-500' :
                      situacionActual.respuestaCorrecta === 'nube' ? getMainTitleTextClasses(activityType) :
                      eleccion === 'nube' ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      Pensamientos limitantes
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => !haElegido && handleElegirNubeOSol('sol')}
                    disabled={haElegido}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 min-w-[130px] transition-all ${
                      !haElegido
                        ? 'border-yellow-400 hover:border-yellow-600 hover:bg-yellow-50/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2'
                        : situacionActual.respuestaCorrecta === 'sol'
                          ? `${getLightBgClasses(activityType)} ${getBorderClasses(activityType)} cursor-default`
                          : eleccion === 'sol'
                            ? 'border-red-500 bg-red-50 cursor-default'
                            : 'border-yellow-200 bg-yellow-50/30 cursor-default'
                    }`}
                  >
                    {haElegido && situacionActual.respuestaCorrecta === 'sol' && (
                      <span
                        className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/80 shadow-sm"
                        style={{ backgroundColor: getProgressBarColor(activityType) }}
                      >
                        <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                      </span>
                    )}
                    {haElegido && eleccion === 'sol' && situacionActual.respuestaCorrecta !== 'sol' && (
                      <span className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-red-500 bg-red-500">
                        <X className="h-3.5 w-3.5 text-white stroke-[3]" />
                      </span>
                    )}
                    <img
                      src={SOL_IMAGE_URL}
                      alt="Sol - Pensamientos potenciadores"
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-2"
                    />
                    <span className={`text-xs font-semibold ${
                      !haElegido ? 'text-yellow-700' :
                      situacionActual.respuestaCorrecta === 'sol' ? getMainTitleTextClasses(activityType) :
                      eleccion === 'sol' ? 'text-red-700' : 'text-yellow-600'
                    }`}>
                      Sol
                    </span>
                    <span className={`text-[10px] mt-0.5 ${
                      !haElegido ? 'text-yellow-600' :
                      situacionActual.respuestaCorrecta === 'sol' ? getMainTitleTextClasses(activityType) :
                      eleccion === 'sol' ? 'text-red-600' : 'text-yellow-500'
                    }`}>
                      Pensamientos potenciadores
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Tras elegir: ¿Dónde se pondrá? (no desaparece) + títulos alineados + Nube | Sol | Pensamientos */}
            {haElegido && (
              <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-4 gap-y-4 items-start">
                {/* Columna izquierda: título + Nube y Sol (ancho solo el contenido) */}
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-gray-700 mb-3">
                    ¿Dónde se pondrá este pensamiento?
                  </p>
                  <div className="flex flex-row gap-4 justify-start flex-wrap">
                  <button
                    type="button"
                    disabled
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 min-w-[130px] transition-all ${
                      situacionActual.respuestaCorrecta === 'nube'
                        ? `${getLightBgClasses(activityType)} ${getBorderClasses(activityType)} cursor-default`
                        : eleccion === 'nube'
                          ? 'border-red-500 bg-red-50 cursor-default'
                          : 'border-gray-300 bg-gray-50/50 cursor-default'
                    }`}
                  >
                    {situacionActual.respuestaCorrecta === 'nube' && (
                      <span
                        className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/80 shadow-sm"
                        style={{ backgroundColor: getProgressBarColor(activityType) }}
                      >
                        <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                      </span>
                    )}
                    {eleccion === 'nube' && situacionActual.respuestaCorrecta !== 'nube' && (
                      <span className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-red-500 bg-red-500">
                        <X className="h-3.5 w-3.5 text-white stroke-[3]" />
                      </span>
                    )}
                    <img src={NUBE_IMAGE_URL} alt="Nube" className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-2" />
                    <span className={`text-xs font-semibold ${situacionActual.respuestaCorrecta === 'nube' ? getMainTitleTextClasses(activityType) : eleccion === 'nube' ? 'text-red-700' : 'text-gray-500'}`}>Nube</span>
                    <span className={`text-[10px] mt-0.5 ${situacionActual.respuestaCorrecta === 'nube' ? getMainTitleTextClasses(activityType) : eleccion === 'nube' ? 'text-red-600' : 'text-gray-400'}`}>Pensamientos limitantes</span>
                  </button>
                  <button
                    type="button"
                    disabled
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 min-w-[130px] transition-all ${
                      situacionActual.respuestaCorrecta === 'sol'
                        ? `${getLightBgClasses(activityType)} ${getBorderClasses(activityType)} cursor-default`
                        : eleccion === 'sol'
                          ? 'border-red-500 bg-red-50 cursor-default'
                          : 'border-yellow-200 bg-yellow-50/30 cursor-default'
                    }`}
                  >
                    {situacionActual.respuestaCorrecta === 'sol' && (
                      <span
                        className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/80 shadow-sm"
                        style={{ backgroundColor: getProgressBarColor(activityType) }}
                      >
                        <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                      </span>
                    )}
                    {eleccion === 'sol' && situacionActual.respuestaCorrecta !== 'sol' && (
                      <span className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-red-500 bg-red-500">
                        <X className="h-3.5 w-3.5 text-white stroke-[3]" />
                      </span>
                    )}
                    <img src={SOL_IMAGE_URL} alt="Sol" className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-2" />
                    <span className={`text-xs font-semibold ${situacionActual.respuestaCorrecta === 'sol' ? getMainTitleTextClasses(activityType) : eleccion === 'sol' ? 'text-red-700' : 'text-yellow-600'}`}>Sol</span>
                    <span className={`text-[10px] mt-0.5 ${situacionActual.respuestaCorrecta === 'sol' ? getMainTitleTextClasses(activityType) : eleccion === 'sol' ? 'text-red-600' : 'text-yellow-500'}`}>Pensamientos potenciadores</span>
                  </button>
                  </div>
                </div>
                {/* Columna derecha: título fuera del recuadro + recuadro con el grid (pegado a la izquierda) */}
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-yellow-800 mb-3">
                    Pensamientos que pueden ayudar
                  </p>
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border-2 border-yellow-400">
                  <div className="grid grid-cols-2 gap-3">
                    {situacionActual.pensamientosAyuda.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-yellow-600 font-bold shrink-0">•</span>
                        <span className="text-sm">{p}</span>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              </div>
            )}

            {haElegido && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleSiguiente}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  {esUltimaSituacion ? (
                    'Terminar reto'
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {showSuccessPopup && (
        <SuccessPopup
          onClose={handleCerrarPopup}
          activityType={activityType}
        />
      )}

      <SciBasePopup
        open={showScientificBase}
        onOpenChange={setShowScientificBase}
        activityType={activityType}
        investigacionBeneficios={activityData?.investigacion_beneficios}
      />
    </div>
  );
};

export default Ses3Act2;
