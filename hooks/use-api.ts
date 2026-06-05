"use client";

export function useApi() {
  async function apiFetch<T>(
    url: string,
    options?: RequestInit
  ): Promise<{ data?: T; error?: string }> {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Xatolik yuz berdi" };
      return { data: json.data };
    } catch {
      return { error: "Server bilan aloqa yo'q" };
    }
  }

  return { apiFetch };
}
