import type { TaskContent } from "@/features/sesi/types/schedule";

function Picture({ shape }: { shape: number }) {
  return <svg width="52" height="52" viewBox="0 0 52 52" role="img" aria-label={["Lingkaran", "Segitiga", "Persegi"][shape]}>
    {shape === 0 ? <circle cx="26" cy="26" r="18" fill="none" stroke="currentColor" strokeWidth="2" /> : shape === 1 ? <path d="M26 6 47 44H5Z" fill="none" stroke="currentColor" strokeWidth="2" /> : <rect x="8" y="8" width="36" height="36" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />}
  </svg>;
}
function Dots({ count }: { count: number }) {
  return <svg width="90" height="52" viewBox="0 0 90 52" role="img" aria-label={`${count} titik`}>{Array.from({ length: count }, (_, index) => <circle key={index} cx={12 + (index % 3) * 27} cy={10 + Math.floor(index / 3) * 16} r="5" fill="currentColor" />)}</svg>;
}
export function TaskExercise({ content }: { content: TaskContent }) {
  if (content.kind === "written") return <div className="space-y-ui-sm">
    {content.passage && <p className="whitespace-pre-wrap text-base leading-relaxed">{content.passage}</p>}
    <ol className="list-decimal space-y-ui-sm pl-5">{content.questions.map((question, index) => <li key={index} className="break-words whitespace-pre-wrap text-base leading-relaxed">{question}<div aria-hidden="true" className="mt-2 h-8 border-b border-current opacity-40" /></li>)}</ol>
  </div>;
  const left = content.values ?? (content.kind === "picture-match" ? [0, 1, 2] : content.kind === "count-match" ? [1, 3, 2] : [2, 5, 8]);
  const right = content.values ? [...left.slice(1), left[0]] : content.kind === "picture-match" ? [2, 0, 1] : content.kind === "count-match" ? [2, 1, 3] : [5, 8, 2];
  return <div className="worksheet-visual mx-auto max-w-md space-y-ui-sm text-black">
    <div className="mb-ui-sm flex items-center justify-center gap-2" aria-label="Hubungkan pasangan yang sama"><Picture shape={0} /><span aria-hidden="true" className="w-20 border-t-2 border-current" /><Picture shape={0} /></div>
    {left.map((value, index) => <div key={index} className="flex min-h-16 items-center justify-between gap-ui-md">
      {content.kind === "picture-match" ? <Picture shape={value} /> : <Dots count={value} />}
      <span aria-hidden="true" className="flex-1" />
      {content.kind === "picture-match" ? <Picture shape={right[index]} /> : content.kind === "count-match" ? <Dots count={right[index]} /> : <span className="w-20 text-center text-[32px] font-bold tabular-nums">{right[index]}</span>}
    </div>)}
  </div>;
}
