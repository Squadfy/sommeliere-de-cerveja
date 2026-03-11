const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

interface LambdaResponse {
  statusCode: number
  headers: typeof CORS_HEADERS
  body: string
}

export function ok<T>(data: T): LambdaResponse {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ data }),
  }
}

export function notFound(message: string): LambdaResponse {
  return {
    statusCode: 404,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: message }),
  }
}

export function badRequest(message: string): LambdaResponse {
  return {
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: message }),
  }
}

export function error(message: string): LambdaResponse {
  return {
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: message }),
  }
}
