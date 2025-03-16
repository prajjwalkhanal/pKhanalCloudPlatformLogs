import React from 'react';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Post.module.css';
import footerStyles from '../../styles/Footer.module.css';
import Link from 'next/link';

export default function Post6() {
  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.blogContent}>
        <h2>How AI Agents Work and Building an AWS Diagram Generator  <Link href="/diagram-generator" style={{ textDecoration: 'none', color: '#0070f3', fontSize: '.5em' }}>
          Try &#10138; {/* Right arrow symbol */}
        </Link></h2>
        <p className={styles.date}>Published on March 16, 2025</p>

        <h3>Introduction</h3>
        <p>
          AI can take a simple sentence and turn it into something useful—like a diagram. In this post, we’ll explore how I built `diagram-generator.js`, a tool that creates AWS architecture diagrams from text input using AI. We’ll cover three main steps: connecting to an AI API from both the frontend (`diagram-generator.js`) and backend (`generate-architecture.js`), how the AI builds the architecture, and how we draw it as a diagram.
        </p>

        <h3>Connecting to the AI API</h3>
        <p>
          Our tool connects to an AI service to understand user input, and this happens in two parts: the frontend sends the text, and the backend talks to the AI. Let’s break it down.
        </p>

        <h3>Frontend Connection in diagram-generator.js</h3>
        <p>
          In `diagram-generator.js`, we start by collecting the user’s text—like “A web app with a frontend and database”—and send it to our server’s API endpoint. This is done in a function called `handleSubmit`. Here’s the code:
        </p>
        <pre>
          <code>
{`const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true); // Show a loading bar
  try {
    const res = await fetch('/api/generate-architecture', {
      method: 'POST', // Send data to the server
      headers: { 'Content-Type': 'application/json' }, // Tell the server it's JSON
      body: JSON.stringify({ input }) // Turn the user’s text into JSON
    });
    const data = await res.json(); // Get the AI’s response as JSON
    if (res.ok) {
      setArchitectureJson(data.architecture); // Save the AI’s plan
    } else {
      setError(data.error); // Show an error if something went wrong
    }
  } catch (err) {
    setError('Something went wrong: ' + err.message);
  } finally {
    setIsLoading(false); // Hide the loading bar
  }
};`}
          </code>
        </pre>
        <p>
          Here’s what’s happening: `fetch` is like a messenger that sends the user’s text to `/api/generate-architecture` using a POST request—imagine mailing a letter to the server. The `JSON.stringify` part puts the text into a neat JSON package. When the server replies, `res.json()` opens the response, and if it’s good (`res.ok`), we save it with `setArchitectureJson` to use later. If something fails, we show an error with `setError`. The `async` and `await` make sure we wait for the reply before moving on.
        </p>

        <h3>Backend Connection in generate-architecture.js</h3>
        <p>
          On the server side, `generate-architecture.js` takes the text from the frontend and sends it to Mistral’s API. It’s a file in our Next.js project that acts like a middleman. Here’s the key code:
        </p>
        <pre>
          <code>
{`import { MistralClient } from '@mistral-ai/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    const client = new MistralClient({ apiKey: process.env.MISTRAL_API_KEY });
    const response = await client.generate({
      model: 'mistral-small', // A lightweight Mistral model
      prompt: \`Generate an AWS architecture JSON from this: \${input}\`,
      response_format: 'json' // Tell Mistral to return JSON
    });

    const architecture = JSON.parse(response.data); // Parse Mistral’s response
    res.status(200).json({ architecture }); // Send it back to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate architecture', details: error.message });
  }
}`}
          </code>
        </pre>
        <p>
          This code is simple. First, it checks if the request is a POST—otherwise, it says no. Then, it grabs the `input` text from the frontend’s request. We use a Mistral client (a helper library) to send the text to Mistral’s API with a prompt like “Generate an AWS architecture JSON from this: [user text].” We tell it to use a small model (`mistral-small`) and return JSON. The `await client.generate` line waits for Mistral to reply, and `JSON.parse` turns the reply into a usable object. Finally, `res.status(200).json` sends it back to `diagram-generator.js`. If something goes wrong, it sends an error instead.
        </p>
        <p>
          To do this yourself, get an API key from Mistral, set up a server file like this in Next.js, and use their client library (or `fetch` if you prefer) to call their API. Add your key as an environment variable for safety.
        </p>

        <h3>How the AI Figures Out the Architecture</h3>
        <p>
          Mistral is the brain here. It reads the user’s text—like “A web app with a frontend and database”—and turns it into a JSON plan. Here’s what it might send back:
        </p>
        <pre>
          <code>
{`{
  "architecture": {
    "layers": [
      {"components": [{"name": "Web Application", "role": "Hosts the frontend"}]},
      {"components": [{"name": "Relational Database", "role": "Stores data"}]}
    ],
    "relationships": [
      {"from": "Web Application", "to": "Relational Database", "description": "Queries data"}
    ]
  }
}`}
          </code>
        </pre>
        <p>
          This JSON lists the parts (`layers`)—like Web Application and Relational Database—and how they connect (`relationships`). Mistral knows “frontend” means a web app and “database” means something like RDS because it’s trained to spot these patterns. We just tell it to format the answer as JSON, and it does the rest.
        </p>

        <h3>Rendering the Diagram</h3>
        <p>
          Back in `diagram-generator.js`, we take this JSON and draw it with React Flow, a library for making diagrams. Here’s the rendering code:
        </p>
        <pre>
          <code>
{`if (architectureJson) {
  return (
    <div className={styles.output}>
      <h3>Your Architecture</h3>
      <div className={styles.diagram} style={{ height: '600px' }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      <pre><code>{JSON.stringify(architectureJson, null, 2)}</code></pre>
    </div>
  );
}`}
          </code>
        </pre>
        <p>
          When we have `architectureJson`, this code kicks in. The `ReactFlow` part draws the diagram using `nodes` (the boxes, like Web Application) and `edges` (the lines, like connections to the database). These come from the JSON’s `layers` and `relationships`. We add a background grid, zoom controls, and a minimap to make it look nice. Below the diagram, we show the JSON so users can see the raw plan too.
        </p>
        <p>
          To try this, install React Flow, give it nodes and edges from your AI’s JSON, and it’ll draw the diagram—super straightforward!
        </p>

        <h3>Putting It All Together</h3>
        <p>
          Here’s the flow:
        </p>
        <ul>
          <li>User types their idea into `diagram-generator.js`.</li>
          <li>`handleSubmit` sends it to `/api/generate-architecture`.</li>
          <li>`generate-architecture.js` asks Mistral to make a JSON plan.</li>
          <li>`diagram-generator.js` gets the JSON and uses React Flow to draw it.</li>
        </ul>
        <p>
          We throw in a loading bar to show it’s working and display the JSON below the diagram for clarity.
        </p>

        <h3>Conclusion</h3>
        <p>
          With `diagram-generator.js` and `generate-architecture.js`, we’ve made a tool that goes from text to an AWS diagram. The frontend and backend work together to connect to Mistral’s API, the AI builds a JSON plan, and React Flow turns it into a picture. It’s a simple chain that makes something powerful—try it out and let me know what you think!
        </p>
      </section>

      <footer className={footerStyles.footer}>
        <Link href="/about">About Me</Link>
      </footer>
    </div>
  );
}