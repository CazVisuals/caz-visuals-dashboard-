exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      keyExists: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY?.length || 0
    })
  };
};
