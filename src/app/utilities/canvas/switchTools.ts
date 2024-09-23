import { ToolItemName } from "@/app/enums/toosl";
import { initializeLaser } from "@/app/tools/laser";
import { initializePencil } from "@/app/tools/pencil";
import { Canvas } from "fabric";

let activeDispose: (() => void) | null = null;


export function switchTools(canvas: Canvas | null, tool: ToolItemName) {
    if (!canvas) return;

    function resetTools() {
        if (!canvas) return;
        if (activeDispose) {
            activeDispose();
            activeDispose = null;
        }
    }

    resetTools();

    switch (tool) {
        case ToolItemName.Pencil:
            const disposePencil = initializePencil(canvas);
            activeDispose = disposePencil;
            break;
        case ToolItemName.Hand:
            canvas.isDrawingMode = false;
            break;
        case ToolItemName.Laser:
            const disposeLaser = initializeLaser(canvas);
            activeDispose = disposeLaser;
            break;
    }
}