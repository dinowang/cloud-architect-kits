figma.showUI(__html__, { width: 380, height: 740 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'insert-icon') {
    const { svgData, name, size = 64 } = msg;
    
    try {
      const node = figma.createNodeFromSvg(svgData);
      
      // Resize to specified size, maintaining aspect ratio based on longest side
      const longerSide = Math.max(node.width, node.height);
      const scale = size / longerSide;
      node.resize(node.width * scale, node.height * scale);
      node.expanded = false;
      node.lockAspectRatio();
      
      // Create a group and name it
      const group = figma.group([node], figma.currentPage);
      group.name = name;
      group.expanded = false;
      group.lockAspectRatio();
      
      // Position at center of current viewport
      const viewportCenter = figma.viewport.center;
      group.x = viewportCenter.x - group.width / 2;
      group.y = viewportCenter.y - group.height / 2;
      
      // Select the group
      figma.currentPage.selection = [group];
      
      const finalWidth = Math.round(node.width);
      const finalHeight = Math.round(node.height);
      figma.notify(`Added ${name} icon (${finalWidth}x${finalHeight}px)`);
    } catch (error: any) {
      figma.notify(`Error adding icon: ${error.message}`, { error: true });
    }
  }
  
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
