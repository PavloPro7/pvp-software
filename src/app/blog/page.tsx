import type { Metadata } from "next";
import { PostList } from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on what I build and learn.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div className="container section">
      <h1>Blog</h1>
      <p className="muted">Notes on what I build and learn.</p>
      <PostList posts={posts} />
    </div>
  );
}
