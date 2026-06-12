exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing OPENAI_API_KEY environment variable."
        })
      };
    }

    const body = JSON.parse(event.body || "{}");

    const userPrompt = body.prompt || "";
    const crmData = body.crmData || {};

    if (!userPrompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing prompt."
        })
      };
    }

    const systemPrompt = `
You are the AI Office Manager for Caz Visuals, a photography and videography business.

You help manage:
- leads
- follow-ups
- quotes
- contracts
- deposits
- balances
- upcoming shoots
- open tasks
- client communication

Be practical, direct, and business-focused.
Use the CRM data provided.
Do not invent client names, dates, balances, or contract details.
Give clear next actions.
When writing client messages, keep them professional, warm, and concise.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content:
              "User request: " + userPrompt + "\n\n" +
              "CRM Data JSON:\n" + JSON.stringify(crmData, null, 2)
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "OpenAI request failed.",
          details: data
        })
      };
    }

    const outputText =
      data.output_text ||
      (
        data.output &&
        data.output[0] &&
        data.output[0].content &&
        data.output[0].content[0] &&
        data.output[0].content[0].text
      ) ||
      "No response generated.";

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        answer: outputText
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
