// Descarga el dataset publico de ejercicios (hasaneyldrm/exercises-dataset) hacia
// /public/exercises-dataset y genera un indice liviano para el buscador del ChatBot.
// Uso: npm run fetch:exercises

import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public", "exercises-dataset");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");
const VIDEOS_DIR = path.join(PUBLIC_DIR, "videos");

const RAW_BASE = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/";
const EXERCISES_JSON_URL = RAW_BASE + "data/exercises.json";

const CONCURRENCY = 12;
const MAX_RETRIES = 3;

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fileExistsWithSize(filePath) {
  try {
    const s = await stat(filePath);
    return s.size > 0;
  } catch {
    return false;
  }
}

async function downloadTo(url, destPath) {
  if (await fileExistsWithSize(destPath)) return "skipped";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      await writeFile(destPath, buffer);
      return "downloaded";
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        console.warn(`  ! Fallo definitivo: ${url} -> ${err.message}`);
        return "failed";
      }
    }
  }
  return "failed";
}

async function runPool(items, worker, concurrency) {
  let cursor = 0;
  let done = 0;
  const results = new Array(items.length);

  async function next() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
      done++;
      if (done % 100 === 0 || done === items.length) {
        process.stdout.write(`\r  Progreso: ${done}/${items.length}`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, next);
  await Promise.all(workers);
  process.stdout.write("\n");
  return results;
}

async function main() {
  console.log("SchedMaster · Sincronizacion del dataset de ejercicios");
  console.log("Fuente: github.com/hasaneyldrm/exercises-dataset\n");

  await mkdir(IMAGES_DIR, { recursive: true });
  await mkdir(VIDEOS_DIR, { recursive: true });

  console.log("1/3 Descargando data/exercises.json (~17 MB)...");
  const res = await fetch(EXERCISES_JSON_URL);
  if (!res.ok) throw new Error(`No se pudo descargar exercises.json (HTTP ${res.status})`);
  const exercises = await res.json();
  console.log(`   -> ${exercises.length} ejercicios encontrados.\n`);

  console.log(`2/3 Descargando miniaturas (.jpg) y animaciones (.gif) [concurrencia: ${CONCURRENCY}]...`);
  console.log("   Esto puede tardar varios minutos (~130 MB en total). Los archivos ya existentes se omiten.\n");

  const mediaJobs = exercises.flatMap((ex) => [
    { url: RAW_BASE + ex.image, dest: path.join(PUBLIC_DIR, ...ex.image.split("/")) },
    { url: RAW_BASE + ex.gif_url, dest: path.join(PUBLIC_DIR, ...ex.gif_url.split("/")) },
  ]);

  const outcomes = await runPool(mediaJobs, (job) => downloadTo(job.url, job.dest), CONCURRENCY);
  const summary = outcomes.reduce(
    (acc, o) => ({ ...acc, [o]: (acc[o] || 0) + 1 }),
    { downloaded: 0, skipped: 0, failed: 0 }
  );
  console.log(
    `   -> descargados: ${summary.downloaded} | ya existian: ${summary.skipped} | fallidos: ${summary.failed}\n`
  );

  console.log("3/3 Generando indice de busqueda (index.json)...");
  const index = exercises.map((ex) => {
    const keywords = new Set([
      ...normalize(ex.name).split(" "),
      ...normalize(ex.target).split(" "),
      ...normalize(ex.equipment).split(" "),
      ...normalize(ex.muscle_group).split(" "),
      ...normalize(ex.body_part).split(" "),
    ]);

    return {
      id: ex.id,
      name: ex.name,
      slug: normalize(ex.name).replace(/\s+/g, "-"),
      bodyPart: ex.body_part,
      equipment: ex.equipment,
      target: ex.target,
      muscleGroup: ex.muscle_group,
      secondaryMuscles: ex.secondary_muscles,
      image: `/exercises-dataset/${ex.image}`,
      gif: `/exercises-dataset/${ex.gif_url}`,
      instructionsEs: ex.instructions?.es ?? "",
      instructionsEn: ex.instructions?.en ?? "",
      keywords: Array.from(keywords).filter((k) => k.length > 2),
    };
  });

  await writeFile(path.join(PUBLIC_DIR, "index.json"), JSON.stringify(index));
  console.log(`   -> public/exercises-dataset/index.json generado (${index.length} ejercicios).\n`);

  console.log("Listo. El dataset esta disponible en /public/exercises-dataset");
  if (summary.failed > 0) {
    console.log(`Nota: ${summary.failed} archivos fallaron. Vuelve a correr "npm run fetch:exercises" para reintentarlos.`);
  }
}

main().catch((err) => {
  console.error("\nError durante la sincronizacion del dataset:", err);
  process.exit(1);
});
