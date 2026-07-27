export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchHomeData() {
  try {
    const res = await fetch(`${API_URL}/home`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("Failed to fetch home data");
    return await res.json();
  } catch {
    const { fallbackHomeData } = await import("./fallbackData");
    return fallbackHomeData;
  }
}

export async function submitContact(payload: Record<string, string>) {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Submission failed");
  return data;
}

export async function adminFetch(path: string, options: RequestInit = {}, adminKey: string) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export async function fetchBlogs() {
  try {
    const res = await fetch(`${API_URL}/blogs`, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error("Failed to fetch blogs");
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchBlogById(id: string) {
  try {
    const res = await fetch(`${API_URL}/blogs/${id}`, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error("Failed to fetch blog detail");
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchTeamMembers() {
  try {
    const res = await fetch(`${API_URL}/team`, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error("Failed to fetch team");
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchFAQs() {
  try {
    const res = await fetch(`${API_URL}/faqs`, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error("Failed to fetch FAQs");
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchCatalogues() {
  try {
    const res = await fetch(`${API_URL}/catalogues`, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error("Failed to fetch catalogues");
    return await res.json();
  } catch {
    return [];
  }
}
