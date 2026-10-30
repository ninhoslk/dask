# Frames da abertura cinematográfica

Gerados a partir de `Aerial_view_of_school_building_d6892a9f_1080p.mp4`
(1920×1080, 24 fps, 190 frames, 7,9 s) com ffmpeg:

```bash
# desktop: todos os frames, 1440 px de largura
ffmpeg -i video.mp4 -an -vf "scale=1440:-2:flags=lanczos" -c:v libwebp -quality 55 -compression_level 6 -preset photo -start_number 0 desktop/%03d.webp

# celular: um frame a cada dois, recorte vertical 9:16 centrado
ffmpeg -i video.mp4 -an -vf "select='not(mod(n\,2))',crop=ih*9/16:ih,scale=720:-2:flags=lanczos" -fps_mode vfr -c:v libwebp -quality 55 -compression_level 6 -preset photo -start_number 0 mobile/%03d.webp

# posters (primeiro frame)
ffmpeg -i video.mp4 -an -vf "select='eq(n\,0)',scale=1600:-2" -frames:v 1 -q:v 3 poster.jpg
ffmpeg -i video.mp4 -an -vf "select='eq(n\,0)',crop=ih*9/16:ih,scale=720:-2" -frames:v 1 -q:v 3 poster-mobile.jpg
```

Para outro vídeo, regenere as pastas e atualize `quantidade` em
`lib/hero-cinematico.ts`.
