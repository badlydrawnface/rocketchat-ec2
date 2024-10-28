from flask import Flask, send_from_directory, render_template

srv = Flask(__name__)

@srv.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    srv.run(host='0.0.0.0', port=8000)