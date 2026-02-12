import fs from "node:fs";
import path from "node:path";
import { Feed } from "feed";

/**
 * Generate RSS 2.0 XML from blog posts
 * @param {Array} posts - blog post data
 * @returns {string} RSS 2.0 XML
 */
export const generateRssFeed = (posts = []) => {
  const siteUrl = "https://webpack.js.org";
  const feed = new Feed({
    title: "Webpack Blog",
    description: "Latest news from the Webpack team",
    id: siteUrl,
    link: siteUrl,
    language: "en",
    copyright: `All rights reserved ${new Date().getFullYear()}, Webpack`,
    generator: "Webpack RSS Generator",
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}${post.url}`,
      link: `${siteUrl}${post.url}`,
      description: post.excerpt,
      date: new Date(post.date),
    });
  }

  return feed.rss2();
};

// Internal execution logic for testing
// This part runs only when executing the file directly via node
const __filename = new URL(import.meta.url).pathname;
if (
  process.argv[1] &&
  (process.argv[1].includes("rss.mjs") || process.argv[1].includes("rss.mj"))
) {
  try {
    // For testing, we pass a dummy array if there's no real data yet
    const samplePosts = [
      {
        title: "Test Post",
        url: "/blog/test",
        excerpt: "Hello World",
        date: new Date(),
      },
    ];
    const xml = generateRssFeed(samplePosts);

    // Write to the root directory
    fs.writeFileSync(path.join(process.cwd(), "rss.xml"), xml);
    console.log("✅ RSS Feed generated successfully at ./rss.xml");
  } catch (err) {
    console.error("❌ Error generating feed:", err);
  }
}
