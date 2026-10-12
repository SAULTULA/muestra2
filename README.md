# La Radio del Rincón 98.7 FM — Web de muestra

Web estática de una radio de barrio ficticia, creada con **HTML, CSS y JavaScript puro**, en un estilo cálido y hogareño. Pensada para demostración y lista para publicarse en **GitHub Pages**.

## Características

- **Una sola página** (`index.html`) con secciones: Inicio, Programación, Novedades, Nosotros y Contacto.
- **Estilo cálido y familiar**: paleta crema, terracota y verde salvia; tipografías `Lora` y `Nunito`; formas suaves, sombras discretas y textura sutil de papel. Nada de neones ni estética tecnológica.
- **Reproductor de YouTube en vivo**: detecta el identificador de la URL (`watch`, `youtu.be`, `/live/`, `/embed/`, `/shorts/`) y lo reproduce con `youtube-nocookie` mediante la YouTube IFrame API.
- **Aviso amable**: si el canal no permite la inserción (caso muy habitual), aparece un aviso claro y un botón para abrir el directo directamente en YouTube.
- **Panel de administración**: botón `ADMIN` en la cabecera. Usuario: **`admin`**. Contraseña: **`1234`**.
- **Editable desde el panel**: identidad (nombre, lema, colores, logo), dirección del directo, programación semanal, novedades y contactos.
- **Se guarda en tu navegador**: los cambios se almacenan en `localStorage` **solo en el navegador desde el que se editan**. No afectan a otros visitantes ni al repositorio.
- **Directo vacío a propósito**: al entrar por primera vez se ve «Ahora mismo no suena nada». Ideal para enseñar el flujo del panel.
- **Sin dependencias ni compilación**: funciona arrastrando los archivos o directamente en GitHub Pages.

## Estructura de archivos

```text
/
├── index.html
├── css/
│   └── estilos.css
├── js/
│   ├── datos.js      # Configuración de fábrica + credenciales de muestra
│   ├── player.js     # Lógica del reproductor de YouTube
│   ├── sitio.js      # Dibuja las secciones con la configuración
│   └── admin.js      # Panel de administración y acceso
├── assets/
│   ├── logo.svg
│   └── favicon.svg
└── README.md
```

## Publicarlo en GitHub Pages

1. Crea un repositorio nuevo en [GitHub](https://github.com/new), por ejemplo `radio-rincon-muestra`.
2. Sube **todos estos archivos** al repositorio (arrastrandolos o con `git push`).
3. Ve a `Settings > Pages`.
4. En `Source` elige **Deploy from a branch**.
5. Selecciona la rama `main` (o `master`) y la carpeta `/ (root)`.
6. Guarda. GitHub te mostrará la dirección, por ejemplo:

   ```text
   https://TUUSUARIO.github.io/radio-rincon-muestra/
   ```

7. Abre esa dirección y la web estará publicada.

## Cómo poner tu directo de YouTube

1. Abre la web publicada.
2. Pulsa **ADMIN**.
3. Entra con **`admin`** y **`1234`**.
4. Ve a la pestaña **Directo**.
5. Pega la dirección completa de tu emisión en vivo (se acepta `watch?v=`, `youtu.be/`, `/live/`).
6. Pulsa **Probar** para verlo en el reproductor.
7. Pulsa **Guardar cambios**. Se aplica al instante, sin recargar la página.

> **Ojo:** muchos directos de YouTube **no permiten la inserción**. Cuando pasa eso, el reproductor lo explica y ofrece abrir el directo en YouTube con el botón correspondiente.

## Credenciales de la muestra

- **Usuario:** `admin`
- **Contraseña:** `1234`

Estas credenciales están **a la vista en el código fuente** (`js/datos.js`), porque es una web estática sin servidor. **No es seguro para producción**: es solo una demostración.

## Notas sobre GitHub Pages

- Usa **rutas relativas** (`css/estilos.css`, `js/datos.js`, `assets/logo.svg`). Así funciona igual en `https://TUUSUARIO.github.io/repo/` que en tu ordenador.
- **Nadie puede modificar tu web publicada** desde el panel: el panel solo escribe en el `localStorage` del navegador del visitante. Quien entre y cambie algo, solo lo verá él.
- Los cambios guardados **no se suben a GitHub**. Si quieres que el directo o el contenido cambien para *todos* los visitantes, tienes que editar `js/datos.js` y hacer un `commit` y `push`.

## Verla en tu ordenador

Puedes abrir `index.html` directamente en el navegador, o levantar un servidor local:

```bash
# Con Python
python -m http.server 8080

# Con Node
npx serve .
```

Y abrir `http://localhost:8080`.

## Licencia

Proyecto de muestra, libre para reutilizar, modificar y adaptar.