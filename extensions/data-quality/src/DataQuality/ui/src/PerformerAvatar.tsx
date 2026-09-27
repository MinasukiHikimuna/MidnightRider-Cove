export function PerformerAvatar({
  performer,
}: {
  performer: { id: number; name: string };
}) {
  return (
    <span className="dq-performer-avatar" aria-hidden="true">
      <span>
        {performer.name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase() || "?"}
      </span>
      <img
        key={performer.id}
        src={`/api/performers/${performer.id}/image?max=64`}
        alt=""
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </span>
  );
}
