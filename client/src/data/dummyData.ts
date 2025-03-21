export interface GamerProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  rating: number;
  isCreator: boolean;
  games: string[];
  socialLinks: {
    twitter?: string;
    twitch?: string;
    youtube?: string;
  };
}

export interface Content {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  thumbnail: string;
  type: 'video' | 'photo' | 'session';
  views: number;
  likes: number;
  createdAt: string;
}

export const dummyGamers: GamerProfile[] = [
  {
    id: "1",
    name: "Alex Thompson",
    username: "alexgaming",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    bio: "Professional Fortnite player | Content Creator | Gaming Enthusiast",
    followers: 12500,
    rating: 4.8,
    isCreator: true,
    games: ["Fortnite", "Valorant", "Apex Legends"],
    socialLinks: {
      twitter: "https://twitter.com/alexgaming",
      twitch: "https://twitch.tv/alexgaming",
      youtube: "https://youtube.com/alexgaming"
    }
  },
  {
    id: "2",
    name: "Sarah Chen",
    username: "sarahplays",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    bio: "League of Legends Challenger | Streamer | Coach",
    followers: 8900,
    rating: 4.9,
    isCreator: true,
    games: ["League of Legends", "Teamfight Tactics"],
    socialLinks: {
      twitch: "https://twitch.tv/sarahplays",
      youtube: "https://youtube.com/sarahplays"
    }
  },
  {
    id: "3",
    name: "Mike Johnson",
    username: "mikegaming",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    bio: "FIFA Pro Player | Content Creator | Gaming Tips",
    followers: 5600,
    rating: 4.7,
    isCreator: true,
    games: ["FIFA 24", "EA Sports FC"],
    socialLinks: {
      twitter: "https://twitter.com/mikegaming",
      youtube: "https://youtube.com/mikegaming"
    }
  }
];

export const dummyContent: Content[] = [
  {
    id: "1",
    creatorId: "1",
    title: "Fortnite Victory Royale Highlights",
    description: "Best plays from my latest stream!",
    thumbnail: "https://picsum.photos/400/225?random=1",
    type: "video",
    views: 1200,
    likes: 150,
    createdAt: "2024-02-20T10:00:00Z"
  },
  {
    id: "2",
    creatorId: "2",
    title: "LoL Challenger Guide",
    description: "How to climb to Challenger in Season 14",
    thumbnail: "https://picsum.photos/400/225?random=2",
    type: "video",
    views: 800,
    likes: 120,
    createdAt: "2024-02-19T15:30:00Z"
  },
  {
    id: "3",
    creatorId: "3",
    title: "FIFA 24 Pro Tips",
    description: "Advanced techniques for competitive play",
    thumbnail: "https://picsum.photos/400/225?random=3",
    type: "video",
    views: 600,
    likes: 90,
    createdAt: "2024-02-18T20:15:00Z"
  }
]; 