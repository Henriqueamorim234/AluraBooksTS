import Header from './components/Header'
import Banner from './components/Banner'
import SectionSeparator from './components/SectionSeparator'
import BooksSwiper from './components/BooksSwiper'

function App() {
  return (
    <>
      <Header />
      <Banner />
      <SectionSeparator text="ÚLTIMOS LANÇAMENTOS" />
      <BooksSwiper />
    </>
  )
}

export default App
