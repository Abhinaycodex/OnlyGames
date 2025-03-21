import { useState } from 'react'
import { dummyGamers, dummyContent } from '../data/dummyData'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  // Get unique games from all gamers
  const allGames = Array.from(new Set(dummyGamers.flatMap(gamer => gamer.games)))

  // Filter gamers based on search query and selected game
  const filteredGamers = dummyGamers.filter(gamer => {
    const matchesSearch = gamer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gamer.username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGame = !selectedGame || gamer.games.includes(selectedGame)
    return matchesSearch && matchesGame
  })

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="space-y-4">
        <Input
          placeholder="Search creators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedGame === null ? "default" : "outline"}
            onClick={() => setSelectedGame(null)}
          >
            All Games
          </Button>
          {allGames.map((game) => (
            <Button
              key={game}
              variant={selectedGame === game ? "default" : "outline"}
              onClick={() => setSelectedGame(game)}
            >
              {game}
            </Button>
          ))}
        </div>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGamers.map((gamer) => (
          <Card key={gamer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <img
                  src={gamer.avatar}
                  alt={gamer.name}
                  className="w-16 h-16 rounded-full"
                />
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
                  <span
                    key={game}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {game}
                  </span>
                ))}
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span>{gamer.followers.toLocaleString()} followers</span>
                <span>⭐ {gamer.rating}</span>
              </div>
              <Button asChild className="w-full">
                <Link to={`/profile/${gamer.id}`}>View Profile</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Latest Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyContent.map((content) => {
            const creator = dummyGamers.find(g => g.id === content.creatorId)
            return (
              <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{content.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{content.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <img
                        src={creator?.avatar}
                        alt={creator?.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{creator?.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>👁️ {content.views}</span>
                      <span>❤️ {content.likes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
} 