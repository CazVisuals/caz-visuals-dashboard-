exports.handler = async function(event) {
  try {
    const { prompt, leads, contracts, activities } =
      JSON.parse(event.body || "{}");

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are Caz Visuals AI Office Manager.

Responsibilities:
- Manage leads
- Manage contracts
- Track payments
- Generate follow-ups
- Suggest daily priorities
- Help schedule shoots
- Act like a virtual employee
`
            },
            {
              role: "user",
              content: `
CRM DATA

Leads:
${JSON.stringify(leads || [])}

Contracts:
${JSON.stringify(contracts || [])}

Activities:
${JSON.stringify(activities || [])}

Question:
${prompt}
`
            }
          ]
        })
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices[0].message.content
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};
