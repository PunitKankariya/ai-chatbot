const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function sendMessage(message) {
    const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error("Backend error");
    return res.json();
}
