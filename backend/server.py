import json
import os
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import uuid
from datetime import datetime

CONFIG = {
    'PORT': 3001,
    'ADMIN_PASSWORD': 'velociclos2024',
    'DATA_FILE': os.path.join(os.path.dirname(__file__), 'data', 'videos.json')
}

os.makedirs(os.path.dirname(CONFIG['DATA_FILE']), exist_ok=True)

if not os.path.exists(CONFIG['DATA_FILE']):
    with open(CONFIG['DATA_FILE'], 'w') as f:
        json.dump({'videos': []}, f, indent=2)

def load_videos():
    with open(CONFIG['DATA_FILE'], 'r') as f:
        return json.load(f)

def save_videos(data):
    with open(CONFIG['DATA_FILE'], 'w') as f:
        json.dump(data, f, indent=2)

class APIHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == '/api/videos':
            data = load_videos()
            self.send_json(data.get('videos', []))
            return

        if path == '/api/health':
            self.send_json({'status': 'ok', 'timestamp': datetime.now().isoformat()})
            return

        if path == '/admin/index.html':
            self.path = '/admin/index.html'
            super().do_GET()
            return

        self.send_error(404)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/api/videos':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))

            videos_data = load_videos()
            new_video = {
                'id': str(uuid.uuid4()),
                'videoId': data.get('videoId', ''),
                'title': data.get('title', ''),
                'description': data.get('description', ''),
                'module': data.get('module', ''),
                'createdAt': datetime.now().isoformat()
            }
            videos_data['videos'].append(new_video)
            save_videos(videos_data)

            self.send_json(new_video, status=201)
            return

        self.send_error(404)

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/videos/'):
            video_id = path.split('/')[-1]
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))

            videos_data = load_videos()
            index = next((i for i, v in enumerate(videos_data['videos']) if v['id'] == video_id), None)

            if index is None:
                self.send_error(404, 'Video not found')
                return

            videos_data['videos'][index].update(data)
            videos_data['videos'][index]['id'] = video_id
            save_videos(videos_data)

            self.send_json(videos_data['videos'][index])
            return

        self.send_error(404)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/videos/'):
            video_id = path.split('/')[-1]
            videos_data = load_videos()
            videos_data['videos'] = [v for v in videos_data['videos'] if v['id'] != video_id]
            save_videos(videos_data)
            self.send_response(204)
            self.end_headers()
            return

        self.send_error(404)

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def end_headers(self):
        super().end_headers()

def run():
    server = HTTPServer(('0.0.0.0', CONFIG['PORT']), APIHandler)
    print(f'Velociclos API running on http://localhost:{CONFIG["PORT"]}')
    print(f'Admin panel: http://localhost:{CONFIG["PORT"]}/admin/index.html')
    print(f'Password: {CONFIG["ADMIN_PASSWORD"]}')
    server.serve_forever()

if __name__ == '__main__':
    run()
