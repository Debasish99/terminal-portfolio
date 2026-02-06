"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import RetroLoader from "@/components/RetroLoader";

type BgType = "image" | "video";

interface BackgroundContextType {
  bgFile: string;
  bgType: BgType;
  changeBg: () => string;
  loading: boolean;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [bgFile, setBgFile] = useState("/images/gradient.jpg");
  const [bgType, setBgType] = useState<BgType>("image");
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    // Initial fetch to populate imageList and validate default
    fetch("/api/images")
      .then(res => res.json())
      .then(data => {
        if (data.files && data.files.length > 0) {
          setImageList(data.files);
          
          const defaultFile = "gradient.jpg";
          const exists = data.files.some((f: string) => f === defaultFile);
          
          if (exists) {
            setBgFile(`/images/${defaultFile}`);
            setBgType("image");
          } else {
            const firstFile = data.files[0];
            const isVideo = /\.(mp4|webm|ogg)$/i.test(firstFile);
            setBgFile(`/images/${firstFile}`);
            setBgType(isVideo ? "video" : "image");
          }
        }
      })
      .catch(err => console.error("Error fetching images:", err));
  }, []);

  // Separate effect for preloading whenever bgFile changes
  useEffect(() => {
    const isVideo = /\.(mp4|webm|ogg)$/i.test(bgFile);
    if (isVideo) {
      setLoading(false);
    } else {
      setLoading(true);
      const img = new Image();
      
      let imageLoaded = false;
      let minTimePassed = false;

      const checkFinished = () => {
        if (imageLoaded && minTimePassed) {
          setLoading(false);
        }
      };

      // Ensure loader stays for at least 2 seconds for the "retro" feel
      const minTimer = setTimeout(() => {
        minTimePassed = true;
        checkFinished();
      }, 2500);

      img.onload = () => {
        imageLoaded = true;
        checkFinished();
      };
      
      img.onerror = () => {
        imageLoaded = true; // Still stop loading on error so site is usable
        checkFinished();
      };

      img.src = bgFile;

      return () => {
        clearTimeout(minTimer);
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [bgFile]);

  const changeBg = useCallback(() => {
    if (imageList.length === 0) return "No background files found.";
    
    let nextFile = "";
    // Try to pick a different one if possible
    if (imageList.length > 1) {
      // Normalize current file for comparison (remove /images/ prefix)
      const currentFileName = bgFile.split('/').pop();
      do {
        nextFile = imageList[Math.floor(Math.random() * imageList.length)];
      } while (nextFile === currentFileName);
    } else {
      nextFile = imageList[0];
    }

    const fullPath = `/images/${nextFile}`;
    const isVideo = /\.(mp4|webm|ogg)$/i.test(nextFile);
    
    setBgFile(fullPath);
    setBgType(isVideo ? "video" : "image");
    
    return `Background changed to ${nextFile}`;
  }, [bgFile, imageList]);

  return (
    <BackgroundContext.Provider value={{ bgFile, bgType, changeBg, loading }}>
      {loading && <RetroLoader />}
      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {bgType === "image" ? (
          <div 
            key={bgFile}
            className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-1] bg-black bg-fixed w-full h-full"
            style={{ 
              backgroundImage: `url('${bgFile}')`,
              display: 'block',
              backgroundColor: 'black'
            }}
          >
            <div className="sr-only">Background Image: {bgFile}</div>
          </div>
        ) : (
          <video
            key={bgFile}
            autoPlay
            loop
            muted
            playsInline
            className="fixed inset-0 w-full h-full object-cover z-[-1] bg-black"
            src={bgFile}
          />
        )}
        {children}
      </div>
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}
