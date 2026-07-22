export type ExerciseEntry = {
  id: string;
  name: string;
  slug: string;
  bodyPart: string;
  equipment: string;
  target: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  image: string;
  gif: string;
  instructionsEs: string;
  instructionsEn: string;
  keywords: string[];
};

let cachedIndex: ExerciseEntry[] | null = null;
let pendingLoad: Promise<ExerciseEntry[]> | null = null;

export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function loadExerciseIndex(): Promise<ExerciseEntry[]> {
  if (cachedIndex) return cachedIndex;
  if (pendingLoad) return pendingLoad;

  pendingLoad = fetch("/exercises-dataset/index.json")
    .then((res) => (res.ok ? res.json() : []))
    .then((data: ExerciseEntry[]) => {
      cachedIndex = data;
      return data;
    })
    .catch(() => {
      cachedIndex = [];
      return [];
    });

  return pendingLoad;
}

// Detecta menciones de ejercicios del dataset dentro de un texto libre (respuesta del bot).
// Solo considera nombres con al menos 2 palabras o 5+ caracteres para evitar falsos positivos
// (ej. "row" o "curl" sueltos no disparan una tarjeta, pero "barbell curl" si).
export function findExercisesInText(text: string, index: ExerciseEntry[], maxResults = 2): ExerciseEntry[] {
  if (!text || index.length === 0) return [];

  const normalizedText = normalize(text);
  if (!normalizedText) return [];

  const matches: { entry: ExerciseEntry; specificity: number }[] = [];

  for (const entry of index) {
    const normalizedName = normalize(entry.name);
    const isSpecificEnough = normalizedName.includes(" ") || normalizedName.length >= 5;
    if (!isSpecificEnough) continue;

    if (normalizedText.includes(normalizedName)) {
      matches.push({ entry, specificity: normalizedName.length });
    }
  }

  matches.sort((a, b) => b.specificity - a.specificity);

  const seen = new Set<string>();
  const result: ExerciseEntry[] = [];
  for (const match of matches) {
    if (seen.has(match.entry.id)) continue;
    seen.add(match.entry.id);
    result.push(match.entry);
    if (result.length >= maxResults) break;
  }

  return result;
}
