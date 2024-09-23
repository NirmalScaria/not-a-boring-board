import { Canvas, Point, TPointerEvent, TPointerEventInfo } from "fabric";

export const initialiseHand = (canvas: Canvas) => {
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = "grab";
    let initialX = 0;
    let initialY = 0;
    const mouseDownHandler = (event: TPointerEventInfo<TPointerEvent>) => {
        event.e.preventDefault();
        canvas.defaultCursor = "grabbing";
        initialX = event.scenePoint.x;
        initialY = event.scenePoint.y;
    }
    const mouseUpHandler = (event: TPointerEventInfo<TPointerEvent>) => {
        event.e.preventDefault();
        canvas.defaultCursor = "grab";
        canvas.requestRenderAll();
    }
    const mouseMoveHandler = (event: TPointerEventInfo<TPointerEvent>) => {
        if (canvas.defaultCursor != "grabbing") {
            return;
        }
        event.e.preventDefault();
        const deltaX = event.scenePoint.x - initialX;
        const deltaY = event.scenePoint.y - initialY;
        canvas.relativePan(new Point(deltaX, deltaY));
    }
    canvas.on("mouse:down", mouseDownHandler);
    canvas.on("mouse:up", mouseUpHandler);
    canvas.on("mouse:move", mouseMoveHandler);

    function dispose() {
        canvas.off("mouse:down", mouseDownHandler);
        canvas.off("mouse:up", mouseUpHandler);
        canvas.off("mouse:move", mouseMoveHandler);
    }

    return dispose;
}