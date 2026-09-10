pipeline {
    agent any
    tools {
        nodejs 'NodeJS-20'
    }
    parameters {
        choice(
                name: 'PACKAGE',
                choices: ['lib-a', 'lib-b', 'lib-c'],
                description: 'Which package to build and publish'
        )
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kalanakd/jenkins-monorepo-test.git'
            }
        }
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Configure Registry') {
            steps {
                sh '''
                    echo "@monorepo-test:registry=http://172.17.0.1:4873/" > .npmrc
                    npm config set //172.17.0.1:4873/:_authToken=$(node -p "require('/root/.npmrc')" 2>/dev/null || echo "")
                '''
                // simplest reliable option: paste the token line from your local
                // ~/.npmrc (written by `npm adduser` above) as a Jenkins Secret
                // Text credential, same pattern as the real Nexus token
            }
        }
        stage('Build') {
            steps {
                sh "npm run build:${params.PACKAGE}"
            }
        }
        stage('Publish') {
            steps {
                sh "npm publish --workspace=packages/${params.PACKAGE}"
            }
        }
    }
}