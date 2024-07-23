# <img src="./assets/home-fusion-logo.png" alt="Home Fusion Logo" width="32"/> Home Fusion OMS
*Home Fusion OMS* is an order management system in development that classifies clientele, consolidates data, and automates the order process of *Home Fusion*, a North Georgia new-home construction subcontractor. 

The current order process relies on the handwritten transcription of line items, referencing an item master that requires frequent changes. Once these orders are transcribed, they are relayed to an individual who separates items by vendor and places an order through a vendor representative. This application aims to address these process bottlenecks by eliminating the need for handwritten transcription as well as creating an automated order pipeline between business and vendor.

In respect to technical infrastructure, this application defines infrastructure as code through the use of *AWS CloudFormation* templates, allowing for the rapid deployment and teardown of a development stack, isolated from production. In addition, by leveraging the *AWS CodePipeline* suite of *CodeCommit*, *CodeBuild*, and *CodeDeploy*, all stacks utilize an automated code pipeline, initialized by every *git* commit or reversion, streamlining the rollout or rollback of new features.

Future features consist of the conversion of the current *PostgreSQL* relational database to *AWS DynamoDB*, motivated by its pay-per-request pricing model as well as its schematic flexibility, allowing for more efficient pulls of data per request using the *Single Table Design* approach among other benefits. Additionally, the automation of emails sent to vendors will leverage *AWS SNS*.

### <img src="./assets/home-fusion-logo.png" alt="Home Fusion Logo" width="24"/> [Home Fusion OMS Back End](https://github.com/rfridlender/fusion-back-end)

## Technologies Used

### Front End
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Nuxtjs](https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=#00DC82)
![Shell Script](https://img.shields.io/badge/shell_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![AWS Amplify](https://img.shields.io/badge/AWS-Amplify-ff9900?logo=awsamplify)
![AWS CloudFormation](https://img.shields.io/badge/AWS-CloudFormation-ff4f8b)
![AWS CodeCommit](https://img.shields.io/badge/AWS-CodeCommit-527fff)
![AWS CodeBuild](https://img.shields.io/badge/AWS-CodeBuild-527fff)
![AWS CodeDeploy](https://img.shields.io/badge/AWS-CodeDeploy-527fff)
![AWS CodePipeline](https://img.shields.io/badge/AWS-CodePipeline-527fff)
![AWS EventBridge](https://img.shields.io/badge/AWS-EventBridge-ff4f8b)
![AWS S3](https://img.shields.io/badge/AWS-S3-569a31?logo=amazons3)

### Back End
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Shell Script](https://img.shields.io/badge/shell_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white)

![AWS API Gateway](https://img.shields.io/badge/AWS-API_Gateway-8C4fff?logo=amazonapigateway&logoColor=8C4fff)
![AWS CloudFormation](https://img.shields.io/badge/AWS-CloudFormation-ff4f8b)
![AWS CodeCommit](https://img.shields.io/badge/AWS-CodeCommit-527fff)
![AWS CodeBuild](https://img.shields.io/badge/AWS-CodeBuild-527fff)
![AWS CodeDeploy](https://img.shields.io/badge/AWS-CodeDeploy-527fff)
![AWS CodePipeline](https://img.shields.io/badge/AWS-CodePipeline-527fff)
![AWS Cognito](https://img.shields.io/badge/AWS-Cognito-dd344c?logo=amazoncognito)
![AWS EC2](https://img.shields.io/badge/AWS-EC2-ff9900?logo=amazonec2)
![AWS EventBridge](https://img.shields.io/badge/AWS-EventBridge-ff4f8b)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-ff9900?logo=awslambda)
![AWS RDS](https://img.shields.io/badge/AWS-RDS-527fff?logo=amazonrds)
![AWS S3](https://img.shields.io/badge/AWS-S3-569a31?logo=amazons3)
![AWS Secrets Manager](https://img.shields.io/badge/AWS-%20Secrets_Manager-dd344c?logo=awssecretsmanager)

## Attributions
- Components from [shadcn-vue](https://github.com/radix-vue/shadcn-vue)
- Icons from [lucide](https://github.com/lucide-icons/lucide)

## Front-End Dummy Tools Documentation
*Dummy Tools* are a collection of *Bash* scripts created to expedite development. Alongside *Bash*, these scripts leverage the *AWS*, *Go*, and popular *golang-migrate* CLI tools to execute full units of work that are commonly needed during development. These units of work include building, deploying, or destroying *AWS CloudFormation* stacks, performing database migrations, and creating *AWS Cognito* users to generate tokens for API testing.

### Front-End Dependencies
- *Linux*
- *Bash*
- *git*
- [*npm*](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (for optionally building the front end locally outside of *AWS Amplify*)
- [*AWS CLI*](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)

The front-end stack is dependent on environment variables and resources deployed in the back-end stack; as a result, the [back-end stack](https://github.com/rfridlender/fusion-back-end) must be deployed first.

### Deploying *common* stack
- Note: The *common* stack contains resources that are shared between all environments; resources include this code repository, build artifact bucket, and basic build configuration
1. Build the stack
```
./dummy common
```

### Deploying the *dev* stack
- Note: The current stack is dictated by the current *git* branch; if the current branch name is `dev`, it will deploy an environment with resources postfixed with `dev`
1. If *git* is not initialized and branch is not set to `dev`
```
git init && git checkout -b dev
``` 
2. Deploy the stack into the cloud
    - Note: The front-end stack includes a code pipeline but would only be utilized if future resources were to be added; currently, the front-end stack is primarily deployed via Amplify 
```
./dummy deploy
```

### Setting up *dev* environment
    - Note: This is pulling environment variables set from the back-end stack
1. Pull your environment variables from the cloud
```
./dummy env
```
2. Create Cognito user to log into application if user is already not created
```
./dummy user {EMAIL} {PASSWORD}
```
3. Run development environment
```
npm run dev
```
4. Go to [http://localhost:3000](http://localhost:3000) to access development environment

### During development
1. Delete Cognito user if wanting to recreate
```
./dummy delete user
```

### Cleaning up *dev* stack
1. Delete stack
```
./dummy delete stack
```

### Cleaning up *common* stack
1. Delete stack
```
./dummy delete common
```
