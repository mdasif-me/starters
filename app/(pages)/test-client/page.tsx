'use client';

import { apiGet, isApiError } from '@/shared/api/api-client';
import { Button } from '@/shared/ui/components/button';
import { useState } from 'react';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default function ClientTestPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiGet<Post[]>(
        'https://jsonplaceholder.typicode.com/posts?_limit=5',
        {
          timeout: 5000,
        }
      );
      setPosts(data);
    } catch (err) {
      if (isApiError(err)) {
        setError(`${err.message} (${err.code})`);
        console.error('API Error:', {
          statusCode: err.statusCode,
          code: err.code,
          url: err.url,
          method: err.method,
        });
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-2xl font-bold mb-4'>Client Component API Test</h1>
      <p className='text-muted-foreground mb-6'>
        This page fetches data client-side using the API client with error
        handling and loading states.
      </p>

      <Button onClick={fetchPosts} disabled={loading} className='mb-6'>
        {loading ? 'Loading...' : 'Fetch Posts'}
      </Button>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          <p className='font-bold'>Error</p>
          <p>{error}</p>
        </div>
      )}

      {posts.length > 0 && (
        <div className='space-y-4'>
          {posts.map((post) => (
            <div key={post.id} className='border rounded-lg p-4'>
              <h2 className='font-semibold'>{post.title}</h2>
              <p className='text-sm text-muted-foreground mt-2'>{post.body}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className='text-muted-foreground'>Click the button to fetch posts</p>
      )}
    </div>
  );
}
