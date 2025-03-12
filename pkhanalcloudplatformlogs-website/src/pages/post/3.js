import Navbar from '../../components/Navbar';
import styles from '../../styles/Post.module.css';
import footerStyles from '../../styles/Footer.module.css'; // Renamed to avoid confusion with "footer" component
import Link from 'next/link';

// Use named export for consistency with Next.js conventions
export default function Post3() {
  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.blogContent}>
        <h2>Streamlining DevOps with AWS CDK</h2>

        <p>
          The <strong>AWS Cloud Development Kit (CDK)</strong> is a powerful framework that allows developers and DevOps engineers to define cloud infrastructure using familiar programming languages like TypeScript, Python, or JavaScript. Unlike traditional CloudFormation templates, CDK brings a programmatic approach to infrastructure as code (IaC), making it a game-changer for modern DevOps workflows.
        </p>

        <h3>Why Use AWS CDK in DevOps?</h3>

        <p>The AWS CDK enhances DevOps practices because it:</p>
        <ul>
          <li><strong>Simplifies infrastructure definition</strong> using code instead of YAML/JSON</li>
          <li><strong>Enables reusable components</strong> through constructs and patterns</li>
          <li><strong>Integrates with CI/CD pipelines</strong> for automated deployments</li>
          <li><strong>Provides type safety and IDE support</strong> for faster development</li>
        </ul>

        <h3>Defining Infrastructure with AWS CDK</h3>

        <p>
          With CDK, you can define an EC2 instance, configure it, and deploy applications programmatically. Below is an example of how I use CDK with TypeScript to set up an EC2 instance and install <strong>Node.js</strong> automatically.
        </p>

        <h4>AWS CDK Example: EC2 Instance with Node.js</h4>

        <pre>
          <code>
            {`import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class MyEc2Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define a VPC
    const vpc = new ec2.Vpc(this, 'MyVPC', {
      maxAzs: 2,
    });

    // Define the EC2 instance
    const instance = new ec2.Instance(this, 'MyInstance', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      userData: ec2.UserData.forLinux(),
    });

    // Add UserData to install Node.js
    instance.userData.addCommands(
      'sudo yum update -y',
      'curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -',
      'sudo yum install -y nodejs',
      'node --version > /home/ec2-user/node_version.txt',
    );

    // Add permissions if needed
    instance.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
    );
  }
}

const app = new cdk.App();
new MyEc2Stack(app, 'MyEc2Stack');
`}
          </code>
        </pre>

        <h3>Deploying with AWS CDK</h3>

        <p>Once the CDK stack is defined, I deploy it using the CDK CLI:</p>

        <pre>
          <code>
            {`# Initialize the CDK project
cdk init app --language typescript

# Install dependencies
npm install aws-cdk-lib

# Deploy the stack
cdk deploy MyEc2Stack
`}
          </code>
        </pre>

        <p>
          This automates the creation of the EC2 instance with Node.js installed, integrating seamlessly into a DevOps pipeline.
        </p>

        <h3>Key Benefits of AWS CDK in DevOps</h3>

        <ul>
          <li><strong>Code-driven IaC</strong> reduces errors and improves maintainability</li>
          <li><strong>Modular design</strong> allows teams to share and reuse infrastructure patterns</li>
          <li><strong>CI/CD integration</strong> enables automated testing and deployment</li>
          <li><strong>Faster iteration</strong> with real-time feedback via CDK synth</li>
        </ul>

        <h3>Final Thoughts</h3>

        <p>
          The <strong>AWS CDK</strong> transforms DevOps by bringing software engineering principles to infrastructure management. Whether provisioning resources, automating deployments, or scaling applications, CDK empowers teams to work faster and more efficiently.
        </p>
      </section>

      <footer className={footerStyles.footer}>
        <Link href="/about">About Me</Link>
        <Link href="/diagram-generator">Arch</Link>
      </footer>
    </div>
  );
}