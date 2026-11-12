# Sonu Swathwick Ande — Portfolio

Personal portfolio for embedded systems, firmware, electronics, and robotics work. The site is built with plain HTML, CSS, and JavaScript and has no build step or package dependencies.

## Features

- Responsive portfolio with dark and light themes
- Interactive oscilloscope and signal visualizations
- ARM Cortex-M timer register explorer
- Simulated UART command-line interface
- Project detail panels, experience, education, and awards
- Contact form that opens a prefilled message in the visitor's email app

## Run locally

Open `index.html` in a browser, or serve the folder locally:

~~~powershell
python -m http.server 8000
~~~

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

This repository is intended to publish at `https://sonuande.github.io/portfolio/`.

1. Open the repository on GitHub and choose **Settings → Pages**.
2. Under **Build and deployment**, set the source to **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then click **Save**.
4. Wait for the Pages deployment to finish. GitHub will show the published URL in the Pages settings.

The `.nojekyll` file keeps GitHub Pages from applying Jekyll processing. No build command is needed.

## Repository contents

- `index.html` — page content and metadata
- `css/main.css` — layout, responsive styles, and themes
- `js/main.js` — navigation, project panels, and interactions
- `js/oscilloscope.js` — waveform visualization
- `js/terminal.js` — simulated UART terminal

## Before publishing

Review the project descriptions, achievements, and contact details in `index.html` and the JavaScript files to make sure they are current and approved for public display. The contact form uses the address shown on the site and depends on the visitor having an email app configured.
