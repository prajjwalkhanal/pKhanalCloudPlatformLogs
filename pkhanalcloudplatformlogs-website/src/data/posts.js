// src/data/posts.js
export const posts = [
  {
    id: 6,
    title: "How AI Agents Work and Building an AWS Diagram Generator",
    content: "AI can take a simple sentence and turn it into something useful—like a diagram. In this post, we’ll explore how we built, a tool that creates AWS architecture diagrams from text input using AI. We’ll cover three main steps: connecting to an AI API from both the frontend and backend, how the AI builds the architecture, and how we draw it as a diagram.",
    type: "internal", // "internal" for your posts
  },
  {
    id: 7,
    title: "DevOps combines development (Dev) and operations (Ops) to unite people, process, and technology in application planning, development, delivery, and operations.",
    url: "https://learn.microsoft.com/en-us/devops/what-is-devops", // External URL
    type: "external", // "external" for external links
  },
  {
    id: 5,
    title: "Monitoring Websites with AWS CloudWatch Synthetics Canaries",
    content: "Keeping websites online is a big part of my job as a DevOps Engineer, and I’ve found AWS CloudWatch Synthetics Canaries to be a simple yet powerful way to do it. I’m excited to share how I use them with CloudFormation to monitor sites and get alerts when something goes wrong—especially in the healthcare industry where uptime matters.",
    type: "internal", // "internal" for your posts
  },
  {
    id: 4,
    title: "Healthcare industry’s first unified voice AI assistant",
    url: "https://news.microsoft.com/2025/03/03/microsoft-dragon-copilot-provides-the-healthcare-industrys-first-unified-voice-ai-assistant-that-enables-clinicians-to-streamline-clinical-documentation-surface-information-and-automate-task/", // External URL
    type: "external", // "external" for external links
  },
  {
    id: 3,
    title: "Key Benefits of AWS CDK in DevOps",
    content: "The AWS Cloud Development Kit (CDK) is a powerful framework that allows developers and DevOps engineers to define cloud infrastructure using familiar programming languages like TypeScript, Python, or JavaScript. Unlike traditional CloudFormation templates, CDK brings a programmatic approach to infrastructure as code (IaC), making it a game-changer for modern DevOps workflows.",
    type: "internal", // "internal" for your posts
  },
  {
    id: 2,
    title: "AWS CloudTrail network activity events for VPC endpoints now generally available",
    url: "https://aws.amazon.com/blogs/aws/aws-cloudtrail-network-activity-events-for-vpc-endpoints-now-generally-available/", // External URL
    type: "external", // "external" for external links
  },

  {
    id: 1,
    title: "Automating AWS Deployments with PowerShell and cfn-init",
    content: "Automation is a key part of modern DevOps, and Windows PowerShell is a powerful tool for managing AWS resources, deploying applications, and configuring servers.",
    type: "internal", // "internal" for your posts
  },

];
