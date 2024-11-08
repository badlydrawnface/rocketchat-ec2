#!/bin/bash

# ========================================================================
#                          EC2 Instance Teardown Script
# ========================================================================

# ----------------------------
# Variables
# ----------------------------
INSTANCE_ID="i-00d5f5a1688319c43"  # Replace with your EC2 instance ID
SECURITY_GROUP_ID="sg-09c7d53fb58be41ff"  # Replace with your security group ID

# ----------------------------
# Terminate the EC2 Instance
# ----------------------------
echo "Terminating EC2 instance $INSTANCE_ID..."
aws ec2 terminate-instances --instance-ids $INSTANCE_ID

# Wait for the instance to be terminated
aws ec2 wait instance-terminated --instance-ids $INSTANCE_ID
echo "EC2 instance $INSTANCE_ID has been terminated."

# ----------------------------
# Delete the Security Group
# ----------------------------
echo "Deleting security group $SECURITY_GROUP_ID..."
aws ec2 delete-security-group --group-id $SECURITY_GROUP_ID
echo "Security group $SECURITY_GROUP_ID has been deleted."

# ----------------------------
# Completion Message
# ----------------------------
echo "All resources have been successfully removed."
