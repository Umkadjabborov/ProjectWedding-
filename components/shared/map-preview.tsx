"use client";

import { useEffect, useMemo, useState } from "react";

interface MapPreviewProps {
  query: string;
  title?: string;
}

const YANDEX = "yandex";
const GOOGLE = "google";

export function MapPreview({ query, title = "Joylashuv" }: MapPreviewProps) {
  const yandexUrl = useMemo(
    () => `https://yandex.com/maps/?text=${encodeURIComponent(query)}&z=15`,
    [query]
  );
  const googleUrl = useMemo(
    () => `https://www.google.com/maps/search/${encodeURIComponent(query)}/?hl=uz`,
    [query]
  );

  const [service, setService] = useState(GOOGLE);
  const [src, setSrc] = useState(googleUrl);

  useEffect(() => {
    setSrc(service === GOOGLE ? googleUrl : yandexUrl);
  }, [query, service, googleUrl, yandexUrl]);

  const handleError = () => {
    if (service === YANDEX) {
      setService(GOOGLE);
      setSrc(googleUrl);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-border/50">
      <div className="bg-muted px-4 py-3 text-sm font-semibold flex items-center justify-between gap-3">
        <span>{title}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setService(YANDEX)}
            className={`rounded-full px-3 py-1 transition ${service === YANDEX ? "bg-primary text-white" : "bg-background text-foreground border border-border/50"}`}
          >
            Yandex
          </button>
          <button
            type="button"
            onClick={() => setService(GOOGLE)}
            className={`rounded-full px-3 py-1 transition ${service === GOOGLE ? "bg-primary text-white" : "bg-background text-foreground border border-border/50"}`}
          >
            Google
          </button>
        </div>
      </div>
      <iframe
        src={src}
        className="w-full h-64"
        title={title}
        loading="lazy"
        onError={handleError}
      />
      {service === GOOGLE ? (
        <div className="px-4 py-3 text-xs text-muted-foreground bg-muted/80">
          Google xaritasi ishlatilmoqda.
        </div>
      ) : null}
    </div>
  );
}
