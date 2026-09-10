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
    environment {
        VERDACCIO_TOKEN = credentials('verdaccio-test-token')
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Code already checked out by Jenkins via SCM.'
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
                    echo "//172.17.0.1:4873/:_authToken=${VERDACCIO_TOKEN}" >> .npmrc
                '''
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
