import SearchInput from './SeachInput'

export default function Banner() {
  return (
    <section className="bg-gradient-to-r from-azul-escuro to-azul-claro w-full h-100 flex flex-col items-center justify-center gap-4">
      <h2 className="text-white text-4xl font-bold">Já sabe por onde começar?</h2>
      <p className="text-white text-sm font-medium">
        Encontre em nossa estante o que precisa para seu desenvolvimento!
      </p>
      <SearchInput />
    </section>
  )
}
