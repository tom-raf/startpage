import { useState } from "react";
import type { Site } from "../types";

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function Favicon({ url, name }: { url: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const host = hostOf(url);
  return (
    <span className="card-icon">
      {failed ? (
        name.charAt(0).toUpperCase()
      ) : (
        <img
          src={`https://www.google.com/s2/favicons?sz=64&domain=${host}`}
          alt=""
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export function SiteCard({
  site,
  editing,
  isFirst,
  isLast,
  onEdit,
  onRemove,
  onMove,
}: {
  site: Site;
  editing: boolean;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [armed, setArmed] = useState(false);

  const body = (
    <>
      <Favicon url={site.url} name={site.name} />
      <span className="card-text">
        <span className="card-name">{site.name}</span>
        {site.note && <span className="card-note">{site.note}</span>}
        <span className="card-host">{hostOf(site.url)} →</span>
      </span>
    </>
  );

  if (!editing) {
    return (
      <a className="card" href={site.url}>
        {body}
      </a>
    );
  }

  return (
    <div className="card editing" onMouseLeave={() => setArmed(false)}>
      {body}
      <span className="card-tools">
        <span className="row">
          <button className="icon-btn" onClick={onEdit} aria-label={`Edit ${site.name}`} title="Edit">
            EDIT
          </button>
          <button
            className={`icon-btn danger ${armed ? "armed" : ""}`}
            onClick={() => (armed ? onRemove() : setArmed(true))}
            aria-label={`Remove ${site.name}`}
            title={armed ? "Click again to remove" : "Remove"}
          >
            {armed ? "SURE?" : "×"}
          </button>
        </span>
        <span className="row">
          <button className="icon-btn" disabled={isFirst} onClick={() => onMove(-1)} aria-label="Move left" title="Move left">
            ←
          </button>
          <button className="icon-btn" disabled={isLast} onClick={() => onMove(1)} aria-label="Move right" title="Move right">
            →
          </button>
        </span>
      </span>
    </div>
  );
}
