#!/bin/bash
dnf install -y git python3
git clone https://github.com/badlydrawnface/rocketchat-ec2
cd rocketchat-ec2
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
gunicorn -w 1 -b 0.0.0.0:80 server:srv