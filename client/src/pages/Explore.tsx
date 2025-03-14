import { Button } from '../components/ui/button'

const Explore = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Explore Creators</h1>
        <div className="flex gap-4">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Sort</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Creator cards will be mapped here */}
        <div className="border rounded-lg p-4">
          <div className="aspect-square bg-muted rounded-lg mb-4"></div>
          <h3 className="font-semibold">Creator Name</h3>
          <p className="text-sm text-muted-foreground">Game • 1.2k followers</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="font-medium">$9.99/month</span>
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore 