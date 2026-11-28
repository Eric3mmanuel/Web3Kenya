
export function GET() {
  return new Response("Web3Kenya backend is running!", {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
