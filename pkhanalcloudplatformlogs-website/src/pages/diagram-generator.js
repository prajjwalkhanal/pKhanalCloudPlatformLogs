import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, ReactFlowProvider, useNodesState, useEdgesState, Handle } from '@reactflow/core';
import { Background } from '@reactflow/background';
import { Controls } from '@reactflow/controls';
import { MiniMap } from '@reactflow/minimap';
import Navbar from '../components/Navbar';
import styles from '../styles/DiagramGenerator.module.css';
import footerStyles from '../styles/Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import '@reactflow/core/dist/style.css';

// Map component names to AWS icon paths
const awsIconMap = {
  'Static Website': '/icons/Storage_Amazon-S3.svg',
  'CDN': '/icons/Networking-Content-Delivery_Amazon-CloudFront.svg',
  'Application Servers': '/icons/Compute_Amazon-EC2.svg',
  'Application Server': '/icons/Compute_Amazon-EC2.svg',
  'Load Balancer': '/icons/Networking-Content-Delivery_Elastic-Load-Balancing.svg',
  'Relational Database': '/icons/Database_Amazon-RDS.svg',
  'NoSQL Database': '/icons/Database_Amazon-DynamoDB.svg',
  'API Gateway': '/icons/Application-Integration_Amazon-API-Gateway.svg',
  'Web Server': '/icons/Compute_Amazon-EC2.svg',
  'Compute': '/icons/Compute_Amazon-EC2.svg',
  'S3': '/icons/Storage_Amazon-S3.svg',
  'CloudFront': '/icons/Networking-Content-Delivery_Amazon-CloudFront.svg',
  'EC2': '/icons/Compute_Amazon-EC2.svg',
  'ELB': '/icons/Networking-Content-Delivery_Elastic-Load-Balancing.svg',
  'Lambda': '/icons/Compute_AWS-Lambda.svg',
  'RDS': '/icons/Database_Amazon-RDS.svg',
  'DynamoDB': '/icons/Database_Amazon-DynamoDB.svg',
  'Amazon CloudFront': '/icons/Networking-Content-Delivery_Amazon-CloudFront.svg',
  'Amazon S3': '/icons/Storage_Amazon-S3.svg',
  'Amazon EC2': '/icons/Compute_Amazon-EC2.svg',
  'Amazon ECS': '/icons/Compute_Amazon-ECS.svg',
  'AWS Lambda': '/icons/Compute_AWS-Lambda.svg',
  'Amazon RDS': '/icons/Database_Amazon-RDS.svg',
  'Amazon DynamoDB': '/icons/Database_Amazon-DynamoDB.svg',
  'Amazon API Gateway': '/icons/Application-Integration_Amazon-API-Gateway.svg',
  'Web Application': '/icons/Compute_Amazon-EC2.svg',
  'Application Logic': '/icons/Compute_AWS-Lambda.svg',
  'Route53': '/icons/Amazon-Route-53.svg',
  'WAF': '/icons/AWS-WAF.svg',
  'ALB': '/icons/Networking-Content-Delivery_Elastic-Load-Balancing.svg',
  'CloudWatch': '/icons/Amazon-CloudWatch.svg',
};

// Define nodeTypes outside the component
const nodeTypes = {
  awsNode: ({ data }) => (
    <div
      style={{
        padding: 10,
        border: '1px solid #ddd',
        borderRadius: 5,
        background: '#fff',
        textAlign: 'center',
        maxWidth: '150px',
      }}
    >
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
      <Image
        src={awsIconMap[data.label] || '/icons/Default_AWS.svg'}
        alt={data.label}
        width={40}
        height={40}
      />
      <br />
      <strong>{data.label}</strong>
      <br />
      {data.role}
    </div>
  ),
};

function DiagramGeneratorComponent() {
  const [input, setInput] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [architectureJson, setArchitectureJson] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState(null);

  const onInit = useCallback((reactFlowInstance) => {
    reactFlowInstance.fitView();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setArchitectureJson(null);
    setNodes([]);
    setEdges([]);
    setRawResponse(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const rawText = await res.text();
      setRawResponse(rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        throw new Error(`Invalid JSON from Mistral: ${parseErr.message}`);
      }

      if (res.ok) {
        setArchitectureJson(data.architecture);

        // Generate nodes
        const newNodes = [];
        let yOffset = 0;

        data.architecture.layers.forEach((layer, layerIndex) => {
          layer.components.forEach((component, compIndex) => {
            newNodes.push({
              id: component.name,
              type: 'awsNode',
              data: { label: component.name, role: component.role },
              position: { x: layerIndex * 300, y: compIndex * 100 + yOffset },
            });
          });
          yOffset += layer.components.length * 100 + 50;
        });

        setNodes(newNodes);
        //console.log('Generated Nodes:', JSON.stringify(newNodes, null, 2));

        // Create a Set of node IDs
        const nodeIds = new Set(newNodes.map((node) => node.id));

        // Generate dynamic edges with styling
        const newEdges = data.architecture.relationships
          .filter((rel) => nodeIds.has(rel.from) && nodeIds.has(rel.to))
          .map((rel) => ({
            id: `${rel.from}-to-${rel.to}`,
            source: rel.from,
            target: rel.to,
            type: 'smoothstep',
            label: rel.description || 'Connection',
            animated: true,
            style: { stroke: '#f00', strokeWidth: 2 },
          }));
        //console.log('Dynamic Edges Applied:', JSON.stringify(newEdges, null, 2));
        setEdges(newEdges);
      } else {
        setError(data.error + (data.details ? `: ${data.details}` : ''));
      }
    } catch (err) {
      setError(`Something went wrong: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug state updates
  //useEffect(() => {
    //console.log('Current Nodes in State:', JSON.stringify(nodes, null, 2));
    //console.log('Current Edges in State (Full Objects):', JSON.stringify(edges, null, 2));
  //}, [nodes, edges]);

  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.generatorContent}>
        <h2>Generate Your AWS System Architecture</h2>
        <p>
          Please provide a description of your IT system. I will then use Mistral AI to help me understand your architecture, and I will generate an AWS diagram based on that understanding. For instance, you could describe: A static Website
        </p>

        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your system requirements here..."
            rows="5"
            className={styles.textarea}
            disabled={isLoading}
          />
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Diagram'}
          </button>
        </form>

        {/* Loading Bar */}
        {isLoading && (
          <div className={styles.loadingBarContainer}>
            <div className={styles.loadingBar}></div>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {architectureJson && (
          <div className={styles.output}>
            <h3>Your Architecture</h3>
            {/* Diagram on top */}
            <div className={styles.diagram} style={{ height: '600px' }}>
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onInit={onInit}
                  nodeTypes={nodeTypes}
                  snapToGrid={true}
                  snapGrid={[15, 15]}
                >
                  <Background />
                  <Controls />
                  <MiniMap />
                </ReactFlow>
              </ReactFlowProvider>
            </div>
            {/* JSON on bottom */}
            <pre>
              <code>{JSON.stringify(architectureJson, null, 2)}</code>
            </pre>
          </div>
        )}

        {/* Raw Response for Debugging Large JSON */}
        {rawResponse && !architectureJson && (
          <div className={styles.output}>
            <h3>Raw Response (Failed to Parse)</h3>
            <pre>
              <code>{rawResponse}</code>
            </pre>
          </div>
        )}
      </section>

      <footer className={footerStyles.footer}>
        <Link href="/about">About Me</Link>
      </footer>
    </div>
  );
}

// Export dynamically with SSR disabled
export default dynamic(() => Promise.resolve(DiagramGeneratorComponent), {
  ssr: false,
});