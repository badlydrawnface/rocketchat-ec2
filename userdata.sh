#!/bin/bash
dnf in -y git python3 docker
systemctl enable --now docker
su ec2-user -c "git clone https://github.com/cs399f24/rocketchat-ec2.git"
cd rocketchat-ec2
docker build -t rocket .
docker run -d -p 80:80 rocket
