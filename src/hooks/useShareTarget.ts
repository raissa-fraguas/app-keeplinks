import { useEffect, useState } from 'react';
import { extractUrlFromText, detectPlatform, guessPostDetails } from '../services/platformDetector';
import { ShareDataInput } from '../types';

export function useShareTarget(onShareReceived: (data: ShareDataInput) => void) {
  const [initialShareHandled, setInitialShareHandled] = useState(false);

  useEffect(() => {
    if (initialShareHandled) return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const rawUrl = urlParams.get('url');
      const rawText = urlParams.get('text');
      const rawTitle = urlParams.get('title');

      // Check if we received a shared link
      if (rawUrl || rawText) {
        let detectedUrl = rawUrl || '';
        let detectedText = rawText || '';

        // If rawText contains a URL and rawUrl is empty
        if (!detectedUrl && detectedText) {
          const extracted = extractUrlFromText(detectedText);
          if (extracted) {
            detectedUrl = extracted.url;
            detectedText = extracted.remainingText;
          }
        }

        if (detectedUrl) {
          const platform = detectPlatform(detectedUrl);
          const details = guessPostDetails(detectedUrl, rawTitle || undefined, detectedText || undefined);

          onShareReceived({
            url: detectedUrl,
            title: details.title,
            text: detectedText,
            platform,
          });

          // Clean query params so refreshing doesn't reopen share modal
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }

      setInitialShareHandled(true);
    } catch (err) {
      console.warn('Error reading share target params:', err);
    }
  }, [initialShareHandled, onShareReceived]);
}
