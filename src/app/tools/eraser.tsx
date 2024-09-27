import { Canvas, FabricObject, TPointerEvent, TPointerEventInfo } from "fabric";

export const initialiseEraser = (canvas: Canvas) => {
    canvas.isDrawingMode = true;
    canvas.defaultCursor = "crosshair";
    if (canvas.freeDrawingBrush)
        canvas.freeDrawingBrush.color = "#00000000";

    let isDragging = false;

    function onObjectHover(options: TPointerEventInfo<TPointerEvent>) {
        if (isDragging) {
            const object = options.target as FabricObject;
            if (object) {
                canvas.remove(object);
                canvas.requestRenderAll();
            }
        }
    };

    canvas.getObjects().forEach((object) => {
        object.perPixelTargetFind = true;
        object.on("mousemove", onObjectHover)
    });

    function pathCreated(event: {
        path: FabricObject;
    }) {
        canvas.remove(event.path);
    }

    function onMouseDown() {
        isDragging = true;
        canvas.requestRenderAll();
    }

    function onMouseUp() {
        isDragging = false;
        canvas.requestRenderAll();
    }
    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:up", onMouseUp);
    canvas.on('path:created', pathCreated);

    function dispose() {
        canvas.defaultCursor = "default";
        canvas.off("mouse:down", onMouseDown);
        canvas.off("mouse:up", onMouseUp);
        canvas.off('path:created', pathCreated);
        canvas.getObjects().forEach((object) => {
            object.perPixelTargetFind = false;
            object.off("mousemove", onObjectHover)
        });
    }

    return dispose;
}