// src/pages/api/fetchOpenGraph.js
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await fetch(`https://opengraph.io/api/1.1/site/${url}`);
    const data = await response.json();

    if (data.hybridGraph) {
      return res.status(200).json(data.hybridGraph);
    } else {
      return res.status(404).json({ error: "OpenGraph data not found" });
    }
  } catch (err) {
    console.error("Error fetching OpenGraph data:", err); // Log the error
    res.status(500).json({ error: "Error fetching OpenGraph data" });
  }
}
