import { generateRssFeed } from "./rss.mjs";

/**
 * Test suite for RSS feed generation utility
 */
describe("generateRssFeed", () => {
  // Mock data for testing
  const mockPosts = [
    {
      title: "Test Webpack Post",
      url: "/blog/test-post",
      excerpt: "This is a test excerpt for RSS feed",
      date: "2026-02-12",
    },
  ];

  // Test if the function returns a string containing valid RSS tags
  it("should generate a valid RSS 2.0 XML string", () => {
    const xml = generateRssFeed(mockPosts);

    expect(typeof xml).toBe("string");
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<title>Webpack Blog</title>");
    expect(xml).toContain("<item>");
  });

  // Test if the post data is correctly mapped into the XML
  it("should include correct post data in the feed", () => {
    const xml = generateRssFeed(mockPosts);

    expect(xml).toContain("<title>Test Webpack Post</title>");
    expect(xml).toContain("https://webpack.js.org/blog/test-post");
    expect(xml).toContain("This is a test excerpt for RSS feed");
  });

  // Test graceful handling of empty data
  it("should handle empty posts array without crashing", () => {
    const xml = generateRssFeed([]);
    expect(xml).toContain("<channel>");
    expect(xml).not.toContain("<item>");
  });
});
