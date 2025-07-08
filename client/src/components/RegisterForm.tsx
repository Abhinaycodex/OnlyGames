import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { User, Mail, Lock, Crown } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const { register, isLoading } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    

    
    if (!username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const success = await register({ 
      username, 
      email, 
      password, 
      isCreator 
    });
    
    if (success) {
      toast.success('Welcome to OnlyGames! 🎮');
      onSuccess?.();
    } else {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-gray-300 flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Username</span>
        </Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose your gamer tag"
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300 flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span>Email</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300 flex items-center space-x-2">
          <Lock className="h-4 w-4" />
          <span>Password</span>
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a strong password"
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>
      
      <div className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
        <Checkbox
          id="isCreator"
          checked={isCreator}
          onCheckedChange={(checked) => setIsCreator(checked as boolean)}
          className="border-purple-500 data-[state=checked]:bg-purple-600"
        />
        <Label htmlFor="isCreator" className="text-gray-300 flex items-center space-x-2 cursor-pointer">
          <Crown className="h-4 w-4 text-yellow-400" />
          <span>I want to be a content creator</span>
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 transition-all duration-300 hover:scale-105" 
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Join OnlyGames'}
      </Button>
    </form>
  );
};
