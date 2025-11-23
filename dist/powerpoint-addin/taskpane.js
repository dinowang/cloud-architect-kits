/* global Office, window */

Office.onReady((info) => {
  if (info.host === Office.HostType.PowerPoint) {
    console.log('PowerPoint Add-in ready');
    loadIcons();
  }
});

let allIcons = [];
let organizedIcons = {};
let sourceIconCounts = {};

async function loadIcons() {
  allIcons = window.iconsData || [];
  
  // Group icons by source, then by category
  organizedIcons = {};
  sourceIconCounts = {};
  
  allIcons.forEach(icon => {
    if (!organizedIcons[icon.source]) {
      organizedIcons[icon.source] = {};
      sourceIconCounts[icon.source] = 0;
    }
    if (!organizedIcons[icon.source][icon.category]) {
      organizedIcons[icon.source][icon.category] = [];
    }
    organizedIcons[icon.source][icon.category].push(icon);
    sourceIconCounts[icon.source]++;
  });
  
  renderIcons();
}

let renderTimeout = null;
let lastQuery = '';

function renderIcons(query = '') {
  if (renderTimeout) clearTimeout(renderTimeout);
  
  renderTimeout = setTimeout(() => {
    const container = document.getElementById('icons-container');
    container.innerHTML = '';
    
    const sources = Object.keys(organizedIcons).sort();
    let totalShown = 0;
    const MAX_INITIAL_ICONS = query ? 500 : 100;
    
    sources.forEach(source => {
      if (totalShown >= MAX_INITIAL_ICONS && !query) return;
      
      const categories = organizedIcons[source];
      const categoryNames = Object.keys(categories).sort();
      let sourceShown = false;
      let sourceSection = null;
      let sourceFilteredCount = 0;
      
      categoryNames.forEach(category => {
        if (totalShown >= MAX_INITIAL_ICONS && !query) return;
        
        const icons = categories[category];
        
        let filteredIcons = icons;
        let sourceMatches = false;
        let categoryMatches = false;
        
        if (query) {
          const lowerQuery = query.toLowerCase();
          sourceMatches = source.toLowerCase().includes(lowerQuery);
          categoryMatches = category.toLowerCase().includes(lowerQuery);
          
          if (!sourceMatches && !categoryMatches) {
            filteredIcons = icons.filter(icon => 
              icon.name.toLowerCase().includes(lowerQuery)
            );
          }
        }
        
        if (!query || sourceMatches || categoryMatches || filteredIcons.length > 0) {
          if (!sourceShown) {
            sourceSection = document.createElement('div');
            sourceSection.className = 'source-section';
            
            const sourceHeader = document.createElement('div');
            sourceHeader.className = 'source-header';
            
            const sourceTitle = document.createElement('div');
            sourceTitle.className = 'source-header-title';
            sourceTitle.textContent = source;
            sourceHeader.appendChild(sourceTitle);
            
            const sourceCount = document.createElement('div');
            sourceCount.className = 'source-header-count';
            sourceCount.dataset.source = source;
            sourceHeader.appendChild(sourceCount);
            
            sourceSection.appendChild(sourceHeader);
            
            sourceShown = true;
          }
          
          const categorySection = document.createElement('div');
          categorySection.className = 'category-section';
          
          const categoryHeader = document.createElement('div');
          categoryHeader.className = 'category-header';
          categoryHeader.textContent = category;
          categorySection.appendChild(categoryHeader);
          
          const iconsToShow = (sourceMatches || categoryMatches) ? icons : filteredIcons;
          sourceFilteredCount += iconsToShow.length;
          
          const fragment = document.createDocumentFragment();
          
          iconsToShow.forEach((icon, idx) => {
            if (totalShown >= MAX_INITIAL_ICONS && !query) return;
            
            const item = document.createElement('div');
            item.className = 'icon-item';
            
            const imageContainer = document.createElement('div');
            imageContainer.className = 'icon-item-image';
            
            const img = document.createElement('img');
            img.dataset.src = `data:image/svg+xml;base64,${icon.svg}`;
            img.alt = icon.name;
            img.loading = 'lazy';
            
            if (idx < 20 || query) {
              img.src = img.dataset.src;
            } else {
              setTimeout(() => {
                if (img.dataset.src) img.src = img.dataset.src;
              }, 100);
            }
            
            imageContainer.appendChild(img);
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'icon-item-name';
            nameDiv.textContent = icon.name;
            
            item.appendChild(imageContainer);
            item.appendChild(nameDiv);
            
            item.addEventListener('click', () => {
              insertIcon(icon);
            });
            
            fragment.appendChild(item);
            totalShown++;
          });
          
          categorySection.appendChild(fragment);
          sourceSection.appendChild(categorySection);
        }
      });
      
      if (sourceShown) {
        const countElement = sourceSection.querySelector('.source-header-count');
        const totalCount = sourceIconCounts[source];
        if (query && sourceFilteredCount !== totalCount) {
          countElement.textContent = `${sourceFilteredCount} / ${totalCount}`;
        } else {
          countElement.textContent = `${totalCount}`;
        }
        
        container.appendChild(sourceSection);
      }
    });
    
    if (totalShown === 0) {
      container.innerHTML = '<div class="no-results">No icons found</div>';
    } else if (totalShown === MAX_INITIAL_ICONS && !query) {
      const loadMore = document.createElement('div');
      loadMore.style.cssText = 'text-align: center; padding: 20px; color: #666; font-size: 12px;';
      loadMore.textContent = `Showing first ${MAX_INITIAL_ICONS} icons. Use search to find more.`;
      container.appendChild(loadMore);
    }
    
    lastQuery = query;
  }, query ? 300 : 0);
}

async function insertIcon(icon) {
  const iconSize = parseInt(document.getElementById('icon-size').value) || 64;
  
  try {
    // Insert SVG as image
    const svgData = atob(icon.svg);
    await insertSvgAsImage(svgData, icon.name, iconSize);
    
  } catch (error) {
    console.error('Error inserting icon:', error);
  }
}

async function insertSvgAsImage(svgData, name, size) {
  return PowerPoint.run(async (context) => {
    // Get the current active slide
    const slides = context.presentation.slides;
    slides.load("items");
    await context.sync();
    
    // Get selected slide or use the first slide
    const slide = context.presentation.getSelectedSlides().getItemAt(0);
    slide.load("shapes,width,height");
    
    // Convert SVG to base64 data URL
    const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;
    
    // Add image to slide
    const image = slide.shapes.addImage(dataUrl);
    image.load("width,height");
    
    await context.sync();
    
    // Calculate scale to fit the desired size
    const originalWidth = image.width;
    const originalHeight = image.height;
    const longerSide = Math.max(originalWidth, originalHeight);
    const scale = size / longerSide;
    
    // Set scaled dimensions
    image.width = originalWidth * scale;
    image.height = originalHeight * scale;
    
    // Center on slide
    image.left = (slide.width - image.width) / 2;
    image.top = (slide.height - image.height) / 2;
    
    await context.sync();
    
    console.log(`Inserted ${name} icon (${Math.round(image.width)}x${Math.round(image.height)}px)`);
  }).catch((error) => {
    console.error('Error inserting image:', error);
    throw error;
  });
}

// Event listeners
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  const container = document.getElementById('icons-container');
  container.scrollTop = 0;
  renderIcons(query);
});

document.querySelectorAll('.size-preset-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const size = e.target.dataset.size;
    document.getElementById('icon-size').value = size;
  });
});
