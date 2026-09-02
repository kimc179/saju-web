const rateLimit = new Map();

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return String(forwarded || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
}

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 5;
  const recent = (rateLimit.get(ip) || []).filter((time) => now - time < windowMs);
  if (recent.length >= maxRequests) {
    rateLimit.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimit.set(ip, recent);
  return false;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "POST 요청만 허용됩니다." } });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: { message: "AI 상담 서버 설정이 아직 완료되지 않았습니다." } });
  }

  if (isRateLimited(getClientIp(req))) {
    return res.status(429).json({ error: { code: 429, message: "요청이 많습니다. 10분 뒤 다시 시도해 주세요." } });
  }

  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  if (!prompt || prompt.length > 20000) {
    return res.status(400).json({ error: { message: "상담 요청 내용이 없거나 너무 깁니다." } });
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 8192, temperature: 0.7 }
      })
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (error) {
    console.error("Gemini proxy error:", error);
    return res.status(502).json({ error: { message: "AI 상담 서버 연결에 실패했습니다." } });
  }
};
