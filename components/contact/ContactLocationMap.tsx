"use client";

import { CONTACT_LOCATION_MAP_FRAME } from "@/components/contact/contactLocationShared";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { resolveMediaUrl } from "@/lib/mediaAssets";
import { WING_PATH, WING_VIEWBOX } from "@/lib/wingMark";
import type { ExpressionSpecification, Map as MapLibreMap, StyleSpecification } from "maplibre-gl";
import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

const MARKER_W = 52;
const OPENFREEMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const MAP_WORKER_URL = "/maplibre/maplibre-gl-worker.mjs";

/** Latin/English only — never local `name` or `name:nonlatin` (Thai on Samui). */
const ENGLISH_TEXT_FIELD: ExpressionSpecification = [
  "coalesce",
  ["get", "name_en"],
  ["get", "name:en"],
  ["get", "name:latin"],
];

function escapeAttr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function markerHtml(markSrc: string) {
  const mark = markSrc
    ? `<img src="${escapeAttr(markSrc)}" alt="" width="28" height="28" style="height:28px;width:auto;max-width:36px;object-fit:contain;" draggable="false" />`
    : `<svg viewBox="${WING_VIEWBOX}" width="22" height="34" aria-hidden="true"><path d="${WING_PATH}" fill="#fff"/></svg>`;

  return `<div style="display:flex;flex-direction:column;align-items:center;width:${MARKER_W}px;filter:drop-shadow(0 6px 16px rgba(42,26,30,.32));">
    <div style="display:flex;height:48px;width:48px;align-items:center;justify-content:center;border-radius:10px;background:#6a414d;">
      ${mark}
    </div>
    <svg width="28" height="36" viewBox="0 0 28 36" style="margin-top:-2px;" aria-hidden="true">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0Z" fill="#EA4335"/>
      <circle cx="14" cy="14" r="5" fill="#fff"/>
    </svg>
  </div>`;
}

function forceEnglishLabels(style: StyleSpecification) {
  for (const layer of style.layers ?? []) {
    if (layer.type !== "symbol" || !layer.layout || !("text-field" in layer.layout)) continue;
    const raw = JSON.stringify(layer.layout["text-field"] ?? "");
    if (raw.includes('"ref"')) continue;
    layer.layout["text-field"] = ENGLISH_TEXT_FIELD;
  }
  return style;
}

export default function ContactLocationMap({
  lat,
  lng,
  title,
}: {
  lat: number;
  lng: number;
  title: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const site = useSiteSettings();
  const markSrc = resolveMediaUrl(
    site?.brandLogoMarkOnDark || site?.brandLogoMark,
    "",
  );

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    let cancelled = false;
    let map: MapLibreMap | null = null;
    let resize: ResizeObserver | null = null;

    void (async () => {
      const { Map, Marker, NavigationControl, setWorkerUrl } = await import("maplibre-gl");
      setWorkerUrl(MAP_WORKER_URL);
      if (cancelled || !hostRef.current) return;

      let style: string | StyleSpecification = OPENFREEMAP_STYLE;
      try {
        const res = await fetch(OPENFREEMAP_STYLE);
        if (res.ok) {
          style = forceEnglishLabels((await res.json()) as StyleSpecification);
        }
      } catch {
        /* style URL still loads; labels patched on style.load */
      }
      if (cancelled || !hostRef.current) return;

      const next = new Map({
        container: hostRef.current,
        style,
        center: [lng, lat],
        zoom: 16,
        attributionControl: { compact: true },
      });
      map = next;
      if (cancelled) {
        next.remove();
        return;
      }

      next.addControl(
        new NavigationControl({
          showCompass: false,
          showZoom: true,
          visualizePitch: false,
        }),
        "top-right",
      );

      const applyEnglish = () => {
        const current = next.getStyle();
        if (!current?.layers) return;
        for (const layer of current.layers) {
          if (layer.type !== "symbol") continue;
          const field = layer.layout?.["text-field"];
          if (field == null) continue;
          if (JSON.stringify(field).includes('"ref"')) continue;
          try {
            next.setLayoutProperty(layer.id, "text-field", ENGLISH_TEXT_FIELD);
          } catch {
            /* layer may not accept text-field updates */
          }
        }
      };

      const placeMarker = () => {
        const pin = document.createElement("div");
        pin.className = "varsovia-office-marker";
        pin.innerHTML = markerHtml(markSrc);
        pin.style.pointerEvents = "none";
        pin.setAttribute("aria-hidden", "true");
        new Marker({ element: pin, anchor: "bottom" }).setLngLat([lng, lat]).addTo(next);
      };

      next.on("style.load", () => {
        if (cancelled) return;
        applyEnglish();
        placeMarker();
        next.resize();
      });

      requestAnimationFrame(() => next.resize());
      resize = new ResizeObserver(() => next.resize());
      resize.observe(hostRef.current);
    })();

    return () => {
      cancelled = true;
      resize?.disconnect();
      map?.remove();
    };
  }, [lat, lng, title, markSrc]);

  return (
    <div
      ref={hostRef}
      className={`${CONTACT_LOCATION_MAP_FRAME} contact-location-map`}
      role="region"
      aria-label={title}
    />
  );
}
