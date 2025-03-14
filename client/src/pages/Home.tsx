import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Connect with Pro Gamers
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn from the best, watch exclusive content, and get personalized gaming sessions with your favorite creators.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/explore">
            <Button size="lg" type="button">Explore Creators</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg" type="button">Become a Creator</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
          <p className="text-muted-foreground">
            Access exclusive gaming tutorials, tips, and strategies from professional players.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">1-on-1 Sessions</h3>
          <p className="text-muted-foreground">
            Book personalized gaming sessions with your favorite creators for direct coaching.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Community</h3>
          <p className="text-muted-foreground">
            Join a thriving community of gamers and creators, share experiences, and grow together.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home 