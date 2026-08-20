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
      className="gx-chat-exercise-card"
    >
      <div className="gx-chat-exercise-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={exercise.gif} alt={exercise.name} loading="lazy" width={128} height={88} />
      </div>
      <div className="gx-chat-exercise-body">
        <p>{capitalize(exercise.name)}</p>
        <div className="gx-chat-exercise-meta">
          <Dumbbell size={10} style={{ flexShrink: 0 }} />
          <span>{capitalize(exercise.equipment)} · {capitalize(exercise.target)}</span>
        </div>
      </div>
    </a>
  );
}
