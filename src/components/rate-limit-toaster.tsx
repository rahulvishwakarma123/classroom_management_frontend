import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RateLimitError {
  status: number;
  message: string;
  retryAfter: number;
  timestamp: number;
}

export const RateLimitToaster = () => {
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const checkRateLimit = () => {
      const rateLimitErrorStr = sessionStorage.getItem("rateLimitError");
      if (!rateLimitErrorStr || hasShown) return;

      try {
        const rateLimitError: RateLimitError = JSON.parse(rateLimitErrorStr);
        const now = Date.now();
        const elapsed = Math.floor((now - rateLimitError.timestamp) / 1000);
        const remainingTime = Math.max(0, rateLimitError.retryAfter - elapsed);

        if (remainingTime > 0) {
          // Format time for display
          const timeDisplay =
            remainingTime < 60
              ? `${remainingTime} seconds`
              : `${Math.ceil(remainingTime / 60)} minute${
                  remainingTime > 60 ? "s" : ""
                }`;

          toast.error(rateLimitError.message, {
            description: `Please wait ${timeDisplay} before trying again.`,
            duration: remainingTime * 1000,
            action: {
              label: "Dismiss",
              onClick: () => {
                sessionStorage.removeItem("rateLimitError");
                setHasShown(false);
              },
            },
          });
          setHasShown(true);

          // Auto-clear after the retry time
          setTimeout(() => {
            sessionStorage.removeItem("rateLimitError");
            setHasShown(false);
          }, remainingTime * 1000);
        } else {
          // If the retry time has passed, clear the error
          sessionStorage.removeItem("rateLimitError");
        }
      } catch (e) {
        console.error("Error parsing rate limit error:", e);
        sessionStorage.removeItem("rateLimitError");
      }
    };

    // Check immediately
    checkRateLimit();

    // Also check periodically for any new errors
    const interval = setInterval(checkRateLimit, 1000);

    return () => clearInterval(interval);
  }, [hasShown]);

  return null;
};
