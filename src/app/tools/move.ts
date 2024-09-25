import { Canvas } from "fabric";

export const initialiseMove = (canvas: Canvas) => {
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.defaultCursor = "move";

    function onMouseDown() {
        canvas.requestRenderAll();
    }

    function onMouseUp() {
        canvas.requestRenderAll();
    }

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:up", onMouseUp);

    function dispose() {
        canvas.selection = false;
        canvas.defaultCursor = "default";
        canvas.off("mouse:down", onMouseDown);
        canvas.off("mouse:up", onMouseUp);
    }

    return dispose;
}