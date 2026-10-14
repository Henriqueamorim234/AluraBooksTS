import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router'
import Header from '../components/Header'
import { fetchBookByWorkId, type BookDetails } from '../services/openLibrary'

function BookCover({ book }: { book: BookDetails }) {
  const [failed, setFailed] = useState(false)

  if (!book.coverUrl || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-azul-escuro px-4 text-center">
        <span className="text-white text-lg font-semibold leading-tight">
          {book.title}
        </span>
      </div>
    )
  }

  return (
    <img
      src={book.coverUrl}
      alt={`Capa do livro ${book.title}`}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}

export default function BookPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  const { workId } = useParams<{ workId: string }>()
  const [book, setBook] = useState<BookDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!workId) {
      return
    }

    const controller = new AbortController()

    async function loadBook(id: string) {
      try {
        setIsLoading(true)
        setHasError(false)
        setBook(null)
        const fetchedBook = await fetchBookByWorkId(id, controller.signal)
        setBook(fetchedBook)
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return
        }
        console.error(error)
        setHasError(true)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadBook(workId)

    return () => controller.abort()
  }, [workId])

  return (
    <>
    
      <Header />
      <main className="w-full bg-[#F2F2F2] min-h-screen">
        <div className="w-full max-w-6xl mx-auto px-8 py-10">
          <Link to="/" className="text-azul-claro text-sm hover:underline">
            ← Voltar para a home
          </Link>

          {isLoading && (
            <p className="text-center text-azul-claro py-16">Carregando livro...</p>
          )}

          {hasError && (
            <p className="text-center text-red-600 py-16">
              Não foi possível carregar este livro. Recarregue a página para tentar de novo.
            </p>
          )}

          {!isLoading && !hasError && book && (
            <article className="mt-6 bg-white rounded-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-8 flex flex-col md:flex-row gap-10">
              <div className="w-56 h-80 shrink-0 mx-auto md:mx-0 rounded-sm overflow-hidden shadow-md bg-gray-100">
                <BookCover book={book} />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-azul-escuro text-3xl font-bold">{book.title}</h1>
                <p className="text-azul-claro text-lg mt-2">{book.author}</p>

                {book.firstPublishDate && (
                  <p className="text-gray-500 text-sm mt-1">
                    Publicado em {book.firstPublishDate}
                  </p>
                )}

                <p className="text-azul-escuro text-base leading-relaxed mt-6 whitespace-pre-line">
                  {book.description ?? 'Este livro ainda não tem descrição na Open Library.'}
                </p>

                {book.subjects.length > 0 && (
                  <ul className="flex flex-wrap gap-2 mt-6">
                    {book.subjects.slice(0, 8).map((subject) => (
                      <li
                        key={subject}
                        className="bg-[#F2F2F2] text-azul-escuro text-xs px-3 py-1 rounded-full"
                      >
                        {subject}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          )}
        </div>
      </main>
    </>
  )
}
