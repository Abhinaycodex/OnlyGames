import { dummyGamers, dummyContent } from '../data/dummyData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 fade-in">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to <span className="text-primary">OnlyGames</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with gamers, share your passion, and grow your gaming community.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/explore">
            <Button size="lg" className="glow">
              Explore Creators
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline" className="float">
              Become a Creator
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Connect with Gamers", text: "Find and connect with gamers who share your interests and gaming style.", delay: "0.2s" },
          { title: "Share Your Content", text: "Upload and share your gaming highlights, tutorials, and live streams.", delay: "0.4s" },
          { title: "Grow Your Community", text: "Build your fanbase and monetize your gaming content through subscriptions.", delay: "0.6s" },
        ].map(({ title, text, delay }) => (
          <Card key={title} className="slide-in" style={{ animationDelay: delay }}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{text}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 fade-in">
        <h2 className="text-3xl font-bold">Ready to Start Your Gaming Journey?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join thousands of gamers who are already sharing their passion on OnlyGames.
        </p>
        <Link to="/register">
          <Button size="lg" className="glow">Get Started Now</Button>
        </Link>
      </section>

      {/* Featured Creators */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Creators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyGamers.map((gamer) => (
            <Card key={gamer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <img src={gamer.avatar} alt={gamer.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <CardTitle className="text-xl">{gamer.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">@{gamer.username}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{gamer.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {gamer.games.map((game) => (
                    <span key={game} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {game}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-sm">
                  <span>{gamer.followers.toLocaleString()} followers</span>
                  <span>⭐ {gamer.rating}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Content */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyContent.map((content) => {
            const creator = dummyGamers.find(g => g.id === content.creatorId);
            return (
              <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img src={content.thumbnail} alt={content.title} className="w-full h-48 object-cover" />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{content.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{content.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <img src={creator?.avatar} alt={creator?.name} className="w-6 h-6 rounded-full" />
                      <span>{creator?.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>👁️ {content.views}</span>
                      <span>❤️ {content.likes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
