import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
// import { Avatar } from '../ui/avatar';
import { User, Crown, Users, DollarSign } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, logout } = useUser();

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Please log in to view your profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <span className="h-16 w-16 rounded-full overflow-hidden flex items-center justify-center bg-muted">
              {/* If Avatar component supports children, render image or fallback */}
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.username} className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <span className="flex items-center justify-center h-16 w-16 bg-muted rounded-full">
                  <User className="h-8 w-8" />
                </span>
              )}
            </span>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <CardTitle>{user.username}</CardTitle>
                {user.isCreator && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>Creator</span>
                  </Badge>
                )}
              </div>
              <CardDescription>{user.email}</CardDescription>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.bio && (
              <div>
                <h4 className="font-medium mb-1">Bio</h4>
                <p className="text-sm text-muted-foreground">{user.bio}</p>
              </div>
            )}
            
            {user.games.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Favorite Games</h4>
                <div className="flex flex-wrap gap-2">
                  {user.games.map((game, index) => (
                    <Badge key={index} variant="outline">{game}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {user.subscribers.length} subscriber{user.subscribers.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {user.isCreator && user.creatorProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5" />
              <span>Creator Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{user.creatorProfile.contentCount}</div>
                <div className="text-sm text-muted-foreground">Content</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.creatorProfile.subscriberCount}</div>
                <div className="text-sm text-muted-foreground">Subscribers</div>
              </div>
              <div className="text-center flex items-center justify-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <div className="text-2xl font-bold">{user.creatorProfile.totalRevenue.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <Badge 
                  variant={
                    user.creatorProfile.verificationStatus === 'verified' ? 'default' :
                    user.creatorProfile.verificationStatus === 'pending' ? 'secondary' : 'destructive'
                  }
                >
                  {user.creatorProfile.verificationStatus}
                </Badge>
              </div>
            </div>
            
            {user.creatorProfile.contentCategories.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Content Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {user.creatorProfile.contentCategories.map((category, index) => (
                    <Badge key={index} variant="outline">{category}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
