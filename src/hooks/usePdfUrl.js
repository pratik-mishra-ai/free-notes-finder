import { useEffect, useState } from 'react';

// Converts a PDF data URL into a Blob URL, which browsers display reliably in a viewer.
export default function usePdfUrl(dataUrl) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let objectUrl = '';
    let cancelled = false;
    setUrl('');
    if (!dataUrl) return undefined;
    fetch(dataUrl)
      .then((r) => r.blob())
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [dataUrl]);
  return url;
}
