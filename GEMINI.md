## Project Overview

This project is a Figma plugin designed to manage design tokens. It provides a user interface built with React and TypeScript for importing, viewing, editing, and applying design tokens from a JSON file directly within the Figma editor.

**Key Technologies:**

- **Figma Plugin API:** The core logic in `code.ts` interacts with Figma to manipulate styles and layers.
- **React:** The user interface is built using React, located in the `src` directory.
- **TypeScript:** The project is written in TypeScript, providing static typing for both the plugin logic and the UI.
- **Vite:** The project uses Vite for fast development and building of the UI and plugin code.
- **Tailwind CSS:** The UI is styled using Tailwind CSS.
- **ESLint & Prettier:** The project is configured with ESLint and Prettier for code quality and consistent formatting.

**Architecture:**

The project is structured as a standard Figma plugin with a web-based UI:

- `manifest.json`: The Figma plugin manifest file, which defines the plugin's name, commands, and entry points (`ui.html` and `code.js`).
- `code.ts`: The main plugin file that runs in Figma's sandbox environment. It handles communication with the UI and interacts with the Figma API.
- `ui.html`: The HTML file for the plugin's UI, which loads the React application.
- `src/`: Contains the source code for the React-based user interface.
- `vite.config.ts`: Configures the Vite build process, bundling the UI and the plugin code.

## Building and Running

1.  **Install Dependencies:**

    ```bash
    pnpm install
    ```

2.  **Running the Development Server:**

    To develop the UI, run the Vite development server:

    ```bash
    pnpm run dev
    ```

3.  **Building the Plugin:**

    To build the plugin for production, which creates the necessary `dist` folder containing `ui.html` and `code.js`:

    ```bash
    pnpm run build
    ```

4.  **Running in Figma:**
    - Open Figma.
    - Go to `Plugins` > `Development` > `Import plugin from manifest...`.
    - Select the `manifest.json` file from this project.
    - The plugin will then be available in the `Plugins` > `Development` menu.

## Development Conventions

- **Linting and Formatting:** The project uses ESLint and Prettier to enforce code style and quality. To automatically fix linting issues and format the code, run:

  ```bash
  pnpm run fix
  ```

- **Testing:**

  _TODO: No testing framework appears to be configured for this project. Consider adding a testing framework like Vitest or Jest to ensure code quality and prevent regressions._
