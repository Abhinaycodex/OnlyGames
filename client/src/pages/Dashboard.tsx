import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { getProfile, getUserStats } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';

interface UserStats {
  subscribers?: number;
  revenue?: number;
  activeSessions?: number;
  activities?: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user?: {
      id: string;
      username: string;
      initials?: string;
    };
  }>;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    subscribers: 0,
    revenue: 0,
    activeSessions: 0,
    activities: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const profileData = await getProfile();
        setProfile(profileData);
        
        // Fetch user stats - this may not exist in the API yet
        try {
          const statsData = await getUserStats();
          setStats(statsData);
        } catch (error) {
          console.log('Stats endpoint may not exist yet, using default values');
          // Use default empty stats
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Generate placeholder activities if none exist
  const activities = stats.activities && stats.activities.length > 0 
    ? stats.activities 
    : [
        {
          id: '1',
          type: 'message',
          description: 'No recent activity to display',
          timestamp: new Date().toISOString(),
          user: {
            id: '1',
            username: 'System',
            initials: 'SY'
          }
        }
      ];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const getInitials = (username: string) => {
    return username.split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            {loading ? (
              <Skeleton className="h-4 w-48" />
            ) : (
              `Welcome back, ${profile?.username || user?.username || 'User'}!`
            )}
          </p>
        </div>
        <Button>Upload Content</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            {!loading && <Badge variant="secondary">
              {stats.subscribers && stats.subscribers > 0 ? '+12%' : '0%'}
            </Badge>}
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.subscribers || 0}</div>
            )}
            <Progress value={loading ? 0 : 75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            {!loading && <Badge variant="secondary">
              {stats.revenue && stats.revenue > 0 ? '+8%' : '0%'}
            </Badge>}
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">${stats.revenue || 0}</div>
            )}
            <Progress value={loading ? 0 : 60} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            {!loading && <Badge variant="secondary">
              {stats.activeSessions && stats.activeSessions > 0 ? '+5%' : '0%'}
            </Badge>}
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.activeSessions || 0}</div>
            )}
            <Progress value={loading ? 0 : 45} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {activity.user?.initials || getInitials(activity.user?.username || 'User')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 