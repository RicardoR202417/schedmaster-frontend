import { Dumbbell } from "lucide-react";
import type { ExerciseEntry } from "../lib/exerciseSearch";

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function ExerciseCard({ exercise }: { exercise: ExerciseEntry }) {
  return (
    <a
      href={`https://www.google.com/search?q=${encodeURIComponent(exercise.name + " exercise")}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block", width: "136px", flexShrink: 0,
        backgroundColor: "#ffffff", borderRadius: "14px", overflow: "hidden",
        border: "1px solid #e5e7eb", boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
        textDecoration: "none", color: "inherit",
      }}
    >
      <img
        src={exercise.gif}
        alt={exercise.name}
        loading="lazy"
        width={136}
        height={100}
        style={{ width: "100%", height: "100px", objectFit: "cover", display: "block", backgroundColor: "#f3f4f6" }}
      />
      <div style={{ padding: "8px" }}>
        <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "#005c8a", lineHeight: 1.25 }}>
          {capitalize(exercise.name)}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
          <Dumbbell size={11} color="#009ce3" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "10px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {capitalize(exercise.equipment)} · {capitalize(exercise.target)}
          </span>
        </div>
      </div>
    </a>
  );
}
