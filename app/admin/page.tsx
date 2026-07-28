"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";

type ContactLead = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  projectType?: string;
  budget?: string;
  message?: string;
  status: string;
  createdAt: string;
};

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [contacts, setContacts] = useState<ContactLead[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadContacts(adminKey: string) {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch("/contacts", {}, adminKey);
      setContacts(data);
      setAuthed(true);
      localStorage.setItem("varsovia_admin_key", adminKey);
    } catch (err) {
      setAuthed(false);
      setError(err instanceof Error ? err.message : "Unauthorized");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("varsovia_admin_key");
    if (saved) {
      setKey(saved);
      loadContacts(saved);
    }
  }, []);

  function onLogin(e: FormEvent) {
    e.preventDefault();
    loadContacts(key);
  }

  async function updateStatus(id: string, status: string) {
    try {
      await adminFetch(`/contacts/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }, key);
      setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  function logout() {
    localStorage.removeItem("varsovia_admin_key");
    setAuthed(false);
    setContacts([]);
  }

  return (
    <div className="min-h-screen bg-blush">
      <header className="border-b border-maroon/10 bg-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-display text-2xl tracking-[0.16em] text-maroon">VARSOVIA</p>
            <p className="text-xs tracking-[0.14em] uppercase text-muted">Admin Panel</p>
          </div>
          {authed && (
            <button type="button" onClick={logout} className="text-sm text-maroon underline-offset-4 hover:underline">
              Log out
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {!authed ? (
          <form onSubmit={onLogin} className="mx-auto max-w-md space-y-4 rounded-none bg-white p-8 shadow-sm">
            <h1 className="font-display text-3xl text-maroon">Admin Login</h1>
            <p className="text-sm text-muted">Enter the admin key from your server `.env` file.</p>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              type="password"
              placeholder="Admin key"
              className="input-field"
              required
            />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Checking..." : "Enter Dashboard"}
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl text-maroon">Contact Leads</h1>
                <p className="mt-2 text-sm text-muted">{contacts.length} submissions</p>
              </div>
              <button type="button" className="btn-primary" onClick={() => loadContacts(key)}>
                Refresh
              </button>
            </div>

            {error && <p className="mb-4 text-sm text-red-700">{error}</p>}

            <div className="overflow-x-auto bg-white shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-maroon text-white">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Message</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c._id} className="border-t border-maroon/10 align-top">
                      <td className="px-4 py-4">
                        <p className="font-medium text-ink">{c.name}</p>
                        <p className="text-xs text-muted">{new Date(c.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p>{c.phone}</p>
                        <p className="text-muted">{c.email}</p>
                        <p className="text-muted">{c.city}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p>{c.projectType || "—"}</p>
                        <p className="text-muted">{c.budget || "—"}</p>
                      </td>
                      <td className="max-w-xs px-4 py-4 text-muted">{c.message || "—"}</td>
                      <td className="px-4 py-4">
                        <select
                          value={c.status}
                          onChange={(e) => updateStatus(c._id, e.target.value)}
                          className="input-field py-2"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {!contacts.length && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-muted">
                        No contact submissions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
