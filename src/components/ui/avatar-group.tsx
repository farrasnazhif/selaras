import { Avatar } from "./avatar";

export function AvatarGroup({
  people,
  max = 4,
}: {
  people: { name: string; src?: string }[];
  max?: number;
}) {
  const limit = Math.max(1, max);
  return (
    <div
      className="ui-avatar-group"
      role="group"
      aria-label={`${people.length} people`}
    >
      {people.slice(0, limit).map((person, index) => (
        <Avatar key={index} {...person} />
      ))}
      {people.length > limit && (
        <span
          className="ui-avatar"
          aria-label={`${people.length - limit} more people`}
        >
          +{people.length - limit}
        </span>
      )}
    </div>
  );
}
