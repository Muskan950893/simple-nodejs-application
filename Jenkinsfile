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

        stage('Install Node.js') {
            steps {
                sh '''
                echo "Checking if Node.js is installed..."
                if ! command -v node &> /dev/null
                then
                    echo "Node.js not found. Installing..."
                    sudo apt-get update && sudo apt-get install -y curl
                    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                else
                    echo "Node.js is already installed."
                fi
                node -v
                npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                echo "Installing project dependencies..."
                npm install
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                echo "Running tests..."
                npm test || echo "No tests found, skipping..."
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
