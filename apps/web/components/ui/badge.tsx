/** Etiqueta de estado con color a medida (hex desde los tokens). */
export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-footnote font-medium"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      {label}
    </span>
  );
}
