// utilities/canvas/pencil.ts
import { Canvas, PencilBrush } from 'fabric';

export const initializePencil = (canvas: Canvas) => {
    const pencilBrush = new PencilBrush(canvas);
    pencilBrush.width = 2; // Set pencil width
    canvas.freeDrawingBrush = pencilBrush;
    canvas.isDrawingMode = true; // Enable drawing mode
    function dispose() {
        canvas.isDrawingMode = false;
    }
    return dispose;
};
