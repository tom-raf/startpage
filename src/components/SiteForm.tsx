import { useState, type FormEvent, type KeyboardEvent } from "react";
import type { Site } from "../types";

export function SiteForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Site;
  onSave: (site: Omit<Site, "id">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [note, setNote] = useState(initial?.note ?? "");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onSave({ name: name.trim(), url: url.trim(), note: note.trim() || undefined });
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") onCancel();
  }

  return (
    <form className="form" onSubmit={submit} onKeyDown={onKeyDown}>
      <input className="input" autoFocus placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="input" placeholder="URL (e.g. github.com)" value={url} onChange={(e) => setUrl(e.target.value)} />
      <input className="input" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="row">
        <button className="btn small" type="submit">
          {initial ? "SAVE" : "ADD"}
        </button>
        <button className="btn small ghost" type="button" onClick={onCancel}>
          CANCEL
        </button>
      </div>
    </form>
  );
}
