import AsyncStorage from '@react-native-async-storage/async-storage';

// -------------------------------------------------------------------------
// ⚠️ ¡IMPORTANTE! ⚠️
// Reemplaza esta IP con la dirección IP de tu máquina donde corre Laravel.
// (Ej. 192.168.1.10)
// Tu servidor de Laravel debe correr en esa IP:
// php artisan serve --host=192.168.1.10
// -------------------------------------------------------------------------
export const API_URL = 'http://192.168.100.142:8000'; // <--- ¡CAMBIA ESTO! (Sin /api)

// 1. AÑADIR EXPORT
export const TOKEN_KEY = 'token'; 

/**
 * Nuestro "wrapper" de Fetch que maneja la autenticación
 * y la respuesta de la API.
 */
// 2. AÑADIR EXPORT
export async function apiFetch(endpoint: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET', body: any = null, customToken?: string | null) {
  // 1. Obtener el token guardado
  const token = customToken || await AsyncStorage.getItem(TOKEN_KEY);

  // 2. Configurar cabeceras (headers)
  const headers = new Headers();
  headers.set('Accept', 'application/json');
  
  if (body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // 3. Configurar la petición
  const config: RequestInit = {
    method: method,
    headers: headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  // 4. Hacer la llamada a la API
  // Añadimos el /api aquí
  const response = await fetch(`${API_URL}/api${endpoint}`, config);

  // 5. Manejar la respuesta
  let data;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  // 6. Manejar errores
  if (!response.ok) {
    const error: any = new Error(response.statusText || 'Error en la petición');
    error.response = {
      status: response.status,
      data: data, 
    };
    throw error;
  }

  // 7. Devolver los datos
  return data;
}