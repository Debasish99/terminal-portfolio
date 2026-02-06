"use client";

import { useState, useCallback } from "react";
import Terminal from "@/components/Terminal";
import Typewriter from "@/components/Typewriter";
import { useBackground } from "@/lib/BackgroundContext";

export default function ResumePage() {
  const { loading } = useBackground();
  const [typingDone, setTypingDone] = useState(false);

  const handleTypingComplete = useCallback(() => {
    setTypingDone(true);
  }, []);

  const resumeText = `
  
EXPERIENCE:
[Aug 2021 - Present] Senior Project Engineer @ Wipro - 4.5 yrs
☞ SME for Windows Server, AD & VMware

SKILLS:
☞ Windows Servers 2012/2016/2019/2022/2025 ☞ Active Directory 
☞ GPO, DNS, DHCP, IIS, PKI, SMTP, File Server, DFS
☞ Security patching and Hardening ☞ PowerShell scripting
☞ Microsoft Hyper-V ☞ VMware vSphere, ESXi, Storage 
☞ VMware PowerCLI ☞ VMware SRM and vSAN 
☞ Physical Network and Storage technologies
☞ Microsoft 365 ☞ Entra ID
☞ Azure & AWS IAAS  
☞ Linux Servers
`;

  return (
    <>
      <main
        className={`
          relative
          min-h-screen
          flex items-center justify-center
          px-2
          transition-opacity duration-1000
          ${loading ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {/* SAME WIDTH LOGIC AS HOME */}
        <div
            className="
                      w-full
                      max-h-full
                      flex flex-col
                      max-w-[85%]
                    "
        >


        {/* SAME TERMINAL BUTTON STRIP */}
          <div className="terminal-buttons-container">
            <span className="button close"></span>
            <span className="button minimize"></span>
            <span className="button maximize"></span>
          </div>

          {!loading && (
            <Terminal
              title="debasish@resume:~"
              welcomeMessage={
                <div className="text-gray-300">
                  <div className="mb-3">
                    Type <span className="text-grey-400">'help'</span> or scroll to read.
                  </div>



                  <pre className="whitespace-pre-wrap font-mono">
                    <Typewriter
                      text={resumeText}
                      speed={10}
                      onComplete={handleTypingComplete}
                    />
                  </pre>

                  {typingDone && (

                      <div className="mt-4 flex flex-col space-y-1">


                      <a
                              href="https://github.com/Debasish99"
                              target="_blank"
                              className="text-green-400 underline hover:text-green-300"
                          >
                            GitHub
                          </a>

                          <a
                              href="https://www.linkedin.com/in/debasish-lenka/"
                              target="_blank"
                              className="text-green-400 underline hover:text-green-300"
                          >
                            LinkedIn
                          </a>

                          <a
                              href="https://mgkclwfialczddlykdma.supabase.co/storage/v1/object/sign/files/DebasishLenkaResumeWindowsAdmin.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YjNjNGFhNS0yYmI4LTQxZGEtOGU4Yy05MTRiMDEwYzlkNWQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmaWxlcy9EZWJhc2lzaExlbmthUmVzdW1lV2luZG93c0FkbWluLnBkZiIsImlhdCI6MTc2OTI4MzY0NiwiZXhwIjoyMDg0NjQzNjQ2fQ.n7rJc0ueToedJikwOY7VMxnGXgh9XE_lnpOLOhVTUJc"
                              target="_blank"
                              className="text-green-400 underline hover:text-green-300"
                          >
                            Download Resume
                          </a>

                        </div>


                  )}
                </div>
              }
            />
          )}
        </div>
      </main>
    </>
  );
}
