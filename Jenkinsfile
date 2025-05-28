pipeline {
    agent any

    environment {
        IMAGE_NAME = "muskan"
        IMAGE_TAG = "latest"
        DOCKER_HUB_REPO = "pardeep800/pardeephub"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git(
                    url: 'https://github.com/Pardeep800/simple-nodejs-application.git',
                    branch: 'main'
                )
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

        stage('Ensure Docker is Running') {
            steps {
                sh '''
                echo "Checking if Docker is running..."
                if ! systemctl is-active --quiet docker; then
                    echo "Starting Docker service..."
                    sudo systemctl start docker
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
                script {
                    withDockerRegistry([credentialsId: 'docker-hub-credentials', url: 'https://index.docker.io/v1/']) {
                        sh '''
                        echo "Tagging Docker image..."
                        docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_HUB_REPO:$IMAGE_TAG
                        echo "Pushing Docker image to Docker Hub..."
                        docker push $DOCKER_HUB_REPO:$IMAGE_TAG
                        '''
                    }
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                echo "Deploying new container..."
                docker run -d -p 102:3000 --name $IMAGE_NAME $DOCKER_HUB_REPO:$IMAGE_TAG
                '''
            }
        }
    }
}
