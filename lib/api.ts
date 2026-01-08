// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function apiRequest(
//   endpoint: string,
//   options: RequestInit = {}
// ) {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     ...options,
//   });

//   const raw = await res.text(); // read ONCE

//   if (!res.ok) {
//     let message = "API Error";

//     try {
//       const errorData = JSON.parse(raw);
//       message = errorData.message ?? message;
//     } catch {
//       console.error("Non-JSON error response:", raw);
//     }

//     throw new Error(message);
//   }

//   // success response
//   return raw ? JSON.parse(raw) : null;
// }


const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  // 1. Get the token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 2. Prepare headers with the Authorization token
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // Inject token if it exists
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const raw = await res.text();

  if (!res.ok) {
    // 3. Handle Unauthorized (401) specifically
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Force redirect if token is invalid/expired
    }

    let message = "API Error";
    try {
      const errorData = JSON.parse(raw);
      message = errorData.message ?? message;
    } catch {
      console.error("Non-JSON error response:", raw);
    }

    throw new Error(message);
  }

  return raw ? JSON.parse(raw) : null;
}