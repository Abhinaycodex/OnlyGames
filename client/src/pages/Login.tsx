import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { login, userLogin, creatorLogin } from '../lib/api'
import { useToast } from '../components/ui/use-toast'

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loginType, setLoginType] = useState<'user' | 'creator'>('user')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      console.log(`Attempting ${loginType} login with email:`, formData.email);
      
      let response;
      
      if (loginType === 'creator') {
        response = await creatorLogin(formData.email, formData.password);
        toast({
          title: "Creator Login Success",
          description: "Welcome to your creator dashboard"
        });
      } else {
        response = await userLogin(formData.email, formData.password);
        toast({
          title: "Login Success",
          description: "Welcome back"
        });
      }
      
      // Token is already stored by the login function
      setUser(response.user);
      
      // Navigate based on user type
      if (response.user.isCreator) {
        navigate('/creator-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed";
      
      // Handle specific error messages
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Check if it's a CORS error
      if (error.name === 'NetworkError' || 
          (typeof error.message === 'string' && 
           (error.message.includes('Network Error') || 
            error.message.includes('CORS')))) {
        errorMessage = "Network error - the server may be down or CORS is not enabled";
        console.error("CORS or network error detected");
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Choose your account type to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full mb-4" onValueChange={(value) => setLoginType(value as 'user' | 'creator')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Gamer Login
              </TabsTrigger>
              <TabsTrigger value="creator">
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                Creator Login
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In as Gamer'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="creator" className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Creator Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your creator email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button className="w-full" type="submit" disabled={loading} variant="secondary">
                  {loading ? 'Signing in...' : 'Sign In as Creator'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 