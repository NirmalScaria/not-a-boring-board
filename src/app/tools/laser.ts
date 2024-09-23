import { Canvas, PencilBrush } from 'fabric';

export const initializeLaser = (canvas: Canvas) => {
    const pencilBrush = new PencilBrush(canvas);
    pencilBrush.width = 3; // Set pencil width
    pencilBrush.color = '#000'; // Set pencil color
    canvas.freeDrawingBrush = pencilBrush;
    canvas.isDrawingMode = true;

    // Listen to the 'path:created' event to capture the drawn path
    canvas.on('path:created', (event) => {
        const path = event.path;

        // Function to gradually reduce the stroke width and opacity
        const animatePath = () => {
            // If both strokeWidth and opacity are above 0, keep reducing them
            if (path.strokeWidth > 0 || path.opacity > 0) {
                path.strokeWidth = Math.max(0, path.strokeWidth - 0.2); // Reduce strokeWidth faster
                path.opacity = Math.max(0, path.opacity - 0.05); // Reduce opacity faster

                // Optionally remove or fade the shadow as the line fades
                if (path.shadow && path.opacity < 0.5) {
                    path.shadow.blur = Math.max(0, path.shadow.blur - 0.5); // Gradually reduce shadow blur
                }

                canvas.renderAll(); // Re-render canvas
                requestAnimationFrame(animatePath); // Continue animation
            } else {
                canvas.remove(path); // Remove path once it's invisible
            }
        };

        // Start the animation after a 1-second delay
        setTimeout(() => {
            animatePath();
        }, 1000);
    });
};
