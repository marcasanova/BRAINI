import React from 'react';

interface PuzzleProgressProps {
  progress: number;
  total: number;
  completed: number;
}

const PuzzleProgress: React.FC<PuzzleProgressProps> = ({
  progress,
  total,
  completed
}) => {
  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div 
          className="bg-gradient-to-r from-braini-blue to-braini-blue-light h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span className="font-medium">
          Progreso: {completed} de {total} emparejamientos
        </span>
        <span className="font-bold text-braini-blue">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Mensaje motivacional */}
                  {completed === 0 && (
                    <p className="text-center text-gray-500 text-sm">
                      ¡Empieza a conocer a tus amigas las emociones! 🌟
                    </p>
                  )}

                  {completed > 0 && completed < total && (
                    <p className="text-center text-braini-blue text-sm font-medium">
                      ¡Genial! Estás aprendiendo mucho sobre las emociones 🎯
                    </p>
                  )}

                  {completed === total && (
                    <p className="text-center text-green-600 text-sm font-bold">
                      ¡Increíble! Has conocido todas las emociones 🎉✨
                    </p>
                  )}
    </div>
  );
};

export default PuzzleProgress;