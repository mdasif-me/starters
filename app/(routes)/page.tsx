import { Button } from '@/shared/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='max-w-4xl mx-auto text-center'>
        <h1 className='text-5xl font-bold mb-6'>Welcome to Cotap</h1>
        <p className='text-xl text-muted-foreground mb-8'>
          Modern attendance management system for seamless workforce tracking
        </p>
        <div className='flex gap-4 justify-center'>
          <Link href='/products'>
            <Button size='lg'>Browse Products</Button>
          </Link>
          <Link href='/cart'>
            <Button variant='outline' size='lg'>
              View Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
