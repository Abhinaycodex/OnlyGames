import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-muted-foreground mt-2">Join the OnlyGames community</p>
      </div>

      <form className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Create a password"
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="creator" className="rounded" />
          <label htmlFor="creator" className="text-sm">
            I want to become a creator
          </label>
        </div>

        <Button className="w-full">Create Account</Button>
      </form>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default Register 