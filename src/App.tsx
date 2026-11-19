import { useState, type FormEvent } from "react";
import { EditBar } from "./components/EditBar";
import { Header } from "./components/Header";
import { SectionPanel } from "./components/SectionPanel";
import { useNow } from "./useNow";
import { useStore } from "./useStore";

function App() {
  const store = useStore();
  const now = useNow();
  const [editing, setEditing] = useState(false);
  const [newSection, setNewSection] = useState<string | null>(null);

  const { sections, settings } = store.data;
  const siteCount = sections.reduce((n, s) => n + s.sites.length, 0);

  function addSection(e: FormEvent) {
    e.preventDefault();
    if (!newSection?.trim()) return;
    store.addSection(newSection);
    setNewSection(null);
  }

  return (
    <div className="lc-paper">
      <div className="page">
        <Header
          now={now}
          place={settings.place}
          editing={editing}
          onToggleEdit={() => {
            setEditing((v) => !v);
            setNewSection(null);
          }}
        />

        {editing && <EditBar store={store} />}

        <div className="sections">
          {sections.map((section, i) => (
            <SectionPanel
              // remount on import/reset so local title state resets too
              key={`${section.id}:${section.title}`}
              section={section}
              editing={editing}
              isFirst={i === 0}
              isLast={i === sections.length - 1}
              store={store}
            />
          ))}

          {editing &&
            (newSection === null ? (
              <button className="add-tile wide" onClick={() => setNewSection("")}>
                + ADD A SECTION
              </button>
            ) : (
              <form className="form" onSubmit={addSection} onKeyDown={(e) => e.key === "Escape" && setNewSection(null)}>
                <input
                  className="input title"
                  autoFocus
                  placeholder="SECTION TITLE"
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                />
                <div className="row">
                  <button className="btn small" type="submit">
                    ADD SECTION
                  </button>
                  <button className="btn small ghost" type="button" onClick={() => setNewSection(null)}>
                    CANCEL
                  </button>
                </div>
              </form>
            ))}
        </div>

        <div className="footer">
          <span>
            {siteCount} SITES · {sections.length} SECTIONS · SAVED IN THIS BROWSER
          </span>
          <span>WEATHER: OPEN-METEO.COM</span>
        </div>
      </div>
    </div>
  );
}

export default App;
