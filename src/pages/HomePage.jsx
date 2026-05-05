import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Fleekr
        </h1>
        <p className="text-slate-400 text-xl mb-8">Welcome to the platform</p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-purple-500 hover:bg-purple-500/20 text-white rounded-lg font-medium transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
