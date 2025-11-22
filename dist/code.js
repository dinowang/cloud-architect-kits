"use strict";
figma.showUI(__html__, { width: 480, height: 640 });
figma.ui.onmessage = async (msg) => {
    if (msg.type === 'insert-icon') {
        const { svgData, name, size = 64 } = msg;
        try {
            const node = figma.createNodeFromSvg(svgData);
            // Resize to specified size
            node.resize(size, size);
            node.expanded = false;
            // Create a group and name it
            const group = figma.group([node], figma.currentPage);
            group.name = name;
            group.expanded = false;
            // Add to current page (already done by group)
            // figma.currentPage.appendChild(group);
            // Center in viewport
            figma.viewport.scrollAndZoomIntoView([group]);
            // Select the group
            figma.currentPage.selection = [group];
            figma.notify(`Added ${name} icon (${size}x${size}px)`);
        }
        catch (error) {
            figma.notify(`Error adding icon: ${error.message}`, { error: true });
        }
    }
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
