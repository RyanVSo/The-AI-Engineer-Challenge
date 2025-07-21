"use client";
import React, { useState } from "react";
import { streamChat } from "../src/utils/api";

export default function ChatPage() {
  const [apiKey, setApiKey] = useState("");
  const [developerMessage, setDeveloperMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse("");
    setError(null);
    setLoading(true);
    try {
      await streamChat(
        {
          developer_message: developerMessage,
          user_message: userMessage,
          api_key: apiKey,
        },
        (chunk) => setResponse((prev) => prev + chunk)
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f6fa" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", minWidth: 350, maxWidth: 400, width: "100%" }}>
        <h2 style={{ marginBottom: 24, color: "#222" }}>AI Chat Interface</h2>
        <label style={{ display: "block", marginBottom: 8, color: "#333" }}>
          OpenAI API Key
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
            placeholder="sk-..."
          />
        </label>
        <label style={{ display: "block", marginBottom: 8, color: "#333" }}>
          Developer Message
          <input
            type="text"
            value={developerMessage}
            onChange={(e) => setDeveloperMessage(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
            placeholder="System prompt or context"
          />
        </label>
        <label style={{ display: "block", marginBottom: 8, color: "#333" }}>
          User Message
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
            placeholder="Your message to the AI"
          />
        </label>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, borderRadius: 6, background: "#4f8cff", color: "#fff", border: "none", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Sending..." : "Send"}
        </button>
        {error && <div style={{ color: "#d32f2f", marginTop: 12 }}>{error}</div>}
        <div style={{ marginTop: 24, background: "#f0f4fa", borderRadius: 8, padding: 16, minHeight: 80, color: "#222", wordBreak: "break-word" }}>
          {response || (loading ? "Waiting for response..." : "Response will appear here.")}
        </div>
      </form>
    </main>
  );
}
