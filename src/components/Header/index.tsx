import Favicons from './HeaderComponents/Favicons'
import Links from './HeaderComponents/Links'
import Logo from './HeaderComponents/Logo'

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <Links />
      <div className="flex items-center gap-4">
        <Logo />
        <Favicons />
      </div>
    </header>
  )
}
