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
    // Debug: método y headers
    console.log('[DEBUG] Método:', req.method);
    console.log('[DEBUG] Headers:', JSON.stringify([...req.headers]));
    // Crear el cliente de Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    console.log('[DEBUG] SUPABASE_URL:', supabaseUrl);
    console.log('[DEBUG] SUPABASE_ANON_KEY:', supabaseAnonKey ? 'PRESENTE' : 'NO PRESENTE');
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Obtener los datos del cuerpo de la solicitud
    let email;
    try {
      const body = await req.json();
      console.log('[DEBUG] Body recibido:', body);
      email = body.email;
    } catch (jsonError) {
      console.error('[DEBUG] Error al parsear JSON:', jsonError);
      return new Response(JSON.stringify({ error: 'No se pudo parsear el body como JSON', detalle: String(jsonError) }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    // Validar el email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      console.error('[DEBUG] Email inválido:', email);
      return new Response(JSON.stringify({ error: 'Email inválido', emailRecibido: email }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    // Insertar en la tabla waitlist
    const { data, error } = await supabaseClient
      .from('waitlist')
      .insert([{ email }])
      .select();
    console.log('[DEBUG] Resultado de inserción:', { data, error });

    if (error) {
      console.error('[DEBUG] Error al insertar en waitlist:', error);
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
    console.error('[DEBUG] Error general en catch:', error);
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