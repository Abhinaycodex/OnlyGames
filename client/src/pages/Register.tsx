import React, { useState, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { UserProfile } from '../components/User/UserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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

const Register: React.FC = () => {
  const { user } = useUser();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleAuthModeChange = useCallback(
  (value: string) => {
    if (value === 'login' || value === 'register') {
      setAuthMode(value);
    }
  },
  []
);

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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: '2000ms' }}
        />
        <div
          className="absolute top-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: '4000ms' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
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
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-fit group-hover:rotate-12 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Follow your favorite gaming creators and build lasting connections
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-yellow-500/20 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full w-fit group-hover:rotate-12 transition-transform">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Create</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Share your gaming content and monetize your passion
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-fit group-hover:rotate-12 transition-transform">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Play</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Join gaming sessions and improve your skills
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-green-500/20 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-fit group-hover:rotate-12 transition-transform">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Master new games with expert creators and coaches
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-400 mb-2">10K+</div>
              <div className="text-gray-400 text-lg">Active Gamers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-pink-400 mb-2">500+</div>
              <div className="text-gray-400 text-lg">Content Creators</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">1M+</div>
              <div className="text-gray-400 text-lg">Gaming Sessions</div>
            </div>
          </section>
        </section>

        {/* Auth Section */}
        <section className="max-w-md mx-auto">
          <Card className="bg-slate-800/80 border-purple-500/30 backdrop-blur-lg shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white mb-2">Join OnlyGames</CardTitle>
              <CardDescription className="text-gray-400">
                Start your gaming journey today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={authMode} onValueChange={handleAuthModeChange}>
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-700/50">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="transition-opacity duration-300 ease-in-out data-[state=inactive]:opacity-0">
                  <LoginForm onSuccess={() => console.log('Login successful')} />
                </TabsContent>


                <TabsContent value="register">
                  <RegisterForm onSuccess={() => console.log('Registration successful')} />
                </TabsContent>
              </Tabs>
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
