/* global Office, PowerPoint */

// PowerPoint-specific implementation of handleIconClick
function handleIconClick(icon) {
  const iconSize = parseInt(document.getElementById('icon-size').value) || 64;
  insertIcon(icon, iconSize);
}

async function insertIcon(icon, size) {
  try {
    const svgXml = atob(icon.svg);
    await insertSvgIntoSlide(svgXml, icon.name, size);
  } catch (error) {
    console.error('Error inserting icon:', error);
    showStatus('Error: ' + error.message, 'error');
  }
}

async function insertSvgIntoSlide(svgXml, name, size) {
  return new Promise((resolve, reject) => {
    PowerPoint.run(async (context) => {
      const slide = context.presentation.getSelectedSlides().getItemAt(0);
      slide.load("width,height");
      await context.sync();
      
      const slideWidth = slide.width;
      const slideHeight = slide.height;
      
      // Parse SVG to get viewBox dimensions
      const viewBoxMatch = svgXml.match(/viewBox=["']([^"']+)["']/);
      let imageWidth = size;
      let imageHeight = size;
      
      if (viewBoxMatch) {
        const viewBox = viewBoxMatch[1].split(/\s+/);
        const vbWidth = parseFloat(viewBox[2]);
        const vbHeight = parseFloat(viewBox[3]);
        
        if (vbWidth && vbHeight) {
          // Calculate dimensions: longest edge = size, maintain aspect ratio
          const aspectRatio = vbWidth / vbHeight;
          if (vbWidth >= vbHeight) {
            // Width is longer
            imageWidth = size;
            imageHeight = size / aspectRatio;
          } else {
            // Height is longer
            imageHeight = size;
            imageWidth = size * aspectRatio;
          }
        }
      }
      
      // Calculate center position (Office uses points)
      const imageLeft = (slideWidth - imageWidth) / 2;
      const imageTop = (slideHeight - imageHeight) / 2;
      
      // Insert SVG using setSelectedDataAsync with XmlSvg coercion
      Office.context.document.setSelectedDataAsync(svgXml, {
        coercionType: Office.CoercionType.XmlSvg,
        imageLeft: imageLeft,
        imageTop: imageTop,
        imageWidth: imageWidth,
        imageHeight: imageHeight
      }, function (asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
          console.error('Failed to insert icon:', asyncResult.error.message);
          showStatus('Failed to insert icon', 'error');
          reject(new Error(asyncResult.error.message));
        } else {
          console.log(`Inserted ${name} icon (${imageWidth.toFixed(1)}x${imageHeight.toFixed(1)}pt)`);
          showStatus('Icon inserted successfully!', 'success');
          resolve();
        }
      });
    }).catch((error) => {
      console.error('Error getting slide dimensions:', error);
      showStatus('Error: ' + error.message, 'error');
      reject(error);
    });
  });
}

function showStatus(message, type) {
  const statusEl = document.getElementById('status-message');
  if (!statusEl) return;
  
  statusEl.className = 'status-message show ' + type;
  statusEl.textContent = message;
  
  setTimeout(() => {
    statusEl.classList.remove('show');
  }, 3000);
}

// Initialize plugin when Office.js is ready
Office.onReady(() => {
  initializeIcons();
  setupEventListeners();
});
