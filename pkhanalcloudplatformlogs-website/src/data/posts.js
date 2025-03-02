// src/data/posts.js
export const posts = [
  {
    id: 1,
    title: "My First Blog Post",
    content: "This is my first blog post content.",
    type: "internal", // "internal" for your posts
  },
  {
    id: 2,
    title: "Learning Next.js",
    content: "This post is about learning Next.js and its features.",
    type: "internal", // "internal" for your posts
  },
  {
    id: 3,
    title: "AWS CloudTrail network activity events for VPC endpoints now generally available",
    url: "https://aws.amazon.com/blogs/aws/aws-cloudtrail-network-activity-events-for-vpc-endpoints-now-generally-available/", // External URL
    type: "external", // "external" for external links
  },
  {
    id: 4,
    title: "The Future of AI",
    url: "https://www.ai.com/future-of-ai", // External URL
    type: "external", // "external" for external links
  },
];
