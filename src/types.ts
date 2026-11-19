export interface Site {
  id: string;
  name: string;
  url: string;
  note?: string;
}

export interface Section {
  id: string;
  title: string;
  sites: Site[];
}

export interface WeatherPlace {
  name: string;
  lat: number;
  lon: number;
}

export interface Settings {
  place: WeatherPlace;
}

export interface StoreData {
  version: 1;
  sections: Section[];
  settings: Settings;
}

export interface Weather {
  fetchedAt: number;
  lat: number;
  lon: number;
  temp: number;
  code: number;
  wind: number;
  max: number;
  min: number;
  rainChance: number | null;
  sunrise: string;
  sunset: string;
}
