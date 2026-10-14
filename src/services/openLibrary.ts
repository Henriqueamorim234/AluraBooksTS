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

export type BookDetails = Book & {
  description: string | null
  firstPublishDate: string | null
  subjects: string[]
}

type OpenLibraryWorkDetails = {
  key: string
  title: string
  description?: string | { type: string; value: string }
  covers?: number[]
  authors?: { author: { key: string } }[]
  subjects?: string[]
  first_publish_date?: string
}

type OpenLibraryAuthor = {
  name?: string
  personal_name?: string
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

/**
 * Converte a key da Open Library (`/works/OL123W`) no id usado na rota (`OL123W`).
 */
export function getWorkId(bookKey: string): string {
  return bookKey.replace(/^\/works\//, '')
}

function getDescription(
  description: OpenLibraryWorkDetails['description']
): string | null {
  if (!description) {
    return null
  }

  return typeof description === 'string' ? description : description.value
}

async function fetchAuthorName(
  authorKey: string,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const { data } = await openLibraryApi.get<OpenLibraryAuthor>(
      `${authorKey}.json`,
      { signal }
    )
    return data.name ?? data.personal_name ?? null
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error
    }
    return null
  }
}

export async function fetchBookByWorkId(
  workId: string,
  signal?: AbortSignal
): Promise<BookDetails> {
  const { data } = await openLibraryApi.get<OpenLibraryWorkDetails>(
    `/works/${workId}.json`,
    { signal }
  )

  const firstAuthorKey = data.authors?.[0]?.author?.key
  const authorName = firstAuthorKey
    ? await fetchAuthorName(firstAuthorKey, signal)
    : null

  return {
    key: data.key,
    title: data.title,
    author: authorName ?? 'Autor desconhecido',
    coverUrl: getCoverUrl(data.covers?.find((id) => id > 0)),
    description: getDescription(data.description),
    firstPublishDate: data.first_publish_date ?? null,
    subjects: data.subjects ?? [],
  }
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
