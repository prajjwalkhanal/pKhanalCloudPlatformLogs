import Navbar from '../../components/Navbar';
import styles from '../../styles/Post.module.css';
import footerStyles from '../../styles/Footer.module.css';
import Link from 'next/link';

export default function Post5() {
  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.blogContent}>
        <h2>Monitoring Websites with AWS CloudWatch Synthetics Canaries</h2>
        <p className={styles.date}>Published on March 8, 2025</p>

        <h3>Introduction</h3>

        <p>
          Keeping websites online is a big part of my job as a DevOps Engineer, and I’ve found <strong>AWS CloudWatch Synthetics Canaries</strong> to be a simple yet powerful way to do it. I’m excited to share how I use them with <strong>CloudFormation</strong> to monitor sites and get alerts when something goes wrong—especially in the healthcare industry where uptime matters.
        </p>

        <h3>Why CloudWatch Synthetics Canaries?</h3>

        <p>Canaries are automated scripts that check your websites like a user would. Here’s why I like them:</p>
        <ul>
          <li><strong>Reliable Checks</strong>: They test availability and catch issues early.</li>
          <li><strong>Automation</strong>: No more manual pings—just set it up and let it run.</li>
          <li><strong>Alerts</strong>: Pair them with SNS to get notified when a site’s down.</li>
          <li><strong>Flexibility</strong>: Customize scripts to check what matters to you.</li>
        </ul>

        <h3>Monitoring Australian Websites</h3>

        <p>
          I recently set up a Canary to monitor some Australian sites—<strong>qantas.com.au</strong>, <strong>news.com.au</strong>, and <strong>domain.com.au</strong>. The script checks each site, logs details, and sends an SNS alert with a screenshot if anything fails. Here’s the CloudFormation template I used to deploy it.
        </p>

        <h4>CloudFormation Template with Canary and SNS</h4>
        
        <pre>
          <code>
            {`AWSTemplateFormatVersion: '2010-09-09'
Description: 'CloudFormation template for a CloudWatch Synthetics Canary to monitor Australian websites with SNS alerts'

Resources:
  CanaryBucket:
    Type: 'AWS::S3::Bucket'
    Properties:
      BucketName: !Sub 'website-monitoring-canary-\${AWS::Region}-\${AWS::AccountId}'
      LifecycleConfiguration:
        Rules:
          - Id: 'ExpireObjectsAfter30Days'
            Status: 'Enabled'
            ExpirationInDays: 30

  SNSTopic:
    Type: 'AWS::SNS::Topic'
    Properties:
      TopicName: 'WebsiteDownAlerts'

  CanaryRole:
    Type: 'AWS::IAM::Role'
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: 'Allow'
            Principal:
              Service: 'lambda.amazonaws.com'
            Action: 'sts:AssumeRole'
      Policies:
        - PolicyName: 'CanaryExecutionPolicy'
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: 'Allow'
                Action:
                  - 'logs:CreateLogGroup'
                  - 'logs:CreateLogStream'
                  - 'logs:PutLogEvents'
                Resource: '*'
              - Effect: 'Allow'
                Action:
                  - 's3:PutObject'
                  - 's3:GetObject'
                Resource: !Sub 'arn:aws:s3:::\${CanaryBucket}/*'
              - Effect: 'Allow'
                Action:
                  - 's3:GetBucketLocation'
                Resource: !Sub 'arn:aws:s3:::\${CanaryBucket}'
              - Effect: 'Allow'
                Action:
                  - 'cloudwatch:PutMetricData'
                Resource: '*'
              - Effect: 'Allow'
                Action:
                  - 'synthetics:*'
                Resource: '*'
              - Effect: 'Allow'
                Action:
                  - 'sns:Publish'
                Resource: !Ref SNSTopic

  WebsiteMonitoringCanary:
    Type: 'AWS::Synthetics::Canary'
    Properties:
      Name: 'WebsiteMonitoringCanary'
      Code:
        Handler: 'index.handler'
        Script: |
          const synthetics = require('Synthetics');
          const log = require('SyntheticsLogger');
          const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

          const snsClient = new SNSClient({ region: process.env.AWS_REGION });

          const urls = [
            'https://www.qantas.com.au',
            'https://www.news.com.au',
            'https://www.domain.com.au',
          ];

          log.info('Generated URLs: ' + JSON.stringify(urls));

          const snsTopicArn = process.env.SNS_TOPIC_ARN;

          async function checkWebsites() {
            let page = await synthetics.getPage();

            for (let url of urls) {
              let pageContent = '';
              try {
                log.info('Checking: ' + url);

                const response = await page.goto(url, { waitUntil: 'load', timeout: 90000 });

                const requestHeaders = await page.evaluate(() => {
                  return JSON.stringify(window.performance.getEntriesByType('resource'));
                });
                log.info(\`Request Headers for \${url}: \${requestHeaders}\`);

                if (!response || !response.ok()) {
                  throw new Error(\`Failed to load \${url} (Status: \${response ? response.status() : 'No Response'})\`);
                }

                log.info(\`Response Headers for \${url}: \${JSON.stringify(response.headers())}\`);

                if (response.status() === 301) {
                  const redirectedUrl = response.headers()['location'];
                  log.info(\`Redirected to: \${redirectedUrl}\`);
                  if (!redirectedUrl || !redirectedUrl.startsWith('https://')) {
                    throw new Error(\`Invalid or missing redirect URL for \${url}\`);
                  }
                  log.info(\`Final redirect location for \${url}: \${redirectedUrl}\`);
                }

                pageContent = await page.content();
                if (!pageContent || pageContent.trim().length < 150) {
                  throw new Error(\`Invalid page content detected for \${url}. Content length: \${pageContent.trim().length}\`);
                }

                log.info(\`Page Content for \${url}: \${pageContent.substring(0, 500)}...\`);

                if (pageContent.includes('error1') || pageContent.includes('error2') || pageContent.includes('error3') || pageContent.includes('error4') || pageContent.includes('error5')) {
                  throw new Error(\`Detected error or missing content in \${url}\`);
                }

                log.info(\`\${url} is UP\`);
              } catch (error) {
                log.error(\`Website Down: \${url}, Error: \${error.message}\`);

                try {
                  const screenshotName = \`screenshot-\${Date.now()}.png\`;
                  await synthetics.takeScreenshot(screenshotName, 'fail');
                  log.info(\`Screenshot taken for failed website: \${screenshotName}\`);

                  const command = new PublishCommand({
                    Message: \`ALERT: Website DOWN - \${url}. Error: \${error.message}. Screenshot: \${screenshotName}\`,
                    Subject: 'Website Down Alert',
                    TopicArn: snsTopicArn,
                  });

                  await snsClient.send(command);
                  log.info(\`SNS Notification sent for \${url}\`);
                } catch (snsPublishError) {
                  log.error(\`SNS Notification Failed: \${snsPublishError}\`);
                }
              }
            }
          }

          exports.handler = async () => {
            await checkWebsites();
          };
      ExecutionRoleArn: !GetAtt CanaryRole.Arn
      RuntimeVersion: 'syn-nodejs-puppeteer-3.9'
      Schedule:
        Expression: 'rate(5 minutes)'
        DurationInSeconds: '3600'
      ArtifactS3Location: !Sub 's3://\${CanaryBucket}/canary-artifacts/'
      StartCanaryAfterCreation: true
      FailureRetentionPeriod: 31
      SuccessRetentionPeriod: 31
      EnvironmentVariables:
        SNS_TOPIC_ARN: !Ref SNSTopic

Outputs:
  CanaryName:
    Description: 'Name of the Canary'
    Value: !Ref WebsiteMonitoringCanary
  S3BucketName:
    Description: 'S3 Bucket for Canary artifacts'
    Value: !Ref CanaryBucket
  SNSTopicArn:
    Description: 'ARN of the SNS Topic for alerts'
    Value: !Ref SNSTopic
`}
          </code>
        </pre>

        <h3>Deploying the Template</h3>

        <p>To get this running, I deploy it with the AWS CLI:</p>

        <pre>
          <code>
            {`aws cloudformation deploy \\
  --template-file canary-template.yaml \\
  --stack-name WebsiteMonitoringStack \\
  --capabilities CAPABILITY_NAMED_IAM
`}
          </code>
        </pre>

        <p>
          Once deployed, the Canary checks the sites every 5 minutes and sends an SNS alert if anything’s off—complete with a screenshot for debugging.
        </p>

        <h3>What I’ve Learned</h3>

        <ul>
          <li><strong>Easy Setup</strong>: CloudFormation makes this repeatable and consistent.</li>
          <li><strong>Real-Time Alerts</strong>: SNS keeps me in the loop without constant monitoring.</li>
          <li><strong>Debugging Help</strong>: Screenshots are a lifesaver for figuring out what went wrong.</li>
          <li><strong>Scalability</strong>: Add more URLs or tweak the script as needed.</li>
        </ul>

        <h3>Final Thoughts</h3>

        <p>
          Using <strong>CloudWatch Synthetics Canaries</strong> with CloudFormation has been a practical way to keep tabs on websites. It’s one of those tools that quietly does its job, letting me focus on other challenges while knowing I’ll hear about any issues right away.
        </p>
      </section>

      <footer className={footerStyles.footer}>
        <Link href="/about">About Me</Link>
      </footer>
    </div>
  );
}