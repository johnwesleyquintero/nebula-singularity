export interface Marketplace {
  id: string
  name: string
}

export const marketplaces: Marketplace[] = [
  { id: "us", name: "United States (US)" },
  { id: "ca", name: "Canada (CA)" },
  { id: "uk", name: "United Kingdom (UK)" },
  { id: "de", name: "Germany (DE)" },
  { id: "fr", name: "France (FR)" },
  { id: "it", name: "Italy (IT)" }
]