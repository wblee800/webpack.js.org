import { generateRssFeed } from "./rss.mjs";

describe("RSS Utilities", () => {
  const mockPosts = [
    {
      title: "Webpack 5 Release",
      url: "/blog/webpack-5",
      excerpt: "Webpack 5 is here!",
      date: "2026-02-12",
    },
  ];

  it("should generate valid RSS XML", () => {
    const xml = generateRssFeed(mockPosts);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("Webpack 5 Release");
  });
});
