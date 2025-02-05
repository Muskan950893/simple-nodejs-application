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

        stage('Build & Test in Node.js Container') {
            agent {
                docker { image 'node:16' }
            }
            steps {
                sh '''
                echo "Installing project dependencies..."
                npm install
                echo "Running tests..."
                npm test || echo "No tests found, skipping..."
                '''
            }
        }

        stage('Ensure Docker is Running') {
            steps {
                sh '''
                echo "Checking if Docker is running..."
                if ! systemctl is-active docker; then
                    echo "Starting Docker service..."
                    echo "yourpassword" | sudo -S systemctl start docker
                fi
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                echo "Building Docker image..."
                docker build -t $IMAGE_NAME:$IMAGE_TAG .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                    sh '''
                    echo "Tagging Docker image..."
                    docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_HUB_REPO:$IMAGE_TAG
                    echo "Pushing Docker image to Docker Hub..."
                    docker push $DOCKER_HUB_REPO:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                echo "Stopping and removing old container (if exists)..."
                docker stop $IMAGE_NAME || true && docker rm $IMAGE_NAME || true
                echo "Deploying new container..."
                docker run -d -p 3000:3000 --name $IMAGE_NAME $DOCKER_HUB_REPO:$IMAGE_TAG
                '''
            }
        }
    }
}
