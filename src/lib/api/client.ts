// This file can be used to set up an API client like axios or a custom fetch wrapper.
// For now, it's a placeholder.

// Example with a custom fetch wrapper:
async function customFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${getAuthToken()}` // Example for adding auth token
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    // Enhanced error handling
    const errorBody = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorBody.message || 'API request failed');
  }

  return response.json() as Promise<T>;
}

export default customFetch;
