#!/usr/bin/env python3
"""Crea imágenes ligeras conservando los originales; después actualiza el catálogo."""
import subprocess
import tempfile
import argparse
import re
from pathlib import Path
from importlib.machinery import SourceFileLoader

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'assets/fotos'
TARGET = ROOT / 'assets/optimizado'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--force', action='store_true', help='Regenera también las versiones existentes')
args = parser.parse_args()

def run(*args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)

for source in sorted(SOURCE.rglob('*')):
    if source.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
        continue
    for folder, size, quality in [('fotos', 1600, '80'), ('miniaturas', 480, '75')]:
        target = TARGET / folder / source.relative_to(SOURCE).with_suffix(source.suffix + '.webp')
        target.parent.mkdir(parents=True, exist_ok=True)
        if not args.force and target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
            continue
        with tempfile.TemporaryDirectory() as temporary:
            # Convertir directamente evita perder EXIF y evita el decodificador
            # de sips, que puede producir imágenes negras en algunos entornos.
            info = subprocess.check_output(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(source)], text=True)
            width = int(re.search(r'pixelWidth: (\d+)', info)[1])
            height = int(re.search(r'pixelHeight: (\d+)', info)[1])
            scale = min(1, size / max(width, height))
            resized = str(Path(temporary) / 'image.webp')
            run('cwebp', '-quiet', '-metadata', 'exif,icc', '-resize', str(max(1, round(width * scale))), str(max(1, round(height * scale))), '-q', quality, str(source), '-o', resized)
            Path(resized).replace(target)

catalog = SourceFileLoader('catalog', str(ROOT / 'actualizar-fotos.py')).load_module()
print(f'Catálogo actualizado: {catalog.update()} fotos y videos.')
