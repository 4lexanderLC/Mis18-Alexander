#!/usr/bin/env python3
"""Genera el catálogo de fotos o sirve la invitación con catálogo automático."""
from pathlib import Path
import argparse
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import quote, urlsplit

ROOT = Path(__file__).resolve().parent
PHOTOS = ROOT / 'assets' / 'fotos'
CATALOG = ROOT / 'assets' / 'galeria.js'
EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.mp4'}

def update():
    PHOTOS.mkdir(parents=True, exist_ok=True)
    files = sorted((p for p in PHOTOS.rglob('*') if p.is_file() and p.suffix.lower() in EXTENSIONS), key=lambda p: str(p.relative_to(PHOTOS)).casefold())
    photos = [{'src': quote(p.relative_to(ROOT).as_posix(), safe='/'), 'type': 'video' if p.suffix.lower() == '.mp4' else 'image', 'alt': p.stem.replace('_', ' ').replace('-', ' ')} for p in files]
    CATALOG.write_text('window.GALLERY_PHOTOS = ' + json.dumps(photos, ensure_ascii=False) + ';\n', encoding='utf-8')
    return len(photos)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def do_GET(self):
        if urlsplit(self.path).path == '/assets/galeria.js':
            update()
        super().do_GET()
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--serve', action='store_true', help='Vista local con catálogo automático')
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    print(f'Catálogo actualizado: {update()} fotos y videos.')
    if args.serve:
        print(f'Abre http://localhost:{args.port}/FIESTA18.html')
        try:
            ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
        except KeyboardInterrupt:
            pass
