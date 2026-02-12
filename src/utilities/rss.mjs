import fs from "node:fs";
import path from "node:path";
import { Feed } from "feed";

/**
 * Parse frontmatter from MDX file
 */
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) return null;

  const [, frontmatter] = frontmatterMatch;

  // Extract title - handle both quoted and unquoted values
  const titleMatch = frontmatter.match(/title:\s*(.+?)$/m);
  if (!titleMatch) return null;

  // Remove quotes if present
  const [, titleRaw] = titleMatch;
  const title = titleRaw.trim().replaceAll(/^["']|["']$/g, "");

  return { title };
}

/**
 * Generate RSS feed from blog posts
 * @param {Array} posts - Optional array of post objects for testing
 * @returns {string} RSS 2.0 XML
 */
export const generateRssFeed = (posts = null) => {
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

  // If posts array is provided (for testing), use it directly
  if (posts !== null) {
    for (const post of posts) {
      feed.addItem({
        title: post.title,
        id: `${siteUrl}${post.url}`,
        link: `${siteUrl}${post.url}`,
        description: post.excerpt || post.title,
        date: new Date(post.date || new Date()),
      });
    }
    return feed.rss2();
  }

  // Otherwise, read from file system
  const blogDir = path.join(process.cwd(), "src", "content", "blog");

  if (!fs.existsSync(blogDir)) {
    throw new Error(`Blog directory not found: ${blogDir}`);
  }

  const files = fs.readdirSync(blogDir);

  const blogPosts = files
    .filter(
      (file) =>
        // Exclude index.mdx, only .mdx files
        file.endsWith(".mdx") && file !== "index.mdx",
    )
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const postData = parseMarkdownFile(filePath);

      if (!postData || !postData.title) return null;

      // Try to extract date from filename (YYYY-MM-DD format)
      const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
      let date;

      if (dateMatch) {
        // If filename contains date
        [, date] = dateMatch;
      } else {
        // If no date in filename, use file modification time
        const stats = fs.statSync(filePath);
        [date] = stats.mtime.toISOString().split("T");
      }

      const slug = file.replace(".mdx", "");

      return {
        title: postData.title,
        url: `/blog/${slug}/`,
        date,
      };
    })
    .filter(Boolean)
    // Sort by date in descending order (newest first)
    .toSorted((a, b) => new Date(b.date) - new Date(a.date));

  for (const post of blogPosts) {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}${post.url}`,
      link: `${siteUrl}${post.url}`,
      description: post.title,
      date: new Date(post.date),
    });
  }

  return feed.rss2();
};

// When executed directly as a script
if (process.argv[1] && process.argv[1].includes("rss.mjs")) {
  try {
    const xml = generateRssFeed();
    const posts = xml.match(/<item>/g)?.length || 0;
    fs.writeFileSync(path.join(process.cwd(), "rss.xml"), xml);
    console.log(`✅ RSS Feed generated successfully with ${posts} posts!`);
  } catch (err) {
    console.error("❌ Error generating feed:", err.message);
    console.error(err.stack);
    throw err;
  }
}
