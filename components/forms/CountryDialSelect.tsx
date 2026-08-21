"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import {
  COUNTRY_DIAL_CODES,
  countryByIso2,
  filterCountries,
  flagEmoji,
  type CountryDialCode,
} from "@/lib/countryDialCodes";

const MENU_W = 280;
const MENU_H = 268;

/** Varsovia contact forms always open on Thailand (+66), on every locale. */
export function defaultDialCountry(): CountryDialCode {
  return countryByIso2("TH") ?? COUNTRY_DIAL_CODES.find((c) => c.iso2 === "TH")!;
}

type CountryDialSelectProps = {
  value: CountryDialCode;
  onChange: (country: CountryDialCode) => void;
  labelledBy?: string;
};

export default function CountryDialSelect({ value, onChange, labelledBy }: CountryDialSelectProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  const filtered = useMemo(() => filterCountries(search), [search]);

  useEffect(() => setMounted(true), []);

  function placeMenu() {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const left = Math.min(Math.max(8, r.left), window.innerWidth - MENU_W - 8);
    const below = r.bottom + 8;
    const top = below + MENU_H > window.innerHeight - 8 && r.top > MENU_H + 16 ? r.top - MENU_H - 8 : below;
    setPos({ top, left });
  }

  function close() {
    setOpen(false);
    setSearch("");
  }

  function toggle() {
    if (open) {
      close();
      return;
    }
    placeMenu();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    placeMenu();
    const id = window.setTimeout(() => searchRef.current?.focus(), 20);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    function onPointer(e: MouseEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      close();
    }
    function onScroll(e: Event) {
      if (menuRef.current?.contains(e.target as Node)) return;
      placeMenu();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("resize", placeMenu);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("resize", placeMenu);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelledBy}
        onClick={toggle}
        className="flex h-full shrink-0 cursor-pointer items-center gap-1.5 pr-2"
      >
        <span className="text-[16px] leading-none" aria-hidden>
          {flagEmoji(value.iso2)}
        </span>
        <span className="font-outfit text-[13px] font-medium leading-none text-[#251b1e] sm:text-[14px]">
          {value.dial}
        </span>
        <ChevronDown size={12} className="shrink-0 text-[#6a414d]/70" aria-hidden />
      </button>
      <span className="h-4 w-px shrink-0 bg-[#6a414d]/20" aria-hidden />

      {mounted && open
        ? createPortal(
            <div
              ref={menuRef}
              role="listbox"
              className="fixed z-[140] overflow-hidden rounded-[8px] border border-[#cfc4c6] bg-white shadow-lg"
              style={{ top: pos.top, left: pos.left, width: MENU_W }}
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="border-b border-[#e5dcd3] bg-[#fdfdfd] p-2">
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country or code"
                  className="w-full rounded-[4px] border border-[#cfc4c6] bg-white px-2 py-1.5 font-outfit text-[13px] text-[#251b1e] outline-none transition-colors focus:border-[#6a414d]"
                />
              </div>
              <div
                className="max-h-[220px] overflow-y-auto overscroll-contain py-1 [-webkit-overflow-scrolling:touch]"
                style={{ touchAction: "pan-y" }}
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {filtered.length === 0 ? (
                  <p className="px-3 py-2 font-outfit text-[13px] text-[#8A7A68]">No matches found</p>
                ) : (
                  filtered.map((c) => {
                    const active = c.iso2 === value.iso2;
                    return (
                      <button
                        key={c.iso2}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          onChange(c);
                          close();
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[13px] text-[#251b1e] transition-colors hover:bg-black/5 ${
                          active ? "bg-black/[0.06]" : ""
                        }`}
                      >
                        <span className="w-7 shrink-0 text-[12px] font-semibold text-[#6a414d]">
                          {c.iso2}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{c.name}</span>
                        <span className="shrink-0 text-[#251b1e]/60">{c.dial}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
