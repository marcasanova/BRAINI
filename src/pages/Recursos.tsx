import React from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  ExternalLink, 
  Heart, 
  Brain, 
  Users, 
  Lightbulb,
  Star
} from 'lucide-react';

const Recursos = () => {
  const recursos = [
    {
      categoria: 'Guías y Manuales',
      items: [
        {
          titulo: 'Guía de Inteligencia Emocional para Padres',
          descripcion: 'Manual completo con técnicas y ejercicios para desarrollar la IE en niños',
          tipo: 'PDF',
          icono: FileText,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          descargable: true
        },
        {
          titulo: 'Manual de Actividades Emocionales',
          descripcion: 'Colección de 50+ actividades prácticas para hacer en casa',
          tipo: 'PDF',
          icono: BookOpen,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          descargable: true
        }
      ]
    },
    {
      categoria: 'Videos Educativos',
      items: [
        {
          titulo: 'Serie: "Emociones en Familia"',
          descripcion: '10 episodios sobre cómo manejar emociones difíciles',
          tipo: 'Video',
          icono: Video,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          descargable: false
        },
        {
          titulo: 'Técnicas de Respiración para Niños',
          descripcion: 'Videos cortos enseñando ejercicios de relajación',
          tipo: 'Video',
          icono: Video,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          descargable: false
        }
      ]
    },
    {
      categoria: 'Investigaciones y Estudios',
      items: [
        {
          titulo: 'Estudio: Impacto de la IE en el Rendimiento Escolar',
          descripcion: 'Investigación sobre cómo la inteligencia emocional mejora el aprendizaje',
          tipo: 'Investigación',
          icono: Brain,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          descargable: true
        },
        {
          titulo: 'Meta-análisis: Programas de IE en Educación',
          descripcion: 'Revisión de 25 estudios sobre programas de inteligencia emocional',
          tipo: 'Investigación',
          icono: Star,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          descargable: true
        }
      ]
    },
    {
      categoria: 'Herramientas Interactivas',
      items: [
        {
          titulo: 'Evaluador de Inteligencia Emocional',
          descripcion: 'Test online para evaluar el nivel de IE de tu hijo/a',
          tipo: 'Herramienta',
          icono: Users,
          color: 'text-pink-600',
          bgColor: 'bg-pink-50',
          descargable: false
        },
        {
          titulo: 'Generador de Actividades Personalizadas',
          descripcion: 'Crea actividades basadas en la edad y necesidades de tu hijo/a',
          tipo: 'Herramienta',
          icono: Lightbulb,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50',
          descargable: false
        }
      ]
    }
  ];

  const handleDownload = (recurso: any) => {
    // Aquí iría la lógica de descarga
    console.log('Descargando:', recurso.titulo);
  };

  const handleView = (recurso: any) => {
    // Aquí iría la lógica para ver el recurso
    console.log('Viendo:', recurso.titulo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:pl-80 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-braini-blue to-braini-blue-light rounded-full flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="text-braini-blue">Recursos Adicionales</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Materiales de apoyo, investigaciones y herramientas para complementar tu viaje en BRAINI
            </p>
          </div>

          {/* Recursos por Categoría */}
          <div className="space-y-8">
            {recursos.map((categoria, index) => (
              <div key={categoria.categoria} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-braini-blue to-braini-blue-light rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  {categoria.categoria}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoria.items.map((recurso, itemIndex) => {
                    const Icon = recurso.icono;
                    return (
                      <Card 
                        key={itemIndex} 
                        className="bg-white/95 backdrop-blur-lg shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 ${recurso.bgColor} rounded-xl flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${recurso.color}`} />
                              </div>
                              <div>
                                <CardTitle className="text-lg text-gray-800 mb-1">
                                  {recurso.titulo}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${recurso.bgColor} ${recurso.color}`}>
                                    {recurso.tipo}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {recurso.descripcion}
                          </p>
                          
                          <div className="flex gap-3">
                            {recurso.descargable ? (
                              <Button
                                onClick={() => handleDownload(recurso)}
                                className="flex-1 bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Descargar
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleView(recurso)}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Ver Recurso
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sección de Próximamente */}
          <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Card className="bg-gradient-to-r from-braini-blue/5 to-braini-pink/5 border-2 border-dashed border-braini-blue/30 p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Lightbulb className="w-8 h-8 text-braini-blue" />
                <h3 className="text-2xl font-bold text-braini-blue">Más Recursos Próximamente</h3>
              </div>
              <p className="text-gray-600 text-lg mb-6">
                Estamos trabajando constantemente para agregar más materiales de apoyo, 
                investigaciones actualizadas y herramientas interactivas.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Nuevos contenidos semanalmente
                </span>
                <span className="flex items-center gap-1">
                  <Brain className="w-4 h-4 text-braini-blue" />
                  Basado en investigaciones científicas
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-green-500" />
                  Validado por expertos
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recursos;
