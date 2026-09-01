import { useEffect, useState } from 'react'
import axios from 'axios'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  CATEGORY_LABELS,
  fetchBooksByCategory,
  pickCategoryOnReload,
  type Book,
  type BookCategory,
} from '../../services/openLibrary'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function BookCover({ book }: { book: Book }) {
  const [failed, setFailed] = useState(false)

  if (!book.coverUrl || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-azul-escuro px-3 text-center">
        <span className="text-white text-sm font-semibold leading-tight">{book.title}</span>
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

export default function BooksSwiper() {
  const [category] = useState<BookCategory>(() => pickCategoryOnReload())
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadBooks() {
      try {
        setIsLoading(true)
        setHasError(false)
        const fetchedBooks = await fetchBooksByCategory(category, controller.signal)
        setBooks(fetchedBooks)
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

    loadBooks()

    return () => controller.abort()
  }, [category])

  return (
    <section className="w-full max-w-6xl mx-auto px-8 pb-12">
      <p className="text-center text-azul-escuro text-sm font-medium mb-6">
        Categoria desta visita: {CATEGORY_LABELS[category]}
      </p>

      {isLoading && (
        <p className="text-center text-azul-claro py-16">Carregando livros...</p>
      )}

      {hasError && (
        <p className="text-center text-red-600 py-16">
          Não foi possível carregar os livros. Recarregue a página para tentar de novo.
        </p>
      )}

      {!isLoading && !hasError && books.length === 0 && (
        <p className="text-center text-azul-claro py-16">
          Nenhum livro encontrado nesta categoria.
        </p>
      )}

      {!isLoading && !hasError && books.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className="books-swiper pb-12!"
        >
          {books.map((book) => (
            <SwiperSlide key={book.key}>
              <article className="flex flex-col items-center gap-3">
                <div className="w-36 h-52 rounded-sm overflow-hidden shadow-md bg-gray-100">
                  <BookCover book={book} />
                </div>
                <h3 className="text-azul-escuro text-sm font-bold text-center line-clamp-2 min-h-10">
                  {book.title}
                </h3>
                <p className="text-azul-claro text-xs text-center line-clamp-1">{book.author}</p>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}
