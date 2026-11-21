import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const projects = getAllProjects();
  const pages = ["", "/blog", "/projects", "/about", "/contact"].map((p) => ({
    url: `${site.url}${p}`,
  }));
  return [
    ...pages,
    ...projects
      .filter((project) => project.hasPage)
      .map((project) => ({ url: `${site.url}/projects/${project.slug}` })),
    ...posts.map((post) => ({ url: `${site.url}/blog/${post.slug}`, lastModified: post.date })),
  ];
}
