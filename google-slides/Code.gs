/**
 * Cloud Architect Kits - Google Slides Add-on
 * Main entry point for the add-on
 */

/**
 * Called when the add-on is installed
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Called when the document is opened
 */
function onOpen(e) {
  SlidesApp.getUi()
    .createAddonMenu()
    .addItem('Show Icons', 'showSidebar')
    .addToUi();
}

/**
 * Show the sidebar with icon browser
 */
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Cloud Architect Kits')
    .setWidth(350);
  
  SlidesApp.getUi().showSidebar(html);
}

/**
 * Insert SVG icon into the current slide
 * @param {string} svgXml - The SVG XML string
 * @param {string} name - Icon name
 * @param {number} size - Icon size in points
 * @return {Object} Result object with status
 */
function insertIcon(svgXml, name, size) {
  try {
    var presentation = SlidesApp.getActivePresentation();
    var slide = presentation.getSelection().getCurrentPage();
    
    if (!slide) {
      return {
        success: false,
        error: 'No slide selected. Please select a slide first.'
      };
    }
    
    // Get slide dimensions
    var pageWidth = slide.getPageWidth();
    var pageHeight = slide.getPageHeight();
    
    // Calculate center position
    var left = (pageWidth - size) / 2;
    var top = (pageHeight - size) / 2;
    
    // Create a temporary blob from SVG
    var blob = Utilities.newBlob(svgXml, 'image/svg+xml', name + '.svg');
    
    // Insert image at center position
    var image = slide.insertImage(blob, left, top, size, size);
    
    // The image will maintain aspect ratio automatically
    // We set both width and height to 'size', but Google Slides will adjust
    // to maintain the original aspect ratio
    
    Logger.log('Inserted icon: ' + name + ' at (' + left + ', ' + top + ') size: ' + size);
    
    return {
      success: true,
      message: 'Icon inserted successfully'
    };
    
  } catch (error) {
    Logger.log('Error inserting icon: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get the current slide dimensions
 * @return {Object} Slide dimensions
 */
function getSlideDimensions() {
  try {
    var presentation = SlidesApp.getActivePresentation();
    var slide = presentation.getSelection().getCurrentPage();
    
    if (!slide) {
      return {
        success: false,
        error: 'No slide selected'
      };
    }
    
    return {
      success: true,
      width: slide.getPageWidth(),
      height: slide.getPageHeight()
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Include HTML file content
 * Used by Sidebar.html template system
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
