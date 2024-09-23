import { ToolItemName } from "@/app/enums/toosl";
import { initialiseHand } from "@/app/tools/hand";
import { initializeLaser } from "@/app/tools/laser";
import { initializePencil, PencilToolbar } from "@/app/tools/pencil";
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
            const disposeHand = initialiseHand(canvas);
            activeDispose = disposeHand;
            break;
        case ToolItemName.Laser:
            const disposeLaser = initializeLaser(canvas);
            activeDispose = disposeLaser;
            break;
    }
}

export function ToolToolbar({ tool, canvas }: { tool: ToolItemName, canvas: Canvas | null }) {
    switch (tool) {
        case ToolItemName.Pencil:
            return <PencilToolbar canvas={canvas} />
        case ToolItemName.Hand:
            return <></>
        case ToolItemName.Laser:
            return <></>
    }
    return <div></div>
}