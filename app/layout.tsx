import "./globals.css";
import type { Metadata } from "next";
import { Fira_Code, VT323, IBM_Plex_Mono } from "next/font/google";
import { BackgroundProvider } from "@/lib/BackgroundContext";

const fira = Fira_Code({ subsets: ["latin"], variable: "--font-fira" });
const vt = VT323({ subsets: ["latin"], weight: "400", variable: "--font-vt" });
const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm",
});

export const metadata: Metadata = {
  title: {
    default: "Debasish Lenka",
    template: "%s | Debasish Lenka",
  },
  description:
    "Personal blog by Debasish Lenka on Cloud Technologies, Active Directory, PowerShell automation, system administration, and infrastructure.",

  keywords: [
    "Debasish Lenka",
    "Active Directory",
    "PowerShell Automation",
    "System Administration",
    "Cyber Security",
    "Linux",
    "Windows Server",
    "DevOps",
    "Azure",
    "Kubernetes",
    "Infrastructure",
    "Tech Blog",
  ],

  authors: [{ name: "Debasish Lenka" }],
  creator: "Debasish Lenka",
  metadataBase: new URL("https://debasishlenka.in"),

  openGraph: {
    title: "Debasish Lenka",
    description:
      "Blog on systems, security and automation.",
    url: "https://debasishlenka.in",
    siteName: "Debasish Lenka",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Debasish Lenka",
    description:
      "Blog on systems, security and automation.",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fira.variable} ${vt.variable} ${ibm.variable} bg-[#0b0e14] text-[#d1d5db]`}
      >
        <BackgroundProvider>
          {children}
        </BackgroundProvider>
      </body>
    </html>
  );
}
