import Navbar from "../../components/Navbar";
import styles from "../../styles/Post.module.css";
import footerStyles from "../../styles/Footer.module.css";
import Link from "next/link";

export default function Post1() {
  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.blogContent}>
        <h2>Automating AWS Deployments with PowerShell and cfn-init</h2>

        <p>
          Automation is a key part of modern DevOps, and <strong>Windows PowerShell</strong> is a powerful tool for managing AWS resources, deploying applications, and configuring servers. By integrating PowerShell with <strong>AWS CloudFormation</strong> and <strong>cfn-init</strong>, we can automate infrastructure setup and software installations efficiently.
        </p>

        <h3>Why Use PowerShell for AWS Automation?</h3>

        <p>PowerShell is useful for AWS DevOps because it:</p>
        <ul>
          <li><strong>Automates infrastructure provisioning</strong> using CloudFormation</li>
          <li><strong>Deploys vendor applications</strong> on EC2 instances</li>
          <li><strong>Handles software installation and server configuration</strong> with cfn-init</li>
          <li><strong>Integrates easily with AWS services</strong> like S3, IAM, and Lambda</li>
        </ul>

        <h3>Automating Software Installation with cfn-init</h3>

        <p>
          When launching an EC2 instance, manually installing software can be time-consuming. Instead, we can automate it using <strong>CloudFormation and cfn-init</strong>. Here’s an example of how I install <strong>MongoDB</strong> on a Windows EC2 instance automatically.
        </p>

        <h4>CloudFormation Template to Install MongoDB</h4>
        
        <pre>
          <code>
            {`Resources:
MyInstance:
  Type: AWS::EC2::Instance
  Properties:
    ImageId: ami-0abcdef1234567890
    InstanceType: t2.micro
    UserData:
      Fn::Base64: |
        <script>
        cfn-init.exe -v --stack MyStack --resource MyInstance --region us-east-1
        </script>
    Metadata:
      AWS::CloudFormation::Init:
        config:
            files:
                "C:\\install_mongo.ps1":
                    content: |
                        Write-Output "Downloading MongoDB..."
                        Invoke-WebRequest -Uri "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.2-signed.msi" -OutFile "C:\mongodb.msi"
                        Write-Output "Installing MongoDB..."
                        Start-Process msiexec.exe -ArgumentList '/i C:\mongodb.msi /quiet /norestart' -Wait
                        Write-Output "MongoDB Installation Complete!"
                    mode: "000644"
            commands:
                01_install_mongo:
                    command: "powershell.exe -ExecutionPolicy Unrestricted -File C:\\install_mongo.ps1"
`}
          </code>
        </pre>

        <h3>Deploying CloudFormation Stacks with PowerShell</h3>

        <p>Once the CloudFormation template is ready, I use PowerShell to deploy it:</p>

        <pre>
          <code>
            {`$stackName = "MyStack"
$templateFile = "C:\\path\\to\\template.yaml"

New-CFNStack -StackName $stackName -TemplateBody (Get-Content $templateFile -Raw)
Write-Output "CloudFormation stack $stackName is being created."
`}
          </code>
        </pre>

        <p>This eliminates manual setup and ensures <strong>consistent deployments</strong> across environments.</p>

        <h3>Key Benefits of This Approach</h3>

        <ul>
          <li><strong>Saves time</strong> by automating infrastructure and software installations</li>
          <li><strong>Ensures consistency</strong> across deployments</li>
          <li><strong>Scales easily</strong>, making it useful for large environments</li>
          <li><strong>Integrates seamlessly</strong> with AWS and DevOps pipelines</li>
        </ul>

        <h3>Final Thoughts</h3>

        <p>
          Using <strong>PowerShell with AWS CloudFormation</strong> and <strong>cfn-init</strong> is a game-changer for automating deployments. Whether setting up servers, installing software, or managing cloud resources, PowerShell helps make DevOps processes faster and more reliable.
        </p>
      </section>

      <footer className={footerStyles.footer}>
        <Link href="/about">About Me</Link>
        <Link href="/diagram-generator">Arch</Link>
      </footer>
    </div>
  );
}