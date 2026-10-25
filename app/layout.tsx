import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"FLIPIQ | FC 27 Autoflipper",description:"FC 27 market intelligence with real observations, trend analysis and tax-aware estimates."};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
