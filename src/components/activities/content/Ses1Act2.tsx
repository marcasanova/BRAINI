import React from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import { Footprints, Hand } from 'lucide-react';

interface Ses1Act2Props {
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

/**
 * Actividad 2 - Sesión 1
 * Gigantes y ratones: Actividad de relajación física
 */
const Ses1Act2: React.FC<Ses1Act2Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityData
}) => {
  
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

      {/* Área principal de la actividad */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ejercicio principal: Piernas y pies */}
        <div className="bg-braini-yellow/10 p-6 rounded-xl border-2 border-braini-yellow/30">
          <div className="flex items-center gap-3 mb-4">
            <Footprints className="w-8 h-8 text-braini-yellow-dark" />
            <h3 className="text-2xl font-bold text-braini-yellow-dark">
              Ejercicio: Piernas y Pies
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Paso 1 */}
            <div className="bg-white p-4 rounded-lg border border-braini-yellow/20">
              <div className="flex items-start gap-3 mb-2">
                <span className="bg-braini-yellow text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  1
                </span>
                <h4 className="text-lg font-semibold text-braini-yellow-dark">Gigantes</h4>
              </div>
              <p className="text-gray-700 ml-11 italic">
                "Vamos a dar patadas contra el suelo todo lo fuerte que podamos… ¿escuchas los golpes de los gigantes?"
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-white p-4 rounded-lg border border-braini-yellow/20">
              <div className="flex items-start gap-3 mb-2">
                <span className="bg-braini-yellow text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  2
                </span>
                <h4 className="text-lg font-semibold text-braini-yellow-dark">Hormigas</h4>
              </div>
              <p className="text-gray-700 ml-11 italic">
                "Nuestras patadas son suaves, lentas y delicadas como sus patitas… y sus pasos casi no se oyen."
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-white p-4 rounded-lg border border-braini-yellow/20">
              <div className="flex items-start gap-3 mb-2">
                <span className="bg-braini-yellow text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  3
                </span>
                <h4 className="text-lg font-semibold text-braini-yellow-dark">Alternar</h4>
              </div>
              <p className="text-gray-700 ml-11 italic">
                "Caminamos como un gigante… ahora como una hormiga."
              </p>
            </div>
          </div>

          <div className="mt-4 bg-braini-yellow/20 p-3 rounded-lg border border-braini-yellow/30">
            <p className="text-sm font-semibold text-braini-yellow-dark">
              💡 Realiza varias repeticiones
            </p>
          </div>
        </div>

        {/* Variante: Brazos y manos */}
        <div className="bg-braini-pink/10 p-6 rounded-xl border-2 border-braini-pink/30">
          <div className="flex items-center gap-3 mb-4">
            <Hand className="w-8 h-8 text-braini-pink-dark" />
            <h3 className="text-2xl font-bold text-braini-pink-dark">
              Variante: Brazos y Manos
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Paso 1 */}
            <div className="bg-white p-4 rounded-lg border border-braini-pink/20">
              <div className="flex items-start gap-3 mb-2">
                <span className="bg-braini-pink text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  1
                </span>
                <h4 className="text-lg font-semibold text-braini-pink-dark">Gigantes</h4>
              </div>
              <p className="text-gray-700 ml-11 italic">
                Palmadas de gigante, ¡fuertes!
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-white p-4 rounded-lg border border-braini-pink/20">
              <div className="flex items-start gap-3 mb-2">
                <span className="bg-braini-pink text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  2
                </span>
                <h4 className="text-lg font-semibold text-braini-pink-dark">Hormiguitas</h4>
              </div>
              <p className="text-gray-700 ml-11 italic">
                Palmadas flojitas como de hormiguitas
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-white p-4 rounded-lg border border-braini-pink/20">
              <div className="flex items-start gap-3 mb-2">
                <span className="bg-braini-pink text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  3
                </span>
                <h4 className="text-lg font-semibold text-braini-pink-dark">Alternar</h4>
              </div>
              <p className="text-gray-700 ml-11 italic">
                Cambiar entre gigante y hormiguita varias veces
              </p>
            </div>
          </div>

          <div className="mt-4 bg-braini-pink/20 p-3 rounded-lg border border-braini-pink/30">
            <p className="text-sm font-semibold text-braini-pink-dark">
              💡 ¡Repite varias veces!
            </p>
          </div>
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className="bg-braini-yellow/10 p-6 rounded-xl border-2 border-braini-yellow/30">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🤗</span>
          <div>
            <h4 className="text-lg font-bold text-braini-yellow-dark mb-1">
              ¡Disfruta de la relajación!
            </h4>
            <p className="text-gray-700">
              Esta actividad ayuda a relajar los músculos y liberar tensión. ¡Diviértete alternando entre ser un gigante y una hormiguita!
            </p>
          </div>
        </div>
      </div>

      {/* Retroalimentación - del backend */}
      {activityData?.retroalimentacion && (
        <div className="bg-braini-turquoise/10 p-6 rounded-xl border-2 border-braini-turquoise">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">✨</span>
            <h3 className="text-2xl font-bold text-braini-turquoise-dark">
              ¡GENIAL!
            </h3>
          </div>
          <p className="text-braini-turquoise-dark text-lg font-semibold">
            {activityData.retroalimentacion}
          </p>
        </div>
      )}
    </div>
  );
};

export default Ses1Act2;
