import { useParams } from 'react-router-dom'
import { Button } from '../components/ui/button'

const Profile = () => {
  const { id } = useParams()

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-start gap-8">
        <div className="w-32 h-32 rounded-full bg-muted"></div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Creator Name</h1>
          <p className="text-muted-foreground">@username</p>
          <p className="mt-2">Professional gamer and content creator. Specializing in FPS games and strategy.</p>
          <div className="mt-4 flex gap-4">
            <Button>Subscribe ($9.99/month)</Button>
            <Button variant="outline">Book Session</Button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-b">
        <div className="flex gap-8">
          <button className="py-2 border-b-2 border-primary">Videos</button>
          <button className="py-2 text-muted-foreground">Photos</button>
          <button className="py-2 text-muted-foreground">Sessions</button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content items will be mapped here */}
      </div>
    </div>
  )
}

export default Profile 