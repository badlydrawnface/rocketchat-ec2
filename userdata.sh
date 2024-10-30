#!/bin/bash
dnf in -y git python3
git clone https://github.com/cs399f24/rocketchat-ec2
cd rocketchat-ec2
python3 -m venv .venv
source .venv/bin/activate
pip install -r src/requirements.txt
cp src/chatroom.service /etc/systemd/system
systemctl enable chatroom
systemctl start chatroom
