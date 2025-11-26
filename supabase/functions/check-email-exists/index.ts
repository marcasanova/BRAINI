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

    // 3. Normalizamos el email: convertimos a minúsculas y eliminamos espacios en blanco
    const normalizedEmail = email ? email.trim().toLowerCase() : ''

    // 4. Validamos que el email exista y no esté vacío después de normalizar
    if (!normalizedEmail) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400, // Bad Request - error de validación del cliente
      })
    }

    // 5. Creamos un cliente de Supabase estándar. Solo necesita la URL y la clave anónima (pública).
    // Es seguro porque la lógica de permisos ya la hemos definido en la base de datos.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // 6. Hacemos una llamada a un Procedimiento Remoto (RPC) para ejecutar nuestra función de PostgreSQL.
    const { data, error } = await supabaseClient.rpc('email_exists', {
      p_email: normalizedEmail,
    })

    if (error) {
      // Si la llamada RPC falla por algún motivo (ej. la función no existe), lanzamos el error.
      throw error
    }

    // 7. El `data` que devuelve la RPC es directamente el booleano (true/false) de nuestra función SQL.
    // Lo enviamos de vuelta al frontend en un objeto JSON.
    return new Response(JSON.stringify({ exists: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (err) {
    // 8. Si algo falla en cualquier punto (errores del servidor, JSON mal formado, errores de BD), 
    // capturamos el error aquí y devolvemos un 500.
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Error checking email:', errorMessage)
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Internal Server Error - error del servidor
    })
  }
}) 