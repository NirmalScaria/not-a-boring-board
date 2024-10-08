import { ToolItemName } from "@/app/enums/toosl";
import { initialiseArray } from "@/app/tools/array";
import { initialiseEraser } from "@/app/tools/eraser";
import { initialiseHand } from "@/app/tools/hand";
import { initializeLaser } from "@/app/tools/laser";
import { initialiseMove, MoveToolbar } from "@/app/tools/move";
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
        case ToolItemName.Array:
            const disposeArray = initialiseArray(canvas);
            activeDispose = disposeArray;
            break;
        case ToolItemName.Move:
            const disposeMove = initialiseMove(canvas);
            activeDispose = disposeMove;
            break;
        case ToolItemName.Eraser:
            const disposeEraser = initialiseEraser(canvas);
            activeDispose = disposeEraser;
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
        case ToolItemName.Array:
            return <></>
        case ToolItemName.Move:
            return <MoveToolbar canvas={canvas} />
    }
    return <div></div>
}