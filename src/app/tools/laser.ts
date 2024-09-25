import { Canvas, FabricObject, PencilBrush, Shadow, util } from 'fabric';

const brushColor = "#fc1919";

export const initializeLaser = (canvas: Canvas) => {
    const pencilBrush = new PencilBrush(canvas);
    pencilBrush.width = 3; // Set pencil width
    pencilBrush.color = brushColor; // Set pencil color
    pencilBrush.shadow = new Shadow({ color: brushColor, blur: 15 }); // Add shadow to the pencil
    canvas.freeDrawingBrush = pencilBrush;
    canvas.isDrawingMode = true;

    // Listen to the 'path:created' event to capture the drawn path
    const pathCreatedListener = (event: { path: FabricObject }) => {

        const path = event.path;

        // Function to gradually reduce the stroke width and opacity
        const animatePath = () => {
            const duration = 200;
            const startStrokeWidth = path.strokeWidth;
            const startOpacity = path.opacity;

            // Use fabric.util.animate for custom animations
            util.animate({
                startValue: 1,
                endValue: 0,
                duration: duration,
                easing: util.ease.easeInOutQuad,
                onChange: (value) => {
                    path.set('strokeWidth', startStrokeWidth * value);
                    path.set('opacity', startOpacity * value);
                    path.dirty = true;
                    canvas.requestRenderAll();
                },
                onComplete: () => {
                    canvas.remove(path);
                }
            });
        };

        // Start the animation after a 1-second delay
        setTimeout(() => {
            animatePath();
        }, 1000);
    }

    canvas.on('path:created', pathCreatedListener);

    function dispose() {
        canvas.off('path:created', pathCreatedListener);
        canvas.isDrawingMode = false;
    }

    return dispose;
};
