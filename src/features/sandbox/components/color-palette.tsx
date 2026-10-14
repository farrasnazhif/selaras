import { SANDBOX_COLORS } from "../constants/colors";

export function ColorPalette() {
  return (
    <ul aria-label="Color palette" className="grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
      {SANDBOX_COLORS.map((color) => (
        <li key={color}>
          <div aria-hidden="true" className="h-16 rounded-control border border-line" style={{ backgroundColor: color }} />
          <p className="mt-2 text-center text-xs font-semibold">{color}</p>
        </li>
      ))}
    </ul>
  );
}
