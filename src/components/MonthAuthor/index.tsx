export default function MonthAuthor() {
  return (
    <article className="w-full xl:max-w-md bg-white rounded-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-6">
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <img src="/Estrelinhas.svg" alt="Estrelas" className="w-16 h-16 m-0" />
            <h3 className="text-amarelo-separador text-sm font-bold">Autora do Mês</h3>
          </div>
          <h2 className="text-azul-escuro text-xl font-bold mt-3 mb-2">
            Juliana Agarikov
          </h2>
          <p className="text-azul-escuro text-sm leading-relaxed">
            Juliana Agarikov é uma escritora e jornalista brasileira.
          </p>
        </div>
        <img
          src="/Perfil-escritora 1-1.png"
          alt="Foto da autora do mês Juliana Agarikov"
          className="w-28 h-28 object-cover shrink-0"
        />
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Adicionar aos favoritos">
            <img src="/Favoritos.svg" alt="" className="w-8 h-8" />
          </button>
          <button type="button" aria-label="Adicionar à sacola">
            <img src="/Compras.svg" alt="" className="w-8 h-8" />
          </button>
        </div>
        <a
          href="#"
          className="bg-amarelo-separador text-white font-bold text-sm px-8 py-3"
        >
          Saiba mais
        </a>
      </div>
    </article>
  )
}
