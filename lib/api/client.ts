const BASE_URL = 'https://pokeapi.co/api/v2';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public url: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json() as Promise<T>;
}
