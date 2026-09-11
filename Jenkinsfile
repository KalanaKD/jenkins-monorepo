pipeline {
    agent any
    tools {
        nodejs 'NodeJS-20'
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

        stage('Detect Changed Packages') {
            steps {
                script {
                    env.BASE_COMMIT = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT ?:
                            sh(script: "git rev-list --max-parents=0 HEAD", returnStdout: true).trim()

                    echo "Diffing against: ${env.BASE_COMMIT}"

                    def changedFiles = sh(
                            script: "git diff --name-only ${env.BASE_COMMIT} HEAD",
                            returnStdout: true
                    ).trim().split('\n')

                    echo "Changed files:\n${changedFiles.join('\n')}"

                    env.BUILD_LIB_A = changedFiles.any { it.startsWith('packages/lib-a/') }.toString()
                    env.BUILD_LIB_B = changedFiles.any { it.startsWith('packages/lib-b/') }.toString()
                    env.BUILD_LIB_C = changedFiles.any { it.startsWith('packages/lib-c/') }.toString()

                    echo "BUILD_LIB_A=${env.BUILD_LIB_A}  BUILD_LIB_B=${env.BUILD_LIB_B}  BUILD_LIB_C=${env.BUILD_LIB_C}"
                }
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

        stage('lib-a: Release') {
            when { environment name: 'BUILD_LIB_A', value: 'true' }
            environment {
                PKG_NAME = 'lib-a'
                PKG_PATH = 'packages/lib-a'
            }
            steps {
                sh '''
                    PREV_VERSION=$(git show ${BASE_COMMIT}:${PKG_PATH}/package.json 2>/dev/null | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).version" 2>/dev/null || echo none)
                    CURR_VERSION=$(node -p "require('./${PKG_PATH}/package.json').version")
                    echo "${PKG_NAME} version: ${PREV_VERSION} -> ${CURR_VERSION}"
                    if [ "$PREV_VERSION" = "$CURR_VERSION" ]; then
                        echo "ERROR: ${PKG_NAME} version was not bumped — failing before build/publish"
                        exit 1
                    fi
                '''
                sh 'npm run build:${PKG_NAME}'
                sh 'npm publish --workspace=${PKG_PATH}'
            }
        }

        stage('lib-b: Release') {
            when { environment name: 'BUILD_LIB_B', value: 'true' }
            environment {
                PKG_NAME = 'lib-b'
                PKG_PATH = 'packages/lib-b'
            }
            steps {
                sh '''
                    PREV_VERSION=$(git show ${BASE_COMMIT}:${PKG_PATH}/package.json 2>/dev/null | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).version" 2>/dev/null || echo none)
                    CURR_VERSION=$(node -p "require('./${PKG_PATH}/package.json').version")
                    echo "${PKG_NAME} version: ${PREV_VERSION} -> ${CURR_VERSION}"
                    if [ "$PREV_VERSION" = "$CURR_VERSION" ]; then
                        echo "ERROR: ${PKG_NAME} version was not bumped — failing before build/publish"
                        exit 1
                    fi
                '''
                sh 'npm run build:${PKG_NAME}'
                sh 'npm publish --workspace=${PKG_PATH}'
            }
        }

        stage('lib-c: Release') {
            when { environment name: 'BUILD_LIB_C', value: 'true' }
            environment {
                PKG_NAME = 'lib-c'
                PKG_PATH = 'packages/lib-c'
            }
            steps {
                sh '''
                    PREV_VERSION=$(git show ${BASE_COMMIT}:${PKG_PATH}/package.json 2>/dev/null | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).version" 2>/dev/null || echo none)
                    CURR_VERSION=$(node -p "require('./${PKG_PATH}/package.json').version")
                    echo "${PKG_NAME} version: ${PREV_VERSION} -> ${CURR_VERSION}"
                    if [ "$PREV_VERSION" = "$CURR_VERSION" ]; then
                        echo "ERROR: ${PKG_NAME} version was not bumped — failing before build/publish"
                        exit 1
                    fi
                '''
                sh 'npm run build:${PKG_NAME}'
                sh 'npm publish --workspace=${PKG_PATH}'
            }
        }
    }

    post {
        success { echo 'Release pipeline completed.' }
        failure { echo 'Release pipeline failed — check which stage above.' }
    }
}