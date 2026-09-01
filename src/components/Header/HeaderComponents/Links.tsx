import MenuHamburgue from './Menuhaburgue'

export default function Links() {
  return (
    <div className="flex items-center gap-4">
      <MenuHamburgue />
      <p className="text-black text-sm font-medium">FAVORITOS</p>
      <p className="text-black text-sm font-medium">MINHA ESTANTE</p>
    </div>
  )
}
