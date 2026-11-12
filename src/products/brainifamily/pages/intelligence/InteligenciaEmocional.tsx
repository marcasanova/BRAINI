import React from 'react';
import { Link } from 'react-router';
import { Clock } from 'lucide-react';
import Backgrounds from '@/shared/components/Backgrounds';

const TMMS_FACTS = [
  { label: 'Duración', value: '15–20 minutos' },
  { label: 'Preguntas', value: '24, con una escala del 1 al 5' },
  { label: 'Resultado', value: 'Tu perfil y recomendaciones para el día a día' },
];

const UNIVERSITIES = [
  { name: 'Universidad de Cádiz', logo: '/unis/logo_cadiz.png' },
  { name: 'Universidad de Alicante', logo: '/unis/logo_alicante.png' },
];

const InteligenciaEmocional = () => {
  return (
    <Backgrounds
      wrapWithCard
      tone="yellow"
      title="Evaluar y crecer"
      subtitle="Tests para conocer mejor tu inteligencia emocional y la de tu hijo o hija."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 items-start">
        {/* Protagonista: el test disponible */}
        <section aria-labelledby="tmms-title" className="bg-white rounded-2xl shadow-surface p-5 sm:p-7">
          <h2 id="tmms-title" className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Test TMMS-24 para padres
          </h2>
          <p className="mt-2 text-base text-ink/80 max-w-prose">
            24 preguntas sobre cómo percibes, comprendes y regulas tus emociones. Al terminar verás tu perfil en
            cada una de las tres áreas.
          </p>

          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TMMS_FACTS.map((fact) => (
              <div key={fact.label} className="rounded-xl bg-braini-yellow-tint px-4 py-3">
                <dt className="text-sm text-ink/70">{fact.label}</dt>
                <dd className="mt-0.5 font-semibold text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <Link
            to="/brainifamily/test-tmms-padres"
            className="mt-7 inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-braini-yellow px-8 py-3 text-base font-semibold text-ink transition-colors hover:bg-braini-yellow-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Empezar el test
          </Link>
        </section>

        <div className="space-y-6">
          {/* El test infantil aún no está disponible: se anuncia, no se enlaza */}
          <section aria-labelledby="ninos-title" className="bg-white rounded-2xl shadow-surface p-5 sm:p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1 text-sm font-medium text-ink">
              <Clock className="w-4 h-4" aria-hidden="true" />
              Próximamente
            </span>
            <h2 id="ninos-title" className="mt-3 font-display text-xl font-semibold text-ink">
              Test emocional para niños
            </h2>
            <p className="mt-1.5 text-base text-ink/80">
              Una versión adaptada para niños y niñas de 3 a 7 años, para hacer juntos en 10–15 minutos.
            </p>
          </section>

          <section aria-labelledby="aval-title" className="rounded-2xl bg-white/60 p-5 sm:p-6">
            <h2 id="aval-title" className="font-display text-lg font-semibold text-ink">
              Con el respaldo de la universidad
            </h2>
            <p className="mt-1.5 text-base text-ink/80">
              Los tests se han elaborado y revisado con investigadores de dos universidades españolas.
            </p>
            <ul className="mt-4 space-y-3">
              {UNIVERSITIES.map((uni) => (
                <li key={uni.name} className="flex items-center gap-3">
                  <span className="w-12 h-12 shrink-0 rounded-xl bg-white p-1.5 flex items-center justify-center">
                    <img src={uni.logo} alt="" className="max-w-full max-h-full object-contain" />
                  </span>
                  <span className="text-base font-medium text-ink">{uni.name}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Backgrounds>
  );
};

export default InteligenciaEmocional;
