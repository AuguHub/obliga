# Obliga · versión 1.2.0

App de estudio para el celular: 6 módulos del primer parcial, 24 lecciones y 96 ejercicios generales. Incluye explicaciones, ejemplos, asociaciones, secuencias, verdadero/falso, selección múltiple, repetición espaciada, tarjetas, XP y simulacro de 24 preguntas (4 por módulo). Conserva 4 lecciones posteriores con 16 ejercicios en la biblioteca extra.

## Casos de los Word

La sección principal contiene **130 casos con sus 410 consignas originales**:

| Documento | Casos | Consignas |
|---|---:|---:|
| Obligaciones civiles y comerciales · Unidad 1 | 50 | 50 |
| Unidad 3 · Casos | 40 | 160 |
| Casos Unidad 4 | 10 | 50 |
| Contrato de locación | 10 | 50 |
| Leasing · Unidad 5 | 10 | 50 |
| Comodato | 10 | 50 |

Cada ficha mantiene el enunciado y las consignas, agrega una decisión o cálculo, pistas y una guía orientativa específica. El desarrollo escrito se guarda para comparar: **no se evalúa automáticamente**. El porcentaje sólo mide la decisión breve. Se puede buscar por nombre o concepto, filtrar por tema y marcar casos para repasar.

Hay 260 pasos en los casos Word (130 decisiones/cálculos + 130 desarrollos que agrupan las consignas originales). La **práctica extra** conserva por separado los 23 casos y 2 talleres anteriores con 77 pasos, identificando PPT, PDF o apunte de origen. No se cuentan como casos de los seis Word. Los casos no alteran XP ni el simulacro general.

La numeración de Unidad 3 es 1–20 y 30–49; el documento no incluye 21–29. En Unidad 1, los casos 1–30 se identifican por orden dentro de los rangos expresos; 31–50 tienen número explícito. La correspondencia completa está en [CASOS-INCLUIDOS.md](CASOS-INCLUIDOS.md).

Las guías no son respuestas oficiales. Señalan hipótesis faltantes, diferencias entre regímenes temporales y premisas a corregir, como responsabilidad por fortuito en comodato, inscripción solicitada versus practicada en leasing, seguro obligatorio versus cobertura de daño propio, y cálculo de resolución anticipada en locación. Las referencias normativas están en cada ficha.

El progreso previo se conserva, incluidos los identificadores de casos extra y lecciones posteriores. Exportar e importar incluye desarrollos, pistas y marcas de repaso. Una pestaña abierta con versión anterior debe recargarse conectada para recibir la actualización.

## Probar en la computadora

En Windows, hacé doble clic en **Abrir-app.cmd** y abrí la dirección que muestra. Usa Node.js instalado o el que ya incluye Codex en esta computadora. Dejá esa ventana abierta mientras estudiás.

Para abrirla manualmente necesitás Node.js 22 o superior. No requiere instalar paquetes.

1. Extraé el ZIP y abrí una terminal en la carpeta que contiene `package.json`.
2. Ejecutá `node server.mjs` (también podés usar `npm start`).
3. Abrí `http://127.0.0.1:4173`.

No abras `index.html` con doble clic: los módulos y la instalación sin conexión necesitan un servidor. La dirección local solo funciona en esa computadora.

## Publicar en GitHub Pages

Repositorio: https://github.com/AuguHub/obliga

Enlace de la app: https://auguhub.github.io/obliga/

La publicación se actualiza mediante GitHub Actions cuando se suben cambios a `main`. Para replicar el proyecto en otra cuenta:

1. Creá un repositorio en GitHub (por ejemplo, `obliga`). Para GitHub Pages gratuito en una cuenta personal, usá un repositorio público.
2. Subí **el contenido** de esta carpeta a la raíz del repositorio, incluyendo `.github/workflows/pages.yml`. `package.json`, `dist` y `.github` deben quedar en la raíz, sin una carpeta adicional envolviéndolos. GitHub Desktop permite incluir fácilmente las carpetas que empiezan con punto.
3. Usá `main` como rama principal. En **Settings → Pages → Build and deployment → Source**, elegí **GitHub Actions**.
4. En **Actions**, abrí **Publicar Obliga** y ejecutá **Run workflow** si no se inició al subir los archivos.
5. Cuando termine, GitHub mostrará el enlace de Pages. Tiene la forma `https://TU-USUARIO.github.io/TU-REPOSITORIO/`.

