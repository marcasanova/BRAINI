import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Headers para CORS, permiten que tu frontend llame a esta función
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // 1. Manejo de la petición "pre-vuelo" de CORS. Es un requisito de seguridad de los navegadores.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Extraemos el email del cuerpo de la petición que nos envía el frontend.
    const { email } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    // 3. Creamos un cliente de Supabase estándar. Solo necesita la URL y la clave anónima (pública).
    // Es seguro porque la lógica de permisos ya la hemos definido en la base de datos.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // 4. Hacemos una llamada a un Procedimiento Remoto (RPC) para ejecutar nuestra función de PostgreSQL.
    const { data, error } = await supabaseClient.rpc('email_exists', {
      p_email: email,
    })

    if (error) {
      // Si la llamada RPC falla por algún motivo (ej. la función no existe), lanzamos el error.
      throw error
    }

    // 5. El `data` que devuelve la RPC es directamente el booleano (true/false) de nuestra función SQL.
    // Lo enviamos de vuelta al frontend en un objeto JSON.
    return new Response(JSON.stringify({ exists: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (err) {
    // 6. Si algo falla en cualquier punto (ej. el JSON está mal formado), capturamos el error aquí.
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Error checking email:', errorMessage)
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}) 