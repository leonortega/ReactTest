import Link from 'next/link';
import type { Metadata } from 'next';
import { blogPosts } from '../_lib/content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog | MarketPulse',
  description: 'Product updates and market analytics insights.',
  openGraph: {
    title: 'Blog | MarketPulse',
    description: 'Product updates and market analytics insights.',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-[980px] px-6 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p className="text-slate-600">Updates, research, and analytics tips.</p>
      </div>

      <div className="grid gap-4">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-slate-500">{post.date}</div>
            <h2 className="mt-2 text-lg font-semibold">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mt-2 text-sm text-slate-600">{post.summary}</p>
            <Link className="mt-3 inline-flex text-sm font-medium" href={`/blog/${post.slug}`}>
              Read more
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
