import type { ReactNode } from "react";
import type { WeatherPlace } from "../types";
import {
  dayOfYear,
  dayPct,
  daysInYear,
  formatDate,
  greeting,
  isoWeek,
  weekPct,
  yearPct,
} from "../useNow";
import { describeWeather, useWeather } from "../useWeather";

const kitchenGif = `${import.meta.env.BASE_URL}rat-cook.gif`;

const pad = (n: number) => String(n).padStart(2, "0");

function Meter({ label, pct, tone }: { label: string; pct: number; tone?: "price" | "copper" }) {
  return (
    <div>
      <div className="meter-head">
        <span>{label}</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <div className="meter-track">
        <div className={`meter-fill ${tone ?? ""}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
      </div>
    </div>
  );
}

export function Header({
  now,
  place,
  editing,
  onToggleEdit,
}: {
  now: Date;
  place: WeatherPlace;
  editing: boolean;
  onToggleEdit: () => void;
}) {
  const { weather, error } = useWeather(place);

  const weatherNow = weather
    ? `${Math.round(weather.temp)}°C · ${describeWeather(weather.code)}`
    : error
      ? "UNAVAILABLE"
      : "LOADING…";

  const weatherDay = weather
    ? `H ${Math.round(weather.max)}° · L ${Math.round(weather.min)}°` +
      (weather.rainChance != null ? ` · RAIN ${weather.rainChance}%` : "") +
      ` · WIND ${Math.round(weather.wind)} MPH`
    : "-";

  const rows: { label: string; value: ReactNode }[] = [
    { label: "DATE", value: formatDate(now) },
    {
      label: "WEEK",
      value: (
        <>
          W{pad(isoWeek(now))} <span className="muted">· DAY {dayOfYear(now)} / {daysInYear(now)}</span>
        </>
      ),
    },
    { label: "WEATHER", value: `${place.name.toUpperCase()} · ${weatherNow}` },
    { label: "TODAY", value: weatherDay },
    {
      label: "SUN",
      value: weather ? `↑ ${weather.sunrise}  ·  ↓ ${weather.sunset}` : "-",
    },
  ];

  return (
    <>
      <div className="masthead">
        <div>
          <div className="wordmark">
            START <em>PAGE</em>
          </div>
          <div className="tagline">{greeting(now)}, TONY · ONE SHEET, EVERY TAB</div>
          <div className="clock">
            {pad(now.getHours())}
            <span className="blink">:</span>
            {pad(now.getMinutes())}
            <span className="secs"> {pad(now.getSeconds())}</span>
          </div>
        </div>

        <div className="masthead-right">
          <div className="kitchen">
            <img src={kitchenGif} alt="A pixel-art rat fetches food from the fridge, chops it and fries it" />
          </div>
          <div className="titleblock">
            {rows.map((r) => (
              <div className="titleblock-row" key={r.label}>
                <span>{r.label}</span>
                <span>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rule" />

      <div className="meters">
        <Meter label="DAY" pct={dayPct(now)} tone="price" />
        <Meter label="WEEK" pct={weekPct(now)} />
        <Meter label="YEAR" pct={yearPct(now)} tone="copper" />
        <button className="btn" onClick={onToggleEdit}>
          {editing ? "DONE EDITING" : "EDIT LINKS"}
        </button>
      </div>
    </>
  );
}
