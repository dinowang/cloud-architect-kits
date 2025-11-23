"use strict";
figma.showUI(__html__, { width: 480, height: 640 });
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
            // Add to current page (already done by group)
            // figma.currentPage.appendChild(group);
            // Center in viewport
            figma.viewport.scrollAndZoomIntoView([group]);
            // Select the group
            figma.currentPage.selection = [group];
            const finalWidth = Math.round(node.width);
            const finalHeight = Math.round(node.height);
            figma.notify(`Added ${name} icon (${finalWidth}x${finalHeight}px)`);
        }
        catch (error) {
            figma.notify(`Error adding icon: ${error.message}`, { error: true });
        }
    }
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
