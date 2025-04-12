
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, Funnel, MapPinHouse, Pencil, PlusCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchLands } from '@/components/lands/SearchLands';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default async function Lands() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return <div>Please log in to view your lands.</div>;
    }
  
    const userId = session.user.id;
    const lands = await db.lands.findMany({
        where: { userId: userId },
        include: { Devices: true },
    });
      
  
    return (
      <div>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Lands</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="cursor-pointer">
              <Funnel />
            </Button>
            <SearchLands />

            <Link href='lands/create'>
              <Button className="cursor-pointer">
                <PlusCircle />
                Add Land
              </Button>
            </Link>
          </div>
        </div>
  
        {/* Lands List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lands.length > 0 ? (
            lands.map((land) => (
              <Card key={land.id} className="shadow-lg">
                <CardHeader className="flex justify-between gap-2">
                    <div className='text-center flex flex-row items-center gap-2'>
                        <MapPinHouse color={land.color || '#000000'}/>
                        <CardTitle className="text-lg" color={land.color || '#000000'}>{land.landName}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="airplane-mode">Enabled</Label>
                        <Switch className="cursor-pointer" id="airplane-mode" /> 
                    </div>
                </CardHeader>
                <CardContent>
                  <div className='flex'>
                    <p>Total Devices: <strong>{land.Devices?.length || '0'}</strong></p>
                  </div>
                  <div className='flex flex-col'>
                    <p>Lattitude: <strong>{land?.location?.coordinates[0] || '0'}</strong></p>
                    <p>Longitude: <strong>{land?.location?.coordinates[1] || '0'}</strong></p>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-1">
                    <Button variant="outline" size="sm" className='bg-zinc-900 text-white hover:bg-zinc-700 hover:text-white cursor-pointer'>
                        <Eye size={14} className="mr-1" />
                        View
                    </Button>
                    <Button variant="outline" size="sm" className='bg-orange-500 text-white hover:bg-orange-400 hover:text-white cursor-pointer'>
                        <Pencil size={14} className="mr-1" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" className='bg-red-500 text-white hover:bg-red-400 hover:text-white cursor-pointer'>
                        <Trash size={14} className="mr-1" />
                        Delete
                    </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p>No lands found.</p>
          )}
        </div>
      </div>
    );
  }
