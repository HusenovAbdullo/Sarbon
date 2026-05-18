export const dynamic = "force-dynamic";

const SIGNATURE = "Web programmer. Telegram: @Husenov_Abdullo";

export async function GET() {
  return new Response(SIGNATURE, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store, no-cache, max-age=0, must-revalidate",
      "x-content-type-options": "nosniff"
    }
  });
}

export async function POST() {
  return GET();
}
