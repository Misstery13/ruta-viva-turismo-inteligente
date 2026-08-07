# Ruta Viva · Turismo Inteligente (G2)

Interfaz inteligente multimodal para el Examen Práctico de **Diseño de Interacción Hombre–Máquina e Inteligencia Artificial**.
Escenario asignado: **G2 — Turismo Inteligente** (Ruta del Spondylus, Ecuador).

## Cómo ejecutarlo

Doble clic en `index.html` — se abre en el navegador, sin instalar nada.

Para que el **hand tracking funcione** hace falta servirlo por HTTP (los navegadores bloquean la cámara en `file://`):

```bash
python3 -m http.server 8000
```

Luego abre <http://localhost:8000> y pulsa **Gestos → Iniciar cámara**.
Requiere conexión a internet la primera vez (descarga el modelo de MediaPipe desde CDN).

> Sin cámara la demo igual funciona: el panel de gestos incluye un **modo de simulación** (☝️ ✊ 🖐️ ✌️ 👍) que ejecuta exactamente las mismas acciones.

## Documento a entregar

- **`ENTREGABLE-G2-Turismo-Inteligente.pdf`** — informe final, 20 páginas con portada
- `ENTREGABLE-G2-Turismo-Inteligente.docx` — misma versión en Word, por si hay que editarla
- `ENTREGABLE.md` — fuente en Markdown

## Qué incluye

| Requisito del examen | Dónde está |
|---|---|
| 1. Diseño de la interfaz (5 pts) | `index.html` · prompt y explicación en `ENTREGABLE.md` §1 |
| 2. Chatbot parametrizado (5 pts) | Asistente **Spondy** en `index.html` · parametrización en `chatbot-config.json` |
| 3. Hand Tracking (5 pts) | MediaPipe Hand Landmarker · 5 gestos · diagrama en `docs/diagrama-interaccion.md` |
| 4. Evaluación UX asistida por IA (3 pts) | `ENTREGABLE.md` §4 |
| 5. Reflexión final (2 pts) | `ENTREGABLE.md` §5 |

## Gestos implementados

| Gesto | Acción |
|---|---|
| ☝️ Índice extendido | Mover cursor virtual / navegar |
| ✊ Puño cerrado | Seleccionar / confirmar |
| 🖐️ Palma abierta | Regresar / cerrar |
| ✌️ Dos dedos | Abrir / cerrar asistente |
| 👍 Pulgar arriba | Guardar en favoritos |

## Capturas

Generadas en `assets/`. Para regenerarlas o crear nuevas, la app acepta un parámetro de demostración:

- `index.html?demo=chat` — abre el chat y reproduce una conversación de ejemplo
- `index.html?demo=gestos` — abre el panel de gestos con el cursor virtual activo
- `index.html?demo=detalle` — abre la ficha de un destino
- `index.html?demo=ruta` — abre la vista del itinerario

## Créditos de imágenes

Las fotografías de `assets/` provienen de fuentes públicas de internet y se usan **únicamente con fines académicos** para este examen: destinos (Montañita, Ayangue, Salinas, Baños, Galápagos, Cuenca, Quilotoa, Museo Amantes de Sumpa), restaurantes (Cevichería Lojanita, Doña Elena) y hospedaje (Hotel Mar Adentro, Hostal Punto Verde, Spondylus Beach Resort, Ecolodge Bosque Seco).

Los precios, horarios y valoraciones de la base de datos son **estimaciones de demostración**, no información comercial verificada. Los dos establecimientos sin fotografía (Terraza Pacífico y Café Spondylus) usan un marcador con emoji.

## Responsive

| Ancho | Comportamiento |
|---|---|
| > 880 px | Menú lateral persistente en columna |
| ≤ 880 px | Encabezado en dos filas, menú horizontal deslizable con degradado indicador |
| ≤ 560 px | Botones solo con icono, grilla de una columna |
| ≤ 380 px | Se oculta el subtítulo de la marca |

Capturas: `assets/captura-tablet.png` (768 px) y `assets/captura-movil.png` (390 px).

## Atajos de teclado

- `/` — enfocar el buscador
- `Esc` — cerrar ficha o chat
- `Tab` — navegación completa con foco visible
