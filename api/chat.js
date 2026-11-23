export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Allow': 'POST' }
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length) {
    return new Response(JSON.stringify({ error: 'Messages are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const system = {
    role: 'system',
    content: 'You are DEEPTRACE AI, a friendly general-purpose assistant specializing in responsible digital-media forensics. For everyday questions, answer naturally and briefly. For media verification, explain methodology, limitations, and suggest a certified examiner for legal use. Never claim a file is authentic or fake based only on metadata or a filename.'
  };

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [system, ...messages].slice(-21),
        temperature: 0.7
      })
    });

    const result = await upstream.json();
    if (!upstream.ok) {
      return new Response(JSON.stringify({
        error: result.error?.message || 'OpenAI request failed'
      }), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      message: result.choices?.[0]?.message?.content || 'No response received.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Could not reach OpenAI' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
