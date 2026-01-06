const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  // Get token safely (browser only)
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "API error");
  }

  return res.json();
}
