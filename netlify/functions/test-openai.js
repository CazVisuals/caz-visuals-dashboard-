exports.handler = async () => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/models",
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      keyExists: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY?.length || 0
    })
  };
};
