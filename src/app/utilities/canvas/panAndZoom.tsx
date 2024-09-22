import { Canvas, Point, TPointerEventInfo } from "fabric";

export function addPanAndZoom(newCanvas: Canvas) {
    const handleWheel = (opt: TPointerEventInfo<WheelEvent>) => {
        const e = opt.e;
        e.preventDefault();
  
        if (e.ctrlKey) {
          const zoom = newCanvas.getZoom();
          const newZoom = Math.max(0.3, zoom * (1 - e.deltaY * 0.01));
          newCanvas.zoomToPoint({ x: e.offsetX, y: e.offsetY } as Point, newZoom);
        } else {
          const delta = newCanvas.viewportTransform ? new Point(-e.deltaX, -e.deltaY) : null;
          if (delta) {
            newCanvas.relativePan(delta);
          }
        }
      };
      return handleWheel;
}