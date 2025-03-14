import { Link } from 'react-router-dom'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          OnlyGames
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/explore">
            <Button variant="ghost">Explore</Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 