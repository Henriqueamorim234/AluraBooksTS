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

const LAST_CATEGORIES_KEY = 'alurabooks:last-categories'

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

let categoriesForThisLoad: [BookCategory, BookCategory] | null = null

function isBookCategory(value: string): value is BookCategory {
  return (BOOK_CATEGORIES as readonly string[]).includes(value)
}

function pickTwoDistinct(options: readonly BookCategory[]): [BookCategory, BookCategory] {
  const firstIndex = Math.floor(Math.random() * options.length)
  let secondIndex = Math.floor(Math.random() * (options.length - 1))
  if (secondIndex >= firstIndex) {
    secondIndex += 1
  }

  return [options[firstIndex], options[secondIndex]]
}

export function pickCategoriesOnReload(): [BookCategory, BookCategory] {
  if (categoriesForThisLoad) {
    return categoriesForThisLoad
  }

  const previous = (sessionStorage.getItem(LAST_CATEGORIES_KEY) ?? '')
    .split(',')
    .filter(isBookCategory)
  const unused = BOOK_CATEGORIES.filter((category) => !previous.includes(category))
  const pool = unused.length >= 2 ? unused : BOOK_CATEGORIES
  const nextCategories = pickTwoDistinct(pool)

  sessionStorage.setItem(LAST_CATEGORIES_KEY, nextCategories.join(','))
  categoriesForThisLoad = nextCategories

  return nextCategories
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
        limit: 10,
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
