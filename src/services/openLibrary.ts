import axios from 'axios'

export const BOOK_CATEGORIES = [
  'fiction',
  'fantasy',
  'romance',
  'mystery',
  'science_fiction',
] as const

export type BookCategory = (typeof BOOK_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<BookCategory, string> = {
  fiction: 'Ficção',
  fantasy: 'Fantasia',
  romance: 'Romance',
  mystery: 'Mistério',
  science_fiction: 'Ficção Científica',
}

const LAST_CATEGORY_KEY = 'alurabooks:last-category'

export type Book = {
  key: string
  title: string
  author: string
  coverUrl: string | null
}

type OpenLibraryWork = {
  key: string
  title: string
  cover_id?: number | null
  authors?: { name: string }[]
}

type OpenLibrarySubjectResponse = {
  works: OpenLibraryWork[]
}

const openLibraryApi = axios.create({
  baseURL: 'https://openlibrary.org',
  timeout: 12000,
})

let categoryForThisLoad: BookCategory | null = null

export function pickCategoryOnReload(): BookCategory {
  if (categoryForThisLoad) {
    return categoryForThisLoad
  }

  const lastCategory = sessionStorage.getItem(LAST_CATEGORY_KEY)
  const nextOptions = BOOK_CATEGORIES.filter((category) => category !== lastCategory)
  const nextCategory =
    nextOptions[Math.floor(Math.random() * nextOptions.length)] ?? BOOK_CATEGORIES[0]

  sessionStorage.setItem(LAST_CATEGORY_KEY, nextCategory)
  categoryForThisLoad = nextCategory

  return nextCategory
}

function getCoverUrl(coverId?: number | null): string | null {
  if (!coverId) {
    return null
  }

  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
}

export async function fetchBooksByCategory(
  category: BookCategory,
  signal?: AbortSignal
): Promise<Book[]> {
  const { data } = await openLibraryApi.get<OpenLibrarySubjectResponse>(
    `/subjects/${category}.json`,
    {
      params: {
        limit: 24,
      },
      signal,
    }
  )

  return (data.works ?? [])
    .filter((work) => work.title)
    .map((work) => ({
      key: work.key,
      title: work.title,
      author: work.authors?.[0]?.name ?? 'Autor desconhecido',
      coverUrl: getCoverUrl(work.cover_id),
    }))
}
