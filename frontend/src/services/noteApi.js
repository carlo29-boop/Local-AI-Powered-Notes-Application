
const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Something went wrong");
  }

  return response.json();
}

export const noteApi = {
  getAll: () => request("/notes/"),

  create: (data) =>
    request("/notes/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  analyze: (id) => request(`/notes/${id}/analyze`),
};
