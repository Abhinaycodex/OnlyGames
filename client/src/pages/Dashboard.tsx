import { Button } from '../components/ui/button'

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>Upload Content</Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-medium">Total Subscribers</h3>
          <p className="text-3xl font-bold mt-2">1,234</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-medium">Monthly Revenue</h3>
          <p className="text-3xl font-bold mt-2">$2,345</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-medium">Active Sessions</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Activity items will be mapped here */}
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">New subscriber</p>
                <p className="text-sm text-muted-foreground">@username subscribed to your channel</p>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 