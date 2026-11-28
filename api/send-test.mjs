
export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.RESEND_TEST_TO;
  const testToken = process.env.RESEND_TEST_TOKEN;

  // Make sure the required settings exist
  if (!apiKey || !recipient || !testToken) {
    return Response.json(
      { error: "Email settings are missing." },
      { status: 500 }
    );
  }

  // Protect this temporary test endpoint
  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${testToken}`) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  // Send the test email through Resend
  try {
    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: "Web3Kenya <test@mail.web3kenya.co.ke>",
          to: [recipient],
          subject: "Web3Kenya Resend Test",
          html: `
            <h2>It works!</h2>
            <p>Web3Kenya has successfully connected
            to Resend.</p>
            <p>Your email backend is working.</p>
          `
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend error:", result);

      return Response.json(
        { error: "Resend could not send the email." },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      message: "Test email accepted by Resend.",
      id: result.id
    });

  } catch (error) {
    console.error("Email function error:", error);

    return Response.json(
      { error: "Unable to contact Resend." },
      { status: 500 }
    );
  }
}
