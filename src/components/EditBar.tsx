import { useRef, useState, type FormEvent } from "react";
import { isStoreData, type Store } from "../useStore";
import { geocode } from "../useWeather";

export function EditBar({ store }: { store: Store }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [placeQuery, setPlaceQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [armed, setArmed] = useState(false);

  async function setPlace(e: FormEvent) {
    e.preventDefault();
    if (!placeQuery.trim()) return;
    setMessage("LOOKING UP…");
    try {
      const place = await geocode(placeQuery);
      if (!place) {
        setMessage(`NO PLACE FOUND FOR "${placeQuery.toUpperCase()}"`);
        return;
      }
      store.setPlace(place);
      setPlaceQuery("");
      setMessage(`WEATHER SET TO ${place.name.toUpperCase()}`);
    } catch {
      setMessage("LOOKUP FAILED · CHECK YOUR CONNECTION");
    }
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(store.data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `startpage-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMessage("EXPORTED");
  }

  async function importData(file: File) {
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isStoreData(parsed)) {
        setMessage("IMPORT FAILED · NOT A START PAGE FILE");
        return;
      }
      store.replaceAll(parsed);
      setMessage(`IMPORTED ${parsed.sections.length} SECTIONS`);
    } catch {
      setMessage("IMPORT FAILED · FILE IS NOT VALID JSON");
    }
  }

  return (
    <div className="editbar">
      <span className="label">EDIT MODE</span>

      <form onSubmit={setPlace} style={{ display: "flex", gap: "var(--space-8)", alignItems: "center" }}>
        <span>WEATHER FOR</span>
        <input
          className="input place"
          placeholder={store.data.settings.place.name}
          value={placeQuery}
          onChange={(e) => setPlaceQuery(e.target.value)}
        />
        <button className="btn small ghost" type="submit">
          SET
        </button>
      </form>

      {message && <span>{message}</span>}

      <span className="spacer" />

      <button className="btn small ghost" onClick={exportData}>
        EXPORT JSON
      </button>
      <button className="btn small ghost" onClick={() => fileRef.current?.click()}>
        IMPORT JSON
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importData(f);
          e.target.value = "";
        }}
      />
      <button
        className={`btn small ghost ${armed ? "armed" : ""}`}
        onClick={() => {
          if (!armed) return setArmed(true);
          store.resetToDefaults();
          setArmed(false);
          setMessage("RESET TO DEFAULTS");
        }}
        onMouseLeave={() => setArmed(false)}
      >
        {armed ? "CONFIRM RESET" : "RESET TO DEFAULTS"}
      </button>
    </div>
  );
}
