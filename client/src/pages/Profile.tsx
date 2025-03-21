import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="relative">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-primary shadow-lg"
            />
            <Badge className="absolute bottom-0 right-0 bg-primary text-primary-foreground">
              Pro
            </Badge>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">John Doe</CardTitle>
            <p className="text-muted-foreground">@johndoe</p>
            <p className="mt-2 text-sm">
              Professional gamer and content creator. Specializing in FPS games and strategy.
            </p>
            <div className="flex gap-4 mt-4">
              <div>
                <span className="font-bold">1.2k</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold">4.8</span>
                <span className="text-muted-foreground ml-1">Rating</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>Subscribe</Button>
            <Button variant="outline">Book Session</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden group">
                <div className="relative aspect-video">
                  <img
                    src={`https://via.placeholder.com/400x225`}
                    alt={`Video ${item}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary">Watch Now</Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Amazing Gameplay Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Check out these incredible moments from my latest stream!
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="photos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden group">
                <div className="relative aspect-square">
                  <img
                    src={`https://via.placeholder.com/400`}
                    alt={`Photo ${item}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary">View</Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Gaming Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    My latest gaming setup and equipment.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="sessions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Coaching Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn advanced strategies and techniques in a 1-on-1 session.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">$50/hour</span>
                    <Button>Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile; 