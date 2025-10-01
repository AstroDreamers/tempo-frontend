const API_BASE = process.env.REACT_APP_API_BASE;

export async function askChat(message) {
  const response = await fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });
  if (!response.ok) {
    throw new Error("Chatbot API request failed");
  }
  return await response.json();
}
// src/api/ai.js

export async function askWithData(requestBody) {
  const response = await fetch(`${API_BASE}/ai/ask-with-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    throw new Error("AI API request failed");
  }
  return await response.json();
}
