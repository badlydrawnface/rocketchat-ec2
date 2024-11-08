#!/bin/bash

# ========================================================================
#                          EC2 Instance Setup Script
# ========================================================================

# ----------------------------
# Variables
# ----------------------------
AMI_ID="ami-0123456789abcdef0"  # Replace with your desired AMI ID
INSTANCE_TYPE="t2.micro"          # Replace with the instance type you want
KEY_NAME="MyKeyPair"               # Replace with your key pair name
SECURITY_GROUP_ID="sg-0123456789abcdef0"  # Replace with your security group ID
SUBNET_ID="subnet-0123456789abcdef0"      # Replace with your subnet ID

# ----------------------------
# User Data Script
# ----------------------------
USER_DATA='#!/bin/bash
# Update the system and install necessary packages
yum update -y
yum install -y git python3 docker

# Enable and start Docker service
systemctl enable --now docker

# Add ec2-user to the Docker group
usermod -aG docker ec2-user

# Refresh the group permissions (this might not take effect until next login)
newgrp docker

# Clone the GitHub repository as ec2-user
su - ec2-user -c "git clone https://github.com/cs399f24/chatroom_ec2_flask_docker_s3.git"

# Change to the repository directory
cd /home/ec2-user/chatroom_ec2_flask_docker_s3

# Build the Docker image
docker build -t chatroom-app .

# Run the Docker container
docker run -d -p 80:80 chatroom-app
'

# ----------------------------
# Create the EC2 Instance with User Data
# ----------------------------
aws ec2 run-instances \
    --image-id $AMI_ID \
    --count 1 \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-group-ids $SECURITY_GROUP_ID \
    --subnet-id $SUBNET_ID \
    --user-data "$USER_DATA"

# ----------------------------
# Completion Message
# ----------------------------
echo "EC2 instance creation initiated with user data. Please check the AWS console for status."
