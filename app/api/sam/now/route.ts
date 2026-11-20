import { endpointBody } from "@/content/api";

/** Static JSON, prerendered at build time. The home page's hero card shows the same object. */
export function GET() {
  return Response.json(endpointBody("/api/sam/now"), {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
