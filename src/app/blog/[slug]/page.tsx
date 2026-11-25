import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { TelegramText } from "@/components/TelegramText";
import { asset } from "@/lib/paths";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";
import prose from "@/components/Prose.module.scss";
import styles from "./post.module.scss";

// The site is exported as static files, so only the pages that exist at build
// time are created; any other address gets the "Page not found" page.
export const dynamicParams = false;

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

      {post.source === "telegram" ? (
        <>
          {post.telegram.photo && (
            <Image
              src={asset(post.telegram.photo.src)}
              alt=""
              width={post.telegram.photo.width}
              height={post.telegram.photo.height}
              sizes="(min-width: 48rem) 42rem, 100vw"
              className={styles.photo}
            />
          )}
          <TelegramText text={post.telegram.text} entities={post.telegram.entities} />
          {post.telegram.url && (
            <p className={styles.origin}>
              <a href={post.telegram.url} rel="noopener">
                View this post on Telegram
              </a>
            </p>
          )}
        </>
      ) : (
        <div className={prose.prose}>
          <MDXRemote source={post.content} />
        </div>
      )}
    </article>
  );
}
