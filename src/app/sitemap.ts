import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "force-static";

// Page addresses end with a slash, the way the exported site serves them.
const page = (path: string) => `${site.url}${path}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const projects = getAllProjects();
  return [
    ...["", "/blog", "/projects", "/about", "/contact"].map((path) => ({ url: page(path) })),
    ...projects
      .filter((project) => project.hasPage)
      .map((project) => ({ url: page(`/projects/${project.slug}`) })),
    ...posts.map((post) => ({ url: page(`/blog/${post.slug}`), lastModified: post.date })),
  ];
}
