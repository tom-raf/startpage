import { useState } from "react";
import { DEFAULT_DATA } from "./defaults";
import type { Section, Site, StoreData, WeatherPlace } from "./types";

const STORAGE_KEY = "startpage.data.v1";

export function makeId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function isStoreData(value: unknown): value is StoreData {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<StoreData>;
  if (v.version !== 1 || !Array.isArray(v.sections) || !v.settings?.place) return false;
  return v.sections.every(
    (s) =>
      typeof s?.id === "string" &&
      typeof s.title === "string" &&
      Array.isArray(s.sites) &&
      s.sites.every((x) => typeof x?.id === "string" && typeof x.name === "string" && typeof x.url === "string"),
  );
}

function read(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isStoreData(parsed)) return parsed;
    }
  } catch {
    // storage unavailable or corrupt, fall back to defaults
  }
  return clone(DEFAULT_DATA);
}

function write(data: StoreData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable, edits last until the tab closes
  }
}

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function useStore() {
  const [data, setData] = useState<StoreData>(read);

  function commit(update: (prev: StoreData) => StoreData) {
    setData((prev) => {
      const next = update(prev);
      write(next);
      return next;
    });
  }

  function mapSection(sectionId: string, fn: (s: Section) => Section) {
    commit((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? fn(s) : s)),
    }));
  }

  return {
    data,

    addSite(sectionId: string, site: Omit<Site, "id">) {
      mapSection(sectionId, (s) => ({
        ...s,
        sites: [...s.sites, { ...site, id: makeId(), url: normalizeUrl(site.url) }],
      }));
    },

    updateSite(sectionId: string, site: Site) {
      mapSection(sectionId, (s) => ({
        ...s,
        sites: s.sites.map((x) => (x.id === site.id ? { ...site, url: normalizeUrl(site.url) } : x)),
      }));
    },

    removeSite(sectionId: string, siteId: string) {
      mapSection(sectionId, (s) => ({ ...s, sites: s.sites.filter((x) => x.id !== siteId) }));
    },

    moveSite(sectionId: string, siteId: string, dir: -1 | 1) {
      mapSection(sectionId, (s) => {
        const i = s.sites.findIndex((x) => x.id === siteId);
        return { ...s, sites: move(s.sites, i, i + dir) };
      });
    },

    addSection(title: string) {
      commit((prev) => ({
        ...prev,
        sections: [...prev.sections, { id: makeId(), title: title.trim().toUpperCase(), sites: [] }],
      }));
    },

    renameSection(sectionId: string, title: string) {
      mapSection(sectionId, (s) => ({ ...s, title: title.trim().toUpperCase() || s.title }));
    },

    removeSection(sectionId: string) {
      commit((prev) => ({ ...prev, sections: prev.sections.filter((s) => s.id !== sectionId) }));
    },

    moveSection(sectionId: string, dir: -1 | 1) {
      commit((prev) => {
        const i = prev.sections.findIndex((s) => s.id === sectionId);
        return { ...prev, sections: move(prev.sections, i, i + dir) };
      });
    },

    setPlace(place: WeatherPlace) {
      commit((prev) => ({ ...prev, settings: { ...prev.settings, place } }));
    },

    replaceAll(next: StoreData) {
      commit(() => next);
    },

    resetToDefaults() {
      commit(() => clone(DEFAULT_DATA));
    },
  };
}

export type Store = ReturnType<typeof useStore>;
