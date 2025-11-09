"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showRevisit, setShowRevisit] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    } else {
      setShowRevisit(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
    setShowRevisit(true);
  };

  const handleRevisit = () => {
    setShowBanner(true);
    setShowRevisit(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowRevisit(true);
  };

  if (!showBanner && !showRevisit) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-6 shadow-lg animate-slide-up">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              This website uses cookies to improve your experience. By continuing to use the site, you consent to our use of cookies.{" "}
              <a href="#privacy" className="underline hover:text-accent">
                Learn More
              </a>
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Dismiss
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revisit Consent Button */}
      {showRevisit && !showBanner && (
        <button
          onClick={handleRevisit}
          className="fixed bottom-4 left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm hover:bg-primary/90 transition-all shadow-lg"
          aria-label="Revisit cookie consent"
        >
          Cookie Settings
        </button>
      )}
    </>
  );
};

export default CookieConsent;
