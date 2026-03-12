export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  try {
    const { system, messages } = req.body;

    // Convert messages to Gemini format
    const contents = [];

    // Add system instruction as first user message context
    if (system) {
      contents.push({
        role: "user",
        parts: [
          {
            text: system + "\n\n---\n\nNow answer the following conversation:",
          },
        ],
      });
      contents.push({
        role: "model",
        parts: [
          {
            text: "Understood. I will answer questions about the 2026-2027 USAU rules using only the provided rules text, citing specific rule numbers.",
          },
        ],
      });
    }

    for (const msg of messages) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.3,
          },
        }),
      },
    );

    const data = await response.json();

    if (data.error) {
      return res.status(response.status).json({ error: data.error.message });
    }

    // Extract text from Gemini response and convert to Anthropic-like format
    // so the frontend doesn't need to change
    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .filter(Boolean)
        .join("\n") || "No response generated.";

    return res.status(200).json({
      content: [{ type: "text", text }],
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: "Failed to reach Gemini API" });
  }
}
