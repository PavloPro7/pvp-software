import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";
import prose from "@/components/Prose.module.scss";

// Every real page here is built ahead of time from a content file. Only an
// unknown address reaches the server at request time, so it may wait for it.
export const instant = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { type: "article", title: post.title, description: post.description },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="container narrow section">
      <header>
        <time dateTime={post.date} className="muted">
          {formatDate(post.date)}
        </time>
        <h1>{post.title}</h1>
      </header>
      <div className={prose.prose}>
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
