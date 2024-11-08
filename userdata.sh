#!/bin/bash
# Update the system and install necessary packages
dnf install -y git python3 docker

# Enable and start Docker service
systemctl enable --now docker

# Add ec2-user to the Docker group
usermod -aG docker ec2-user

# Refresh the group permissions (this might not take effect until next login)
newgrp docker

# Clone the GitHub repository as ec2-user
su - ec2-user -c "git clone https://github.com/cs399f24/chatroom_ec2_flask_docker_s3"

# Change to the repository directory
cd /home/ec2-user/chatroom_ec2_flask_docker_s3

# Build the Docker image
docker build -t flask-chat .

# Run the Docker container
docker run -d -p 80:80 flask-chat
