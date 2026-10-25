import { NextRequest, NextResponse } from "next/server";

const permitted = /^\/(?:players(?:\/\d+(?:\/(?:prices|sales))?)?|opportunities|trade-finder|market\/freshness)(?:\?.*)?$/;
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "";
  if (!permitted.test(path)) return NextResponse.json({error:"Unsupported market endpoint"},{status:400});
  const origin=(process.env.EAFC_API_BASE || "https://api.eafc.live").replace(/\/$/, "");
  try {
    const result=await fetch(`${origin}/api/v2${path}`, {cache:"no-store",headers:{Accept:"application/json"},signal:AbortSignal.timeout(12000)});
    if (!result.ok) return NextResponse.json({error:`Market provider returned HTTP ${result.status}`},{status:502});
    return NextResponse.json(await result.json(),{headers:{"Cache-Control":"no-store"}});
  } catch { return NextResponse.json({error:"EAFC.Live market feed is unreachable"},{status:503}); }
}
