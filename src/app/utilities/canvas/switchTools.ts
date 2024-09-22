import { ToolItemName } from "@/app/enums/toosl";
import { initializePencil } from "@/app/tools/pencil";
import { Canvas } from "fabric";

export function switchTools(canvas: Canvas | null, tool: ToolItemName) {
    if(!canvas) return;
    canvas.isDrawingMode = false;
    switch (tool) {
        case ToolItemName.Pencil:
            initializePencil(canvas);
            break;
        case ToolItemName.Hand:
            canvas.isDrawingMode = false;
            break;
    }
}