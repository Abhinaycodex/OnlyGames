import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { RegisterForm } from '../components/RegisterForm';
import { UserProfile } from '../components/User/UserProfile';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Users,
  Crown,
  Gamepad2,
  Play,
  Trophy,
  Heart,
  MessageCircle,
  Zap,
} from 'lucide-react';

// API function for user registration
const userRegister = async (userData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const data = await response.json();
  
  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('authToken', data.token);
  }
  
  return data;
};

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegisterSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      console.log('Attempting registration with email:', formData.email);
      
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      const response = await userRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      toast({
        title: "Registration Success",
        description: "Welcome to OnlyGames!"
      });
      
      // Set user in context
      setUser(response.user);

      console.log("Registration response:", response);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed";
      
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
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };



  if (user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Welcome back, {user.username}!
            </h1>
            <p className="text-gray-300 text-lg">
              Ready to game and create amazing content?
            </p>
          </div>
          <UserProfile />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Blurred Background Orbs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Gamepad2 className="h-16 w-16 text-purple-400 mr-4 animate-bounce" />
            <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              OnlyGames
            </h1>
          </div>
          <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate platform where gamers meet creators. Play, learn, create, and
            connect with the gaming community like never before.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { title: 'Connect', icon: Users, color: 'from-purple-500 to-pink-500', desc: 'Follow your favorite gaming creators and build lasting connections' },
              { title: 'Create', icon: Crown, color: 'from-yellow-500 to-orange-500', desc: 'Share your gaming content and monetize your passion' },
              { title: 'Play', icon: Play, color: 'from-blue-500 to-cyan-500', desc: 'Join gaming sessions and improve your skills' },
              { title: 'Learn', icon: Trophy, color: 'from-green-500 to-emerald-500', desc: 'Master new games with expert creators and coaches' },
            ].map(({ title, icon: Icon, color, desc }, idx) => (
              <Card
                key={idx}
                className="bg-slate-800/50 border border-purple-500/10 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto mb-4 p-3 bg-gradient-to-r ${color} rounded-full w-fit group-hover:rotate-12 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">{desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { value: '10K+', label: 'Active Gamers', color: 'text-purple-400' },
              { value: '500+', label: 'Content Creators', color: 'text-pink-400' },
              { value: '1M+', label: 'Gaming Sessions', color: 'text-blue-400' },
            ].map(({ value, label, color }, i) => (
              <div key={i} className="text-center">
                <div className={`text-5xl font-bold mb-2 ${color}`}>{value}</div>
                <div className="text-gray-400 text-lg">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Registration Form */}
        <section className="max-w-md mx-auto">
          <Card className="bg-slate-800/80 border-purple-500/30 backdrop-blur-lg shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white mb-2">Join OnlyGames</CardTitle>
              <CardDescription className="text-gray-400">
                Create your account and start your gaming journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm 
                onSubmit={handleRegisterSubmit}
                loading={loading}
              />
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center mt-16">
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2 text-purple-400">
              <Heart className="h-5 w-5" />
              <span>Premium Content</span>
            </div>
            <div className="flex items-center space-x-2 text-pink-400">
              <MessageCircle className="h-5 w-5" />
              <span>Live Chat</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <Zap className="h-5 w-5" />
              <span>Instant Gaming</span>
            </div>
          </div>
          <p className="text-gray-500">
            Join thousands of gamers and creators in our community
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Register;