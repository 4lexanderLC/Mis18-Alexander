# Fotos y videos de la invitación

## Optimizar las fotos

Desde esta carpeta ejecuta `python3 optimizar-media.py`. Requiere `sips` (macOS) y `cwebp` (instalable con `brew install webp`). Conserva los originales en `assets/fotos/` y genera fotos WebP de hasta 1600 píxeles y miniaturas de hasta 480 píxeles en `assets/optimizado/`. El catálogo utiliza automáticamente estas versiones cuando están actualizadas. Al agregar o cambiar fotos, vuelve a ejecutar el comando.

Publica también `assets/optimizado/`, `assets/galeria.js` y `FIESTA18.js` junto con el resto del sitio.

Los videos aún requieren compresión aparte. En HandBrake puedes usar el preset Fast 720p30, formato MP4 y activar Web Optimized. Guarda una copia de los originales fuera de `assets/fotos/`, coloca los MP4 comprimidos en esa carpeta y ejecuta `python3 actualizar-fotos.py`.

1. Guarda las imágenes y los videos en `assets/fotos/`. Puedes usar cualquier nombre y subcarpetas.
2. Se admiten JPG, JPEG, PNG, WebP, AVIF y GIF, además de videos MP4 con sonido. Se muestran por nombre.

## Vista local con detección automática

Desde esta carpeta ejecuta:

```sh
python3 actualizar-fotos.py --serve
```

Abre `http://localhost:8000/FIESTA18.html`. Cada vez que entres a «Ver galería», se vuelve a leer la carpeta. Puedes agregar o quitar fotos sin modificar HTML ni JavaScript. Detén el servidor con Ctrl+C.

## Publicar o abrir directamente el HTML

Después de agregar o quitar fotos, ejecuta:

```sh
python3 actualizar-fotos.py
```

Sube `FIESTA18.html`, `FIESTA18.css`, `FIESTA18.js` y la carpeta `assets` completa, incluido `assets/galeria.js`. El alojamiento estático no puede listar automáticamente una carpeta: este archivo es el catálogo generado. No necesitas editarlo a mano.

La galería muestra dos columnas en celulares, permite ampliar fotos y pasar a la siguiente deslizando horizontalmente o usando las flechas. Si no hay fotos, muestra un mensaje. Usa imágenes comprimidas para que carguen rápido con datos móviles. Las fotos publicadas estarán disponibles para quienes puedan acceder al sitio.

## Agregar un video con sonido

1. Copia tu archivo `.mp4` a `assets/fotos/`, junto con las fotos.
2. Ejecuta `python3 actualizar-fotos.py` (o usa el servidor automático indicado arriba).
3. Abre «Ver galería», toca la miniatura marcada «Video» y pulsa reproducir. El visor incluye controles de sonido y pantalla completa según el navegador.

Al reproducir un video se pausa la música de la invitación. Al cerrar el visor o cambiar de elemento se pausa el video. Exporta los MP4 con video H.264 y audio AAC para mayor compatibilidad y comprímelos antes de subirlos.

Al entrar a «Ver galería» se abre el carrusel: cada foto permanece 2 segundos después de cargar y al llegar al final vuelve al inicio. Puedes pausar o continuar y usar las flechas. Los videos se reproducen con sus controles y avanzan al terminar.
