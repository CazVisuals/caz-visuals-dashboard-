exports.handler = async function(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { prompt, leads, contracts, activities } = JSON.parse(event.body || "{}");

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt." })
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are the AI Office Manager for Caz Visuals.

Your job:
- Review CRM leads, contracts, payments, shoots, and activities
- Recommend what Caz should do next
- Write client messages
- Identify unpaid deposits and balances
- Find follow-ups due
- Help automate the photography business

Respond clearly, practically, and like a real assistant.
`
          },
          {
            role: "user",
            content: `
CRM DATA:

LEADS:
${JSON.stringify(leads || [], null, 2)}

CONTRACTS:
${JSON.stringify(contracts || [], null, 2)}

ACTIVITIES:
${JSON.stringify(activities || [], null, 2)}

CAZ ASKS:
${prompt}
`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "No AI reply returned."
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
