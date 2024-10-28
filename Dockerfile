FROM python:3.12-slim

WORKDIR /server

COPY requirements.txt .

RUN python3 -m venv .venv
RUN .venv/bin/pip install -r requirements.txt

COPY server.py .

# copy the static files
COPY static static
COPY templates templates

CMD [".venv/bin/gunicorn", "--bind", "0.0.0.0:80", "server:srv"]