import exerciseLibraryData from "./exerciseLibrary.json";

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

type LibraryExercise = {
  id: string;
  name: string;
  category: string;
  equipment: string;
  target: string;
  muscleGroup: string;
  gif: string;
  image: string;
  steps: string[];
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

function slugify(name: string): string {
  return normalize(name).replace(/\s+/g, "-");
}

// Los 57 ejercicios curados en exerciseLibrary.json se versionan directo en git
// (a diferencia del dataset completo de 1,300+, que depende de "npm run fetch:exercises"
// y puede no existir en el entorno de despliegue). Por eso son la fuente confiable
// para las tarjetas del ChatBot: siempre estan disponibles, sin fetch ni build extra.
export const CURATED_EXERCISES: ExerciseEntry[] = (exerciseLibraryData as LibraryExercise[]).map((ex) => ({
  id: ex.id,
  name: ex.name,
  slug: slugify(ex.name),
  bodyPart: ex.category,
  equipment: ex.equipment,
  target: ex.target,
  muscleGroup: ex.muscleGroup,
  secondaryMuscles: [],
  image: ex.image,
  gif: ex.gif,
  instructionsEs: ex.steps.join(" "),
  instructionsEn: "",
  keywords: [
    ...normalize(ex.name).split(" "),
    ...normalize(ex.target).split(" "),
    ...normalize(ex.muscleGroup).split(" "),
    ...normalize(ex.category).split(" "),
  ],
}));

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

// Etiqueta invisible que el prompt de n8n puede incluir en su respuesta para
// pedir explicitamente una tarjeta de ejercicio, en vez de depender de que el
// nombre aparezca "por casualidad" en el texto libre. Formato: [[ejercicio:slug]]
// (ej. [[ejercicio:sentadilla-con-barra]]). Ver CURATED_EXERCISES para los slugs validos.
const EXERCISE_TAG_REGEX = /\s?\[\[\s*ejercicio\s*:\s*([^\]]+?)\s*\]\]/gi;

function resolveExerciseSlug(raw: string, extraIndex: ExerciseEntry[]): ExerciseEntry | null {
  const target = slugify(raw);
  if (!target) return null;
  const targetSpaced = target.replace(/-/g, " ");

  // La libreria curada (siempre disponible) se revisa antes que el dataset completo
  // (que puede no estar presente si no se corrio "npm run fetch:exercises").
  for (const pool of [CURATED_EXERCISES, extraIndex]) {
    let match = pool.find((e) => e.slug === target);
    if (match) return match;
    match = pool.find((e) => normalize(e.name) === targetSpaced);
    if (match) return match;
    match = pool.find((e) => e.slug.includes(target) || target.includes(e.slug));
    if (match) return match;
  }
  return null;
}

// Quita las etiquetas [[ejercicio:...]] del texto (el usuario nunca las ve) y
// devuelve los ejercicios que si se lograron resolver, para renderizar como tarjetas.
export function extractExerciseTags(
  text: string,
  extraIndex: ExerciseEntry[] = []
): { cleanText: string; exercises: ExerciseEntry[] } {
  if (!text) return { cleanText: text, exercises: [] };

  const found: ExerciseEntry[] = [];
  const seen = new Set<string>();

  const cleanText = text
    .replace(EXERCISE_TAG_REGEX, (_, rawSlug: string) => {
      const match = resolveExerciseSlug(rawSlug, extraIndex);
      if (match && !seen.has(match.id)) {
        seen.add(match.id);
        found.push(match);
      }
      return "";
    })
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n[ \t]*\n[ \t]*\n+/g, "\n\n")
    .trim();

  return { cleanText, exercises: found };
}
