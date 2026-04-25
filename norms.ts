// HS Normen (Hauptschule)
export const NORM_SE_HS: number[][] = [
  [21.33, 25.33, 29.33, 33.32, 37.32], // Arbeitsverhalten
  [20.87, 24.95, 29.03, 33.13, 37.18], // Lernverhalten
  [17.93, 21.37, 24.80, 28.23, 31.67], // Sozialverhalten
  [13.98, 17.71, 21.44, 25.17, 28.90], // Fachkompetenz
  [24.60, 28.55, 33.04, 37.53, 42.01], // Personale Kompetenz
  [15.53, 18.97, 22.40, 25.83, 29.27], // Methodenkompetenz
];

export const NORM_FE_HS: number[][] = [
  [12.66, 18.16, 23.66, 29.16, 34.66],
  [13.33, 18.42, 23.51, 28.60, 33.69],
  [10.75, 15.41, 20.07, 24.73, 29.39],
  [14.22, 15.30, 16.38, 17.46, 18.54],
  [14.12, 20.21, 26.30, 32.39, 38.48],
  [10.53, 14.51, 18.49, 22.47, 26.45],
];

// FS Normen (Förderschule)
export const NORM_SE_FS: number[][] = [
  [17.54, 24.03, 30.53, 37.02, 43.51],
  [17.80, 24.26, 30.73, 37.19, 43.65],
  [18.03, 22.41, 26.79, 31.17, 35.55],
  [14.28, 15.55, 16.83, 18.10, 19.37],
  [20.69, 27.49, 34.29, 41.09, 47.89],
  [12.44, 18.06, 23.68, 29.29, 34.91],
];

export const NORM_FE_FS: number[][] = [
  [15.30, 19.79, 24.28, 28.77, 33.26],
  [14.63, 18.94, 23.25, 27.56, 31.87],
  [14.62, 17.81, 21.00, 24.19, 27.38],
  [15.00, 15.55, 16.10, 16.65, 17.20],
  [18.44, 22.61, 26.78, 30.95, 35.12],
  [9.79, 13.97, 18.15, 22.33, 26.51],
];

export const KOMPETENZEN = [
  'Arbeitsverhalten',
  'Lernverhalten',
  'Sozialverhalten',
  'Fachkompetenz',
  'Personale Kompetenz',
  'Methodenkompetenz',
];

export const ITEMS = [
  'Zuverlässigkeit', 'Arbeitstempo', 'Arbeitsplanung', 'Organisationsfähigkeit',
  'Geschicklichkeit', 'Ordnung', 'Sorgfalt', 'Kreativität', 'Problemlösungsfähigkeit',
  'Abstraktionsvermögen', 'Selbstständigkeit', 'Belastbarkeit', 'Konzentrationsfähigkeit',
  'Verantwortungsbewusstsein', 'Eigeninitiative', 'Leistungsbereitschaft', 'Auffassungsgabe',
  'Merkfähigkeit', 'Motivationsfähigkeit', 'Reflektionsfähigkeit', 'Teamfähigkeit',
  'Hilfsbereitschaft', 'Kontaktfähigkeit', 'Respektvoller Umgang', 'Kommunikationsfähigkeit',
  'Einfühlungsvermögen', 'Konfliktfähigkeit', 'Kritikfähigkeit', 'Schreiben', 'Lesen',
  'Mathematik', 'Naturwissenschaft', 'Fremdsprachen', 'Präsentationsfähigkeit',
  'PC Kenntnisse', 'Fächerübergreifendes Denken',
];

export const RATING_DESCRIPTIONS: Record<number, string> = {
  1: 'trifft nicht zu',
  2: 'trifft teilweise zu',
  3: 'trifft zu',
  4: 'trifft voll zu',
};