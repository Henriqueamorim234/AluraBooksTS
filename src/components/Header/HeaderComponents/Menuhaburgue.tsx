import { useState } from 'react'

const links: string[] = [
  'PROGRAMAÇÃO',
  'FRONT - END',
  'INFRAESTRUTURA',
  'BUSINESS',
  'DESIGN & UX',
]

export default function MenuHamburgue() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative">
      <label
        htmlFor="menu-hamburgue"
        className="w-10 h-10 cursor-pointer hover:bg-gray-200 flex items-center justify-center bg-[url('/Menu.svg')] bg-no-repeat bg-center"
      >
        <input
          type="checkbox"
          id="menu-hamburgue"
          className="hidden"
          onChange={() => setIsOpen(!isOpen)}
        />
      </label>
      {isOpen && (
        <ul className="absolute top-full left-0 z-10 w-40 bg-gradient-to-r from-azul-escuro to-azul-claro rounded-md shadow-md">
          {links.map((link) => (
            <li
              key={link}
              className="text-white text-sm font-medium p-2 border-b border-white last:border-b-0 "
            >
              <a href={link} className="hover:text-gray-200">
                {link}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
