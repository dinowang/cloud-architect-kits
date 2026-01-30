// Common UI logic for all platforms
let allIcons = [];
let organizedIcons = {};
let sourceIconCounts = {};

function initializeIcons() {
  allIcons = window.iconsData || [];
  
  // Group icons by source, then by category
  organizedIcons = {};
  sourceIconCounts = {};
  
  allIcons.forEach(icon => {
    if (!organizedIcons[icon.source]) {
      organizedIcons[icon.source] = {};
      sourceIconCounts[icon.source] = 0;
    }
    // Normalize category: treat null, undefined, empty string, or "." as null
    const category = (icon.category && icon.category !== '.' && icon.category !== '') ? icon.category : null;
    if (!organizedIcons[icon.source][category]) {
      organizedIcons[icon.source][category] = [];
    }
    organizedIcons[icon.source][category].push(icon);
    sourceIconCounts[icon.source]++;
  });
  
  renderIcons();
}

let renderTimeout = null;

function renderIcons(query = '') {
  if (renderTimeout) clearTimeout(renderTimeout);
  
  renderTimeout = setTimeout(() => {
    const container = document.getElementById('icons-container');
    container.innerHTML = '';
    
    const sources = Object.keys(organizedIcons).sort();
    let totalShown = 0;
    const MAX_INITIAL_ICONS = query ? 500 : 100;
    
    sources.forEach(source => {
      const sourceSection = document.createElement('div');
      sourceSection.className = 'source-section';
      
      const sourceHeader = document.createElement('div');
      sourceHeader.className = 'source-header';
      
      const sourceTitle = document.createElement('div');
      sourceTitle.className = 'source-header-title';
      sourceTitle.textContent = source;
      
      const sourceCount = document.createElement('span');
      sourceCount.className = 'source-header-count';
      
      sourceHeader.appendChild(sourceTitle);
      sourceHeader.appendChild(sourceCount);
      sourceSection.appendChild(sourceHeader);
      
      const categories = Object.keys(organizedIcons[source]).sort();
      let sourceHasIcons = false;
      let sourceVisibleCount = 0;
      
      categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        
        // Only add category header if category is not null
        if (category !== null && category !== 'null') {
          const categoryHeader = document.createElement('div');
          categoryHeader.className = 'category-header';
          categoryHeader.textContent = category;
          categorySection.appendChild(categoryHeader);
        }
        
        const icons = organizedIcons[source][category];
        let categoryHasIcons = false;
        
        icons.forEach((icon, idx) => {
          if (totalShown >= MAX_INITIAL_ICONS && !query) return;
          
          if (query) {
            const searchTerm = query.toLowerCase();
            const matchName = icon.name.toLowerCase().includes(searchTerm);
            const matchCategory = category && category !== 'null' ? category.toLowerCase().includes(searchTerm) : false;
            const matchSource = source.toLowerCase().includes(searchTerm);
            
            if (!matchName && !matchCategory && !matchSource) return;
          }
          
          const item = document.createElement('div');
          item.className = 'icon-item';
          
          const imageContainer = document.createElement('div');
          imageContainer.className = 'icon-item-image';
          
          const img = document.createElement('img');
          img.setAttribute('data-src', 'data:image/svg+xml;base64,' + icon.svg);
          img.alt = icon.name;
          img.loading = 'lazy';
          
          if (idx < 20 || query) {
            img.src = img.getAttribute('data-src');
          } else {
            setTimeout(() => {
              if (img.getAttribute('data-src')) {
                img.src = img.getAttribute('data-src');
              }
            }, 100);
          }
          
          imageContainer.appendChild(img);
          
          const name = document.createElement('div');
          name.className = 'icon-item-name';
          name.textContent = icon.name;
          
          item.appendChild(imageContainer);
          item.appendChild(name);
          item.onclick = () => handleIconClick(icon);
          
          categorySection.appendChild(item);
          categoryHasIcons = true;
          totalShown++;
          sourceVisibleCount++;
        });
        
        if (categoryHasIcons) {
          sourceSection.appendChild(categorySection);
          sourceHasIcons = true;
        }
      });
      
      if (sourceHasIcons) {
        // Update source count with visible icons
        sourceCount.textContent = query 
          ? `${sourceVisibleCount} / ${sourceIconCounts[source]} icons`
          : `${sourceIconCounts[source]} icons`;
        container.appendChild(sourceSection);
      }
    });
    
    if (totalShown === 0) {
      container.innerHTML = '<div class="no-results">No icons found</div>';
    }
    
    // Show/hide performance hint
    const hint = document.getElementById('performance-hint');
    if (hint) {
      if (!query && totalShown >= MAX_INITIAL_ICONS) {
        hint.classList.add('show');
      } else {
        hint.classList.remove('show');
      }
    }
  }, 150);
}

function setupEventListeners() {
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value;
      const container = document.getElementById('icons-container');
      container.scrollTop = 0;
      renderIcons(query);
    });
  }
  
  const presetButtons = document.querySelectorAll('.size-preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const size = this.getAttribute('data-size');
      const sizeInput = document.getElementById('icon-size');
      if (sizeInput) {
        sizeInput.value = size;
      }
    });
  });
}

// Platform-specific implementation should override this
function handleIconClick(icon) {
  console.error('handleIconClick must be implemented by platform-specific code');
}
