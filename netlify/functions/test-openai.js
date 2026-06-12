exports.handler = async function() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      keyExists: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
      startsWithSk: process.env.OPENAI_API_KEY
        ? process.env.OPENAI_API_KEY.startsWith("sk-")
        : false
    })
  };
};
