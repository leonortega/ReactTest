import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '../../_lib/content';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogPosts.find((item) => item.slug === params.slug);
  return {
    title: post ? `${post.title} | MarketPulse` : 'Blog | MarketPulse',
    description: post?.summary,
    openGraph: {
      title: post ? `${post.title} | MarketPulse` : 'Blog | MarketPulse',
      description: post?.summary,
      type: 'article',
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((item) => item.slug === params.slug);

  if (!post) {
    return (
      <main className="mx-auto max-w-[980px] px-6 py-12">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <Link className="mt-4 inline-flex text-sm font-medium" href="/blog">
          Back to blog
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[980px] px-6 py-12">
      <div className="text-xs uppercase tracking-wide text-slate-500">{post.date}</div>
      <h1 className="mt-2 text-3xl font-semibold">{post.title}</h1>
      <p className="mt-4 text-slate-600">{post.content}</p>
      <Link className="mt-6 inline-flex text-sm font-medium" href="/blog">
        Back to blog
      </Link>
    </main>
  );
}
