import { useState } from 'react'
import Header from './components/Header'
import Banner from './components/Banner'
import SectionSeparator from './components/SectionSeparator'
import BooksSwiper from './components/BooksSwiper'
import FeaturedBookCard from './components/FeaturedBookCard'
import MonthAuthor from './components/MonthAuthor'
import { pickCategoriesOnReload } from './services/openLibrary'

function App() {
  const [categories] = useState(() => pickCategoriesOnReload())

  return (
    <>
      <Header />
      <Banner />
      <SectionSeparator text="ÚLTIMOS LANÇAMENTOS" />
      <section className="w-full bg-[#F2F2F2]">
        <div className="w-full max-w-6xl mx-auto px-8 py-10 flex flex-col xl:flex-row xl:items-center gap-10">
          <div className="w-full xl:flex-1 min-w-0">
            <BooksSwiper category={categories[0]} />
          </div>
          <FeaturedBookCard />
        </div>
      </section>
      <SectionSeparator text="MAIS VENDIDOS" />
      <section className="w-full bg-[#F2F2F2]">
        <div className="w-full max-w-6xl mx-auto px-8 py-10 flex flex-col xl:flex-row xl:items-center gap-10">
          <div className="w-full xl:flex-1 min-w-0">
            <BooksSwiper category={categories[1]} />
          </div>
          <MonthAuthor />
        </div>
      </section>
    </>
  )
}

export default App
