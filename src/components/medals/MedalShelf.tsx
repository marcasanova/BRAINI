import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star } from 'lucide-react';
import MedalGrid from './MedalGrid';

interface UserMedal {
  id: number;
  user_id: string;
  medal_id: number;
  fecha_obtencion: string;
}

interface MedalShelfProps {
  userMedals: UserMedal[];
  isLoading: boolean;
}

const MedalShelf: React.FC<MedalShelfProps> = ({ userMedals, isLoading }) => {
  // Crear array de 10 posiciones con información de medallas
  const createMedalArray = () => {
    const medalArray: Array<{
      levelNumber: number;
      isEarned: boolean;
      earnedAt?: string;
    } | null> = [];
    
    // Crear array de 10 posiciones
    for (let i = 1; i <= 10; i++) {
      // Buscar si el usuario tiene la medalla para este nivel
      const userMedal = userMedals.find(um => um.medal_id === i);
      
      if (userMedal) {
        medalArray.push({
          levelNumber: i,
          isEarned: true,
          earnedAt: userMedal.fecha_obtencion
        });
      } else {
        medalArray.push({
          levelNumber: i,
          isEarned: false
        });
      }
    }
    
    return medalArray;
  };

  const medalArray = createMedalArray();
  const earnedMedals = userMedals.length;
  const totalMedals = 10;
  const progressPercentage = (earnedMedals / totalMedals) * 100;

  const handleMedalClick = (levelNumber: number) => {
    // Aquí puedes agregar la lógica para navegar al nivel o mostrar más información
  };

  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            Mis Medallas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-gray-500">
              <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              Cargando medallas...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          Mis Medallas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Estadísticas */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{earnedMedals}</p>
              <p className="text-sm text-gray-600">de {totalMedals} medallas</p>
            </div>
          </div>
          
          <div className="flex-1 sm:ml-8 max-w-xs">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progreso</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Grid de medallas */}
        <MedalGrid 
          medals={medalArray} 
          onMedalClick={handleMedalClick}
        />

        {/* Mensaje motivacional */}
        {earnedMedals < totalMedals && (
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-800 font-medium">
              ¡Continúa completando niveles para llenar tu estantería de medallas! 🚀
            </p>
            <p className="text-blue-600 text-sm mt-1">
              Te faltan {totalMedals - earnedMedals} medallas para completar todos los niveles
            </p>
          </div>
        )}

        {earnedMedals === totalMedals && (
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-800 font-medium">
              🎉 ¡Felicidades! Has completado todos los niveles y conseguido todas las medallas
            </p>
            <p className="text-green-600 text-sm mt-1">
              Eres un experto en inteligencia emocional
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedalShelf;
