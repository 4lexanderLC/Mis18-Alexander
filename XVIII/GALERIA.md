# Fotos de la invitación

1. Guarda las imágenes en `assets/fotos/`. Puedes usar cualquier nombre y subcarpetas.
2. Se admiten JPG, JPEG, PNG, WebP, AVIF y GIF. Se muestran por nombre.

## Vista local con detección automática

Desde esta carpeta ejecuta:

```sh
python3 actualizar-fotos.py --serve
```

Abre `http://localhost:8000/FIESTA18 AÑOS.html`. Cada vez que entres a «Ver galería», se vuelve a leer la carpeta. Puedes agregar o quitar fotos sin modificar HTML ni JavaScript. Detén el servidor con Ctrl+C.

## Publicar o abrir directamente el HTML

Después de agregar o quitar fotos, ejecuta:

```sh
python3 actualizar-fotos.py
```

Sube `FIESTA18 AÑOS.html`, `FIESTA18 AÑOS.css`, `FIESTA18 AÑOS.js` y la carpeta `assets` completa, incluido `assets/galeria.js`. El alojamiento estático no puede listar automáticamente una carpeta: este archivo es el catálogo generado. No necesitas editarlo a mano.

La galería muestra dos columnas en celulares, permite ampliar fotos y pasar a la siguiente deslizando horizontalmente o usando las flechas. Si no hay fotos, muestra un mensaje. Usa imágenes comprimidas para que carguen rápido con datos móviles. Las fotos publicadas estarán disponibles para quienes puedan acceder al sitio.
