import React, { useState, useEffect } from 'react';
import EmotionCard from './EmotionCard';
import PhraseCard from './PhraseCard';
import PuzzleProgress from './PuzzleProgress';

interface Emotion {
  id: number;
  name: string;
  phrase: string;
  image: string;
}

interface Match {
  imageName: string;
  phrase: string;
  emotionName: string;
}

interface EmotionPuzzleProps {
  onComplete: () => void;
}

const PUZZLE_EMOTIONS: Emotion[] = [
  {
    id: 1,
    name: "Alegría",
    phrase: "Siento alegría cuando…",
    image: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/1.%20Alegria.jpg"
  },
  {
    id: 2,
    name: "Tristeza",
    phrase: "Una vez me sentí triste porque…",
    image: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/2.%20Tristeza.jpg"
  },
  {
    id: 3,
    name: "Miedo",
    phrase: "Me da miedo…",
    image: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/3.%20Miedo.jpg"
  },
  {
    id: 4,
    name: "Rabia",
    phrase: "Un día sentí mucha rabia …",
    image: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/5.%20Rabia.jpg"
  },
  {
    id: 5,
    name: "Vergüenza",
    phrase: "Tengo vergüenza cuando…",
    image: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/7.%20Vergueza.jpg"
  },
  {
    id: 6,
    name: "Sorpresa",
    phrase: "La sorpresa que más me gustó fue…",
    image: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/9.%20SOrpresa.jpg"
  },
  {
    id: 7,
    name: "Felicidad",
    phrase: "Una cosa que me hace muy feliz es…",
    image: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/13.%20Felicidad.jpg"
  },
  {
    id: 8,
    name: "Asustada",
    phrase: "Me asusta…",
    image: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/15.%20Asustado.jpg"
  },
  {
    id: 9,
    name: "Contento",
    phrase: "Me siento contento/a cuando…",
    image: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/18.%20Contento.jpg"
  },
  {
    id: 10,
    name: "Enfado",
    phrase: "Un día me enfadé porque…",
    image: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/20.%20Enfado.jpg"
  }
];

const EmotionPuzzle: React.FC<EmotionPuzzleProps> = ({ onComplete }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledEmotions, setShuffledEmotions] = useState<Emotion[]>([]);
  const [shuffledPhrases, setShuffledPhrases] = useState<Emotion[]>([]);

  // Mezclar las emociones y frases al cargar
  useEffect(() => {
    const shuffled = [...PUZZLE_EMOTIONS].sort(() => Math.random() - 0.5);
    setShuffledEmotions(shuffled);
    setShuffledPhrases([...shuffled].sort(() => Math.random() - 0.5));
  }, []);

  // Verificar si el puzzle está completo
  useEffect(() => {
    if (matches.length === PUZZLE_EMOTIONS.length) {
      setIsComplete(true);
    }
  }, [matches]);

  const handleImageSelect = (emotionName: string) => {
    if (selectedPhrase) {
      // Intentar hacer match
      const emotion = PUZZLE_EMOTIONS.find(e => e.name === emotionName);
      if (emotion && emotion.phrase === selectedPhrase) {
        // Match correcto
        const newMatch: Match = {
          imageName: emotionName,
          phrase: selectedPhrase,
          emotionName: emotionName
        };
        setMatches(prev => [...prev, newMatch]);
        setSelectedImage(null);
        setSelectedPhrase(null);
      } else {
        // Match incorrecto, deseleccionar
        setSelectedImage(null);
        setSelectedPhrase(null);
      }
    } else {
      // Seleccionar imagen
      setSelectedImage(emotionName);
    }
  };

  const handlePhraseSelect = (phrase: string) => {
    if (selectedImage) {
      // Intentar hacer match
      const emotion = PUZZLE_EMOTIONS.find(e => e.name === selectedImage);
      if (emotion && emotion.phrase === phrase) {
        // Match correcto
        const newMatch: Match = {
          imageName: selectedImage,
          phrase: phrase,
          emotionName: selectedImage
        };
        setMatches(prev => [...prev, newMatch]);
        setSelectedImage(null);
        setSelectedPhrase(null);
      } else {
        // Match incorrecto, deseleccionar
        setSelectedImage(null);
        setSelectedPhrase(null);
      }
    } else {
      // Seleccionar frase
      setSelectedPhrase(phrase);
    }
  };

  const isImageMatched = (emotionName: string) => {
    return matches.some(match => match.imageName === emotionName);
  };

  const isPhraseMatched = (phrase: string) => {
    return matches.some(match => match.phrase === phrase);
  };

  const isImageSelected = (emotionName: string) => {
    return selectedImage === emotionName;
  };

  const isPhraseSelected = (phrase: string) => {
    return selectedPhrase === phrase;
  };

  const progress = (matches.length / PUZZLE_EMOTIONS.length) * 100;

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-braini-blue mb-2 text-center">
        ¡Descubramos las Emociones! 🌟
      </h2>
      <div className="text-lg text-gray-700 mb-6 text-center space-y-2">
        <p className="font-semibold text-braini-blue">
          ¡Vamos a descubrir el nombre de nuestras amigas las emociones y a conocerlas un poco mejor!
        </p>
        <p className="text-base">
          ¡Enlaza la emoción con su nombre! 
        </p>
        <p className="text-sm text-gray-600">
          ¡Vamos allá! 🚀
        </p>
      </div>

      {/* Barra de progreso */}
      <PuzzleProgress progress={progress} total={PUZZLE_EMOTIONS.length} completed={matches.length} />

      {/* Área del puzzle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Lado izquierdo - Imágenes de emociones */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-braini-blue text-center mb-4">
            Emociones
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {shuffledEmotions.map((emotion) => (
              <EmotionCard
                key={emotion.id}
                emotion={emotion}
                isSelected={isImageSelected(emotion.name)}
                isMatched={isImageMatched(emotion.name)}
                onSelect={() => handleImageSelect(emotion.name)}
              />
            ))}
          </div>
        </div>

        {/* Lado derecho - Frases */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-braini-blue text-center mb-4">
            Frases
          </h3>
          <div className="space-y-3">
            {shuffledPhrases.map((emotion) => (
              <PhraseCard
                key={emotion.phrase}
                phrase={emotion.phrase}
                isSelected={isPhraseSelected(emotion.phrase)}
                isMatched={isPhraseMatched(emotion.phrase)}
                onSelect={() => handlePhraseSelect(emotion.phrase)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700 text-center">
          💡 <strong>Instrucciones:</strong> Haz clic en una emoción y luego en su frase correspondiente para emparejarlas.
        </p>
      </div>

      {/* Label de completado */}
      {isComplete && (
        <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <h3 className="text-xl font-bold text-green-800">
              ¡Puzzle Completado! 🎉
            </h3>
          </div>
          <p className="text-green-700 font-medium">
            Has emparejado correctamente todas las emociones. ¡Excelente trabajo!
          </p>
        </div>
      )}
    </div>
  );
};

export default EmotionPuzzle;
