import { apiGet } from '@/shared/api/api-client';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default async function ServerTestPage() {
  let posts: Post[] | null = null;
  let error: Error | null = null;

  try {
    // Test server-side API call with Next.js cache options
    posts = await apiGet<Post[]>(
      'https://jsonplaceholder.typicode.com/posts?_limit=5',
      {
        cache: 'no-store',
        next: {
          tags: ['posts'],
        },
      }
    );
  } catch (err) {
    error = err instanceof Error ? err : new Error('Unknown error');
  }

  if (error) {
    return (
      <div className='container mx-auto p-8'>
        <h1 className='text-2xl font-bold mb-4 text-red-600'>
          Server Test Failed
        </h1>
        <pre className='bg-gray-100 p-4 rounded'>{error.message}</pre>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-2xl font-bold mb-4'>Server Component API Test ✓</h1>
      <p className='text-muted-foreground mb-6'>
        This page fetches data server-side using the API client with automatic
        cookie/header forwarding.
      </p>

      <div className='space-y-4'>
        {posts?.map((post) => (
          <div key={post.id} className='border rounded-lg p-4'>
            <h2 className='font-semibold'>{post.title}</h2>
            <p className='text-sm text-muted-foreground mt-2'>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
