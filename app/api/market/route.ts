import { NextRequest, NextResponse } from "next/server";

const permitted = /^\/(?:players(?:\/\d+(?:\/(?:prices|sales))?)?|opportunities|trade-finder|market\/(?:freshness|flipiq-opportunities|flipiq-price-drops))(?:\?.*)?$/;
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "";
  if (!permitted.test(path)) return NextResponse.json({error:"Unsupported market endpoint"},{status:400});
  const origin=(process.env.EAFC_API_BASE || "https://api.eafc.live").replace(/\/$/, "");
  const isPrivateFeed=path.startsWith("/market/flipiq-opportunities") || path.startsWith("/market/flipiq-price-drops");
  const token=process.env.FLIPIQ_SERVICE_TOKEN || "";
  if(isPrivateFeed && token.length<32)return NextResponse.json({error:"FLIPIQ service connection is not configured"},{status:503});
  try {
    const headers:Record<string,string>={Accept:"application/json"};
    if(isPrivateFeed)headers["X-FLIPIQ-Token"]=token;
    const result=await fetch(`${origin}/api/v2${path}`, {cache:"no-store",headers,signal:AbortSignal.timeout(path.startsWith("/market/flipiq-price-drops")?45000:12000)});
    if (!result.ok) return NextResponse.json({error:`Market provider returned HTTP ${result.status}`},{status:502});
    return NextResponse.json(await result.json(),{headers:{"Cache-Control":"no-store"}});
  } catch { return NextResponse.json({error:"EAFC.Live market feed is unreachable"},{status:503}); }
}
