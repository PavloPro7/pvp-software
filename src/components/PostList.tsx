import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/posts";
import styles from "./PostList.module.scss";

export function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return <p className="muted">Nothing here yet.</p>;
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.slug} className={styles.item}>
          <time dateTime={post.date} className={styles.date}>
            {formatDate(post.date)}
          </time>
          <div>
            <Link href={`/blog/${post.slug}`} className={styles.title}>
              {post.title}
            </Link>
            <p className="muted">{post.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
