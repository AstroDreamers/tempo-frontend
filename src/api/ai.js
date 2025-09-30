// src/api/ai.js

export async function askWithData(requestBody) {
  const response = await fetch("http://localhost:8080/ai/ask-with-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    throw new Error("AI API request failed");
  }
  return await response.json();
}
