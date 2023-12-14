## Description
An auction platform built with NestJS. This application provides the backend for bidders and auctioneers to engage in auction experiences.

## Installation
```bash
$ npm install
```

## Running the app
```bash
$ docker-compose up -d
$ npm run start:dev
```

## Test
```bash
  # unit tests
$ npm run test:unit

  # e2e tests
$ docker-compose up -d
$ npm run test:integration
```

## Running SonarQube

**1. Start SonarQube:**
Run the following command in your terminal to start SonarQube in detached mode:

```bash
$ docker-compose up -d sonarqube configure-sonar
```


**2. Access the SonarQube UI:**
Once SonarQube is running, open your browser and navigate to http://localhost:9000. Use the default credentials provided in the docker-compose.yml file:
 - Username: admin
 - Password: 123456


**3. Locate your project:**
Within the SonarQube dashboard, search for your auction-service project on the project list.

**4. Generate a SonarQube token:**
Access the auction-service on the project list project.

 - Generate a token for that project. 
 - Copy the generated token.
 
**5. Set the SonarQube token environment variable:**
Store the copied token in an environment variable:
```bash
$ export SONAR_TOKEN=TOKEN_FROM_UI
```

**6. Run code analysis:**
With the token set, execute the appropriate command to analyze your code:
```bash
$ npm run sonar:dev
```
