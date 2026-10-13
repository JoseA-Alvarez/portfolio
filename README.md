# José Álvarez · portfolio

Web personal con tres secciones: código, fotografía y vídeo. HTML, CSS y JavaScript sin frameworks ni build: se sube tal cual a GitHub Pages.

## Direcciones

- https://josea-alvarez.github.io/portfolio/ : portfolio completo (LinkedIn, GitHub)
- https://josea-alvarez.github.io/portfolio/foto/ : fotografía (Instagram, bodas, sesiones)
- https://josea-alvarez.github.io/portfolio/video/ : vídeo (marcas, redes)

## Estructura

```
index.html              portada completa (código, foto y vídeo)
foto/index.html         página solo de fotografía (para Instagram y clientes)
video/index.html        página solo de vídeo (para marcas y redes)
assets/css/styles.css   estilos
assets/js/data.js       TODO el contenido (textos, trayectoria, fotos, vídeos)
assets/js/main.js       interacción (portada, terminal, galería, editor de vídeo)
assets/img/foto/        tus fotos
assets/img/video/       pósters de los vídeos
assets/favicon.svg
.nojekyll               evita que GitHub Pages procese el sitio con Jekyll
```

Para cambiar contenido solo hace falta tocar `assets/js/data.js`.

## Añadir fotos

1. Exporta las fotos a unos 2000 px por el lado largo, en JPG o WebP de calidad 80 (unos 300–500 KB cada una).
2. Cópialas a `assets/img/foto/`, por ejemplo `bodas-01.jpg`.
3. En `data.js`, en `foto.fotos`, rellena `src` con la ruta y ajusta `ratio` a la proporción real (`"3/2"`, `"2/3"`, `"4/5"`…).
4. Pon un `alt` descriptivo si quieres mejorar accesibilidad y SEO.

Mientras `src` esté vacío se muestra un hueco de color con el nombre de archivo sugerido.

## Añadir vídeos

En `data.js`, en `video.clips`:

- `youtube`: el ID del vídeo (lo que va después de `v=`). Se reproduce dentro de la web.
- `url`: enlace a Vimeo, Instagram o TikTok. Se abre en otra pestaña.
- `poster`: imagen de portada en `assets/img/video/`.
- `inicio`, `dur`, `pista`: dónde aparece el clip en la línea de tiempo.

## Probar en local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

También funciona abriendo `index.html` con doble clic.

## Publicar en GitHub Pages

1. Crea un repositorio público llamado `TU-USUARIO.github.io` (la web quedará en `https://TU-USUARIO.github.io`). Si usas otro nombre, la URL será `https://TU-USUARIO.github.io/nombre-repo`.
2. Sube el contenido de esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Primera versión del portfolio"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-USUARIO.github.io.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. En uno o dos minutos la web está publicada.

### Dominio propio (opcional)

Añade un archivo `CNAME` con tu dominio (por ejemplo `josealvarez.dev`), configura en tu proveedor un registro CNAME hacia `TU-USUARIO.github.io` y activa **Enforce HTTPS** en Settings → Pages.

## Pendiente

- [ ] Correo de contacto en `persona.email`
- [ ] Instagram en `persona.instagram`
- [ ] Fotos reales en `foto.fotos`
- [ ] Vídeos reales en `video.clips`
- [ ] Revisar las etiquetas de tecnologías en `codigo.capacidades`
