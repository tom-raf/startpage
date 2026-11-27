import { useState } from "react";
import type { Section } from "../types";
import type { Store } from "../useStore";
import { SiteCard } from "./SiteCard";
import { SiteForm } from "./SiteForm";

export function SectionPanel({
  section,
  editing,
  isFirst,
  isLast,
  store,
}: {
  section: Section;
  editing: boolean;
  isFirst: boolean;
  isLast: boolean;
  store: Store;
}) {
  // which card shows a form: a site id, "new", or nothing
  const [formFor, setFormFor] = useState<string | null>(null);
  const [title, setTitle] = useState(section.title);
  const [armed, setArmed] = useState(false);

  const showForm = editing ? formFor : null;

  return (
    <div className="panel">
      <div className="panel-head">
        {editing ? (
          <>
            <input
              className="input title"
              value={title}
              aria-label="Section title"
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => store.renameSection(section.id, title)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
            <span className="spacer" />
            <button className="icon-btn" disabled={isFirst} onClick={() => store.moveSection(section.id, -1)} title="Move up">
              ↑ UP
            </button>
            <button className="icon-btn" disabled={isLast} onClick={() => store.moveSection(section.id, 1)} title="Move down">
              ↓ DOWN
            </button>
            <button
              className={`icon-btn danger ${armed ? "armed" : ""}`}
              onClick={() => (armed ? store.removeSection(section.id) : setArmed(true))}
              onMouseLeave={() => setArmed(false)}
            >
              {armed ? "CONFIRM DELETE" : "DELETE SECTION"}
            </button>
          </>
        ) : (
          <>
            <span>{section.title}</span>
            <span className="count">· {section.sites.length}</span>
          </>
        )}
      </div>

      <div className="panel-body">
        <div className="cards">
          {section.sites.map((site, i) =>
            showForm === site.id ? (
              <SiteForm
                key={site.id}
                initial={site}
                onCancel={() => setFormFor(null)}
                onSave={(next) => {
                  store.updateSite(section.id, { ...next, id: site.id });
                  setFormFor(null);
                }}
              />
            ) : (
              <SiteCard
                key={site.id}
                site={site}
                editing={editing}
                isFirst={i === 0}
                isLast={i === section.sites.length - 1}
                onEdit={() => setFormFor(site.id)}
                onRemove={() => store.removeSite(section.id, site.id)}
                onMove={(dir) => store.moveSite(section.id, site.id, dir)}
              />
            ),
          )}

          {editing &&
            (showForm === "new" ? (
              <SiteForm
                onCancel={() => setFormFor(null)}
                onSave={(site) => {
                  store.addSite(section.id, site);
                  setFormFor(null);
                }}
              />
            ) : (
              <button className="add-tile" onClick={() => setFormFor("new")}>
                + ADD A SITE
              </button>
            ))}
          {!editing && section.sites.length === 0 && <div className="empty">NO SITES YET · PRESS EDIT LINKS TO ADD ONE</div>}
        </div>
      </div>
    </div>
  );
}
