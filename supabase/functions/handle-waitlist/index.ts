import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Manejar la solicitud OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Crear el cliente de Supabase
    const supabaseClient = createClient(
      // Reemplaza con tu URL de Supabase
      Deno.env.get('SUPABASE_URL') ?? '',
      // Reemplaza con tu ANON KEY de Supabase
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Obtener los datos del cuerpo de la solicitud
    const { email } = await req.json()

    // Validar el email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return new Response(
        JSON.stringify({ error: "El email introducido no es válido." }),
        { headers: corsHeaders, status: 400 }
      );
    }

    // Insertar en la tabla waitlist
    const { data, error } = await supabaseClient
      .from('waitlist')
      .insert([{ email }])
      .select();

    if (error) {
      // Error de email duplicado (Postgres error code 23505)
      if (error.code === '23505' || (error.message && error.message.includes('duplicate key')) ) {
        return new Response(
          JSON.stringify({ error: "Este email ya está registrado en la lista de espera." }),
          { headers: corsHeaders, status: 400 }
        );
      }
      // Otros errores
      return new Response(
        JSON.stringify({ error: "Error inesperado al registrar el email. Inténtalo de nuevo más tarde." }),
        { headers: corsHeaders, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: '¡Registrado exitosamente en la lista de espera!', data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    // Si el error es un string, conviértelo a objeto
    const errorMsg = typeof error === 'string' ? error : error?.message || 'Error desconocido';
    return new Response(
      JSON.stringify({ error: errorMsg }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
})