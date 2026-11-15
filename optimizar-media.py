#!/usr/bin/env python3
"""Crea imágenes ligeras conservando los originales; después actualiza el catálogo."""
import subprocess
import tempfile
from pathlib import Path
from importlib.machinery import SourceFileLoader

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'assets/fotos'
TARGET = ROOT / 'assets/optimizado'

def run(*args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)

for source in sorted(SOURCE.rglob('*')):
    if source.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
        continue
    for folder, size, quality in [('fotos', 1600, '80'), ('miniaturas', 480, '75')]:
        target = TARGET / folder / source.relative_to(SOURCE).with_suffix(source.suffix + '.webp')
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
            continue
        with tempfile.TemporaryDirectory() as temporary:
            resized = str(Path(temporary) / 'image.png')
            run('sips', '-s', 'format', 'png', '-Z', str(size), str(source), '--out', resized)
            run('cwebp', '-quiet', '-q', quality, resized, '-o', str(target))

catalog = SourceFileLoader('catalog', str(ROOT / 'actualizar-fotos.py')).load_module()
print(f'Catálogo actualizado: {catalog.update()} fotos y videos.')
