import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

export const handler = async (req: Request): Promise<Response> => {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid 'query' in request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("DIFFBOT_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Diffbot API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const diffbotResponse = await fetch("https://llm.diffbot.com/api/v1/web_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ text: [query], size: 10 }),
    });

    if (!diffbotResponse.ok) {
      const err = await diffbotResponse.text();
      return new Response(JSON.stringify({ error: `Diffbot request failed: ${diffbotResponse.status}`, details: err }), {
        status: diffbotResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await diffbotResponse.json();
    const results = data.search_results ?? [];
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: "No results from Diffbot" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    // Simple ranking: highest score first. In a real implementation you would prioritize official domains.
    const best = results[0];
    const url = best.pageUrl;
    const domainMatch = url.match(/^https?:\/\/([^\/]+)/i);
    const domain = domainMatch ? domainMatch[1] : "";
    const result = {
      title: best.title ?? "",
      url: url,
      domain: domain,
      content: best.content ?? "",
      description: best.title,
      images: [],
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Unexpected error", details: e?.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

serve(handler);
