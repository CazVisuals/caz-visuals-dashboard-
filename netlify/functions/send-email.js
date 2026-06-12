exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || "Caz Visuals <onboarding@resend.dev>";

    if (!RESEND_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing RESEND_API_KEY environment variable." })
      };
    }

    const body = JSON.parse(event.body || "{}");

    const to = body.to;
    const subject = body.subject;
    const message = body.message;

    if (!to || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields: to, subject, or message."
        })
      };
    }

    const htmlMessage = message
      .replace(/\n/g, "<br>")
      .replace(/\$PORTAL_LINK/g, body.portalLink || "");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + RESEND_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: subject,
        html: htmlMessage,
        reply_to: body.replyTo || "cazimirconstant@gmail.com"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Resend email failed.",
          details: data
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: data
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
