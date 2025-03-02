export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  
  try {
    const response = await fetch(url);
    const html = await response.text();

    const titleMatch = html.match(/<meta property="og:title" content="(.*?)"/);
    const descMatch = html.match(/<meta property="og:description" content="(.*?)"/);
    const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/);

    res.status(200).json({
      title: titleMatch ? titleMatch[1] : 'No Title',
      description: descMatch ? descMatch[1] : 'No Description',
      image: imageMatch ? imageMatch[1] : '',
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch Open Graph data' });
  }
}
