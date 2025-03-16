import axios from 'axios';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    const prompt = `
    You are an expert IT system architect. Your task is to generate a detailed AWS system architecture based on the following user requirements. The output should include:
    1. A structured description of the architecture layers, components, and their roles (e.g.,Route53, WAF, ALB, compute, DB,etc.).
    2. Clear relationships and interactions between the components (e.g. data flow or communication paths between loadbalancer and servers).
    3. Recommended AWS-specific technologies for each component (e.g. Route53, WAF, ALB, EC2, RDS, ELB).
    4. The output format should be in JSON format for easy parsing, with an "architecture" key at the root containing "layers" and "relationships".
    5. Use "from" and "to" keys in "relationships" (not "source" and "destination") to define component interactions.

    User Input: "${input}"

    Respond with the JSON representation of the desired architecture ONLY. Avoid lengthy explanations, additional text, or Markdown markers (like \`\`\`json). Provide pure JSON that can be directly parsed, e.g., {"architecture": {"layers": [], "relationships": []}}.
    `;

    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    let generatedText = response.data.choices[0].message.content.trim();
    console.log('Raw Mistral Response:', generatedText);

    // Remove Markdown code blocks if present
    generatedText = generatedText.replace(/^```json\s*|\s*```$/g, '');

    let jsonOutput;
    try {
      jsonOutput = JSON.parse(generatedText);
      if (!jsonOutput.architecture) {
        jsonOutput = { architecture: jsonOutput };
      }

      // Normalize "source" and "destination" to "from" and "to" if present
      jsonOutput.architecture.relationships = jsonOutput.architecture.relationships.map((rel) => ({
        from: rel.source || rel.from,
        to: rel.destination || rel.to,
        description: rel.description,
      }));
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      return res.status(500).json({ error: 'Invalid JSON from Mistral', details: parseError.message });
    }

    if (!jsonOutput.architecture || !jsonOutput.architecture.layers || !jsonOutput.architecture.relationships) {
      console.error('Invalid architecture structure:', jsonOutput);
      return res.status(500).json({ error: 'Mistral response missing required architecture fields' });
    }

    res.status(200).json({ architecture: jsonOutput.architecture });
  } catch (error) {
    console.error('Error generating architecture:', error.message);
    res.status(500).json({ error: 'Failed to generate architecture', details: error.message });
  }
}