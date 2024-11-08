#!/bin/bash

# ========================================================================
#                          EC2 Instance Setup Script
# ========================================================================

# ----------------------------
# Variables
# ----------------------------
AMI_ID="ami-0c55b159cbfafe1f0"  # Amazon Linux 2 AMI for us-east-2
INSTANCE_TYPE="t2.micro"          # Instance type
KEY_NAME="vockey"                 # Your key pair name
SECURITY_GROUP_NAME="httpssh"     # Security group name

# ----------------------------
# Create Security Group
# ----------------------------
SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name $SECURITY_GROUP_NAME --description "Security group for HTTP/SSH (80/22) access" --query 'GroupId' --output text)

# ----------------------------
# Authorize Inbound HTTP and SSH Traffic
# ----------------------------
aws ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 22 --cidr 0.0.0.0/0

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
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-group-ids $SECURITY_GROUP_ID \
    --user-data "$USER_DATA" \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=chatroom_ec2_flask_docker_s3_cli}]'

# ----------------------------
# Completion Message
# ----------------------------
echo "EC2 instance creation initiated with user data. Please check the AWS console for status."
