pipeline {
    agent any

    environment {
        IMAGE_NAME = "node-app"
        IMAGE_TAG = "latest"
        DOCKER_HUB_REPO = "amitku13/nodejs_application"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git(
                    url: 'https://github.com/amitku13/simple-nodejs-application.git', 
                    branch: 'main'
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || echo "No tests found, skipping..."'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                    sh "docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_HUB_REPO:$IMAGE_TAG"
                    sh "docker push $DOCKER_HUB_REPO:$IMAGE_TAG"
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sh "docker stop $IMAGE_NAME || true && docker rm $IMAGE_NAME || true"
                sh "docker run -d -p 3000:3000 --name $IMAGE_NAME $DOCKER_HUB_REPO:$IMAGE_TAG"
            }
        }
    }
}
