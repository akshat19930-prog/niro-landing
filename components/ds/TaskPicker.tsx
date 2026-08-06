import { Icon, type IconName } from "./Icon";

export type TaskDef = { id: string; icon: IconName; label: string; note: string };

/** Task-picker — single-select radio cards. "What would you hand off first?" */
export function TaskPicker({
  tasks,
  value,
  onChange,
}: {
  tasks: TaskDef[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <div role="radiogroup" style={{ display: "grid", gap: 12 }}>
      {tasks.map((t) => {
        const on = value === t.id;
        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(t.id)}
            className={`task-card ${on ? "task-card-on" : ""}`}
          >
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: on ? "var(--brand)" : "var(--bg-inset)",
                color: on ? "var(--ivory)" : "var(--brand)",
                transition: "all var(--dur-base) var(--ease-calm)",
              }}
            >
              <Icon name={t.icon} size={24} />
            </span>
            <span style={{ flex: 1 }}>
              <span
                style={{
                  display: "block",
                  fontSize: "var(--text-md)",
                  fontWeight: 600,
                  color: "var(--text-strong)",
                }}
              >
                {t.label}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "var(--text-sm)",
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                {t.note}
              </span>
            </span>
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                flexShrink: 0,
                border: `2px solid ${on ? "var(--brand)" : "var(--border-strong)"}`,
                background: on ? "var(--brand)" : "transparent",
                color: "var(--ivory)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all var(--dur-base) var(--ease-calm)",
              }}
            >
              {on && <Icon name="check" size={14} strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
