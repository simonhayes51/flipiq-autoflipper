import {timingSafeEqual} from "node:crypto";
import {NextRequest, NextResponse} from "next/server";

// Until FLIPIQ has its own account/subscription system, keep the
// first-party market feed behind a private site password. Neither
// this password nor the EAFC service token is included in client JS.
export function proxy(request:NextRequest){
  const password=process.env.FLIPIQ_SITE_PASSWORD||"";
  if(password.length<12)return new NextResponse("FLIPIQ private access is not configured.",{status:503,headers:{"Cache-Control":"no-store"}});
  const authorization=request.headers.get("authorization")||"";
  let candidate="";
  if(authorization.startsWith("Basic ")){
    try{candidate=Buffer.from(authorization.slice(6),"base64").toString("utf8");}catch{}
  }
  const supplied=Buffer.from(candidate,"utf8");
  const expected=Buffer.from(`flipiq:${password}`,"utf8");
  if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected)){
    return new NextResponse("FLIPIQ login required.",{
      status:401,
      headers:{"WWW-Authenticate":'Basic realm="FLIPIQ", charset="UTF-8"',"Cache-Control":"no-store"},
    });
  }
  return NextResponse.next();
}

export const config={matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]};
