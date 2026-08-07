# Diagramas de interacción — Ruta Viva (G2 Turismo Inteligente)

Los diagramas están en formato Mermaid. Para presentarlos:
- pegar el bloque en <https://mermaid.live> y exportar como PNG, o
- reconstruirlos en **Miro / FigJam / Lucidchart** siguiendo la misma estructura.

---

## 1. Flujo de reconocimiento de gestos (Hand Tracking)

```mermaid
flowchart TD
    A[Cámara web 30 fps] --> B[MediaPipe Hand Landmarker<br/>21 landmarks normalizados]
    B --> C{¿Mano detectada?}
    C -- No --> D[Estado: sin detección<br/>ocultar cursor virtual]
    D --> B
    C -- Sí --> E[dedosArriba<br/>vector booleano de 5 dedos]
    E --> F[clasificarGesto<br/>reglas geométricas]
    F --> G{¿Estable 5 fotogramas?}
    G -- No --> B
    G -- Sí --> H{Tipo de gesto}
    H -- "☝️ Índice" --> I[moverCursor<br/>landmark 8 → x,y de pantalla<br/>elementFromPoint → resaltar tarjeta]
    H -- "✊ Puño" --> J[click en elemento resaltado<br/>abrir ficha del lugar]
    H -- "🖐️ Palma" --> K[cerrar detalle / cerrar chat / volver a Inicio]
    H -- "✌️ V" --> L[abrir o cerrar asistente Spondy]
    H -- "👍 Pulgar" --> M[guardar en favoritos]
    I --> N[Retroalimentación:<br/>cursor ámbar + borde de tarjeta + toast]
    J --> N
    K --> N
    L --> N
    M --> N
    N --> B
```

---

## 2. Arquitectura multimodal del sistema

```mermaid
flowchart LR
    subgraph ENTRADAS
        U1[🖱️ Mouse / teclado]
        U2[💬 Texto en lenguaje natural]
        U3[✋ Gestos por cámara]
    end

    subgraph PROCESAMIENTO
        P1[Controlador de la GUI<br/>vistas, filtros, búsqueda]
        P2[Motor de intenciones Spondy<br/>NLU por patrones + entidades]
        P3[MediaPipe Hand Landmarker<br/>clasificador de gestos]
    end

    E[(Estado compartido<br/>vista · filtro · selección · favoritos)]

    subgraph SALIDAS
        S1[Panel principal y tarjetas]
        S2[Burbujas del chat + sugerencias]
        S3[Cursor virtual + toast + esqueleto de mano]
    end

    U1 --> P1 --> E
    U2 --> P2 --> E
    U3 --> P3 --> E
    E --> S1
    E --> S2
    E --> S3

    P2 -. "acciones sobre la UI<br/>navegar / abrir ficha" .-> P1
    P3 -. "click sintético" .-> P1
```

---

## 3. Recorrido del usuario (tarea: "planificar fin de semana")

```mermaid
sequenceDiagram
    actor T as Turista
    participant G as Interfaz gráfica
    participant S as Spondy (chatbot)
    participant M as Hand Tracking

    T->>G: Abre Ruta Viva
    G-->>T: Hero + recomendados (★ ≥ 4.6)
    T->>S: "Arma un itinerario de 3 días"
    S->>S: intención = armar_itinerario
    S-->>T: Itinerario Salinas → Ayangue → Montañita
    S->>G: navegar('ruta')
    G-->>T: Vista "Mi ruta" con los 3 lugares
    T->>M: ☝️ apunta a la tarjeta de Ayangue
    M->>G: resalta tarjeta (gest-hover)
    T->>M: ✊ puño
    M->>G: click → abre la ficha
    G-->>T: Detalle con precio, temporada y cómo llegar
    T->>M: 👍 pulgar arriba
    M->>G: guardar en favoritos
    G-->>T: toast "⭐ Guardado en favoritos"
    T->>M: 🖐️ palma abierta
    M->>G: cerrar ficha y volver
```

---

## 4. Mapa gesto → acción

| Gesto | Landmarks clave | Regla de detección | Acción |
|---|---|---|---|
| ☝️ Índice | 8 vs 6 | 1 dedo arriba | Mover cursor / navegar |
| ✊ Puño | 8,12,16,20 vs 6,10,14,18 | 0 dedos arriba, pulgar recogido | Seleccionar / confirmar |
| 🖐️ Palma | los 4 dedos | ≥ 4 dedos extendidos | Regresar / cerrar |
| ✌️ V | 8,12 arriba; 16,20 abajo | 2 dedos arriba | Abrir / cerrar asistente |
| 👍 Pulgar | 4 vs 0 y 3 | solo pulgar, punta sobre la muñeca | Guardar en favoritos |

**Controles de estabilidad:** confirmación tras 5 fotogramas consecutivos (~160 ms) y anti-rebote de 900 ms entre acciones discretas.
