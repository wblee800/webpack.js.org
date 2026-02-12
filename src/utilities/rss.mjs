import { Feed } from "feed";

/**
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
