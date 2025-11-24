This project contains multiple plugins:

- Figma plugin
  Base path: ./src/figma  
  Source path: ./src/figma/plugin
- PowerPoint add-in
  Base path: ./src/powerpoint  
  Source path: ./src/powerpoint/add-in
- Google Slides add-on
  Base path: ./src/google-slides  
  Source path: ./src/google-slides/addon
- Draw.io icon library
  Base path: ./src/drawio  
  Source path: ./src/drawio/iconlib

Each plugin depends on prebuild resources:

- Prebuild  
  Base path: ./src/prebuild  
  UI Templates: ./src/prebuild/templates/

When feature/parameter/icons source has significant changes:

- Besides updating the source files, please also update the corresponding README.md, INSTALL.md file in each plugin's base path to reflect those changes.
- And also review and update README.md, INSTALL.md and root path.
- Review, modify (if necessary) and run ./scripts/build-and-release.sh in developer environment to ensure all plugins are built correctly.