El flujo ejecuta las pruebas y publica únicamente `dist`. Las rutas relativas admiten cualquier nombre de repositorio. No necesita claves, base de datos ni servicios pagos. Si cambiás la rama principal, actualizá el disparador de `.github/workflows/pages.yml`.

## Usar en el celular

Abrí el enlace HTTPS publicado en el navegador del celular. En Android, elegí **Instalar app** o **Agregar a pantalla de inicio** desde el menú de Chrome. En iPhone, abrilo en Safari y elegí **Compartir → Agregar a pantalla de inicio**. El nombre de la opción puede variar según la versión.

Esperá a que termine la primera carga. En **Mi avance** aparece el estado sin conexión. Las lecciones y actividades se guardan en el dispositivo; los enlaces a normas externas necesitan Internet. El sistema puede eliminar datos si borrás el almacenamiento del navegador o por restricciones de espacio.

## Tu progreso

El progreso queda en el navegador/dispositivo donde practicás. No se sincroniza entre el celular y la computadora. Usá **Mi avance → Exportar progreso** y luego **Importar copia** en el otro dispositivo. Importar reemplaza el progreso local, previa confirmación.

Los aciertos dan 10 XP por pregunta, una vez por día. Los errores vuelven inmediatamente; los aciertos se programan a 1, 3, 7 y 14 días según la serie de respuestas correctas. El simulacro toma preguntas del mismo banco de práctica; no son inéditas ni preguntas oficiales de la materia.

## Alcance académico

Se toma como fuente de alcance **Cronograma- Obligaciones-Contratos y Sociedades- Prieto Mariel-Martes-Vi-Turno Mañana.docx**, 2C 2026. El primer parcial está previsto para el **18/09/2026**. La guía de estudio anterior queda como material complementario, no como criterio para ordenar las unidades de esta comisión.

| Módulo | Contenidos |
|---|---|
| 1. Obligaciones | Sujetos, prestación, fuentes, pago, extinción y mora |
| 2. Títulos de crédito | Letras, pagarés, cheques, endoso, aval y principios cambiarios |
| 3. Parte general | Formación, capacidad, objeto, causa, forma, prueba, efectos y extinción |
| 4. Transferencias | Compraventa, permuta, cesión, fondo y venta internacional |
| 5. Uso de bienes | Locación, leasing y comodato |
| 6. Representación y donación | Mandato, consignación, gestión, empleo útil, donación y extinción |

Unidad 6 se introduce el 11/09 y el cronograma también prevé su continuación el 25/09. Se incluye completa para preparación; no se afirma confirmación de cada subtema efectivamente desarrollado antes del examen. Garantías, depósito, mutuo y seguros figuran después: quedan fuera del recorrido, repasos y simulacro del primer parcial, y disponibles como consulta extra. No se inventan Word de casos de Unidades 2 o 6. Las grabaciones no se transcribieron.

Fuentes oficiales consultadas el 14/09/2026: CCyC actualizado, leyes 24.240, 24.449, 25.506, 11.867, normas cambiarias, CISG, ICC y UNIDROIT. Los enlaces están en la app. El proyecto es una ayuda de estudio, no reproduce la evaluación docente.

## Editar o ampliar

- `dist/content.js`: módulos, lecciones, preguntas y fuentes. Conservá los identificadores al corregir contenido para mantener el progreso existente.
- `dist/app.js`: pantallas e interacción.
- `dist/word-cases.js`: 130 casos Word, originales y adaptación didáctica.
- `dist/cases.js`: ejercicios extra anteriores y catálogo combinado. Mantener los identificadores conserva el progreso.
- `dist/case-ui.js` y `dist/case-engine.js`: sección de casos y progreso propio.
- `dist/engine.js`: corrección, sesiones, repaso y validación de copias.
- `dist/style.css`: diseño adaptable.
- `dist/sw.js`: caché sin conexión. **Incrementá la versión del caché cuando publiques cambios** para actualizar dispositivos que ya instalaron la app.
- `tests/engine.test.mjs`: pruebas sin dependencias externas. Ejecutá `npm test` y `npm run check` antes de publicar.

La app no envía respuestas ni datos de progreso a servidores. GitHub recibe las solicitudes habituales al servir la página. El proyecto no incluye videos, archivos Word/PPT, credenciales ni conversaciones personales. Sí incorpora el texto de los enunciados y consignas de la materia para estudiar. Los navegadores compatibles pueden exponer dos acciones WebMCP: leer el avance local y abrir una lección; ninguna responde ejercicios ni concede puntaje.
