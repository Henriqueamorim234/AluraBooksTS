export default function SectionSeparator({ text }: { text: string }) {
  return (
    <div className="w-full h-10 flex items-center justify-center my-4">
      <h2 className="text-2xl font-bold text-amarelo-separador">{text}</h2>
    </div>
  )
}
