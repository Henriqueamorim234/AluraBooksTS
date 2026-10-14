import { Link } from 'react-router'

export default function Logo() {
  return (
    <Link to="/" className="flex items-center justify-center">
      <img src="/Logo.png" alt="Alura Books" />
      <strong className="text-2xl font-bold">Alura</strong>
      <h1 className="text-xl text-gray-500">Books</h1>
    </Link>
  )
}
