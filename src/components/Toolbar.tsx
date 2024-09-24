import { ToolItemName } from "@/app/enums/toosl";
import { switchTools, ToolToolbar } from "@/app/utilities/canvas/switchTools";
import { cn } from "@/lib/utils";
import { Canvas } from "fabric";
import { Brackets, Hand, MousePointer, Pencil } from "lucide-react";

export default function Toolbar({ canvas, currentTool, setCurrentTool }: { canvas: Canvas | null, currentTool: ToolItemName, setCurrentTool: (tool: ToolItemName) => void }) {
    return <div className="absolute flex flex-row">
        <div className="relative bg-white border-2 p-1 rounded-full z-50 m-3 flex flex-row gap-1">
            <ToolSelectionButton canvas={canvas} tool={ToolItemName.Pencil} setCurrentTool={setCurrentTool} currentTool={currentTool} >
                <Pencil size={20} className="transition-all group-hover:text-white" />
            </ToolSelectionButton>
            <ToolSelectionButton canvas={canvas} tool={ToolItemName.Hand} setCurrentTool={setCurrentTool} currentTool={currentTool} >
                <Hand size={20} className="transition-all group-hover:text-white" />
            </ToolSelectionButton>
            <ToolSelectionButton canvas={canvas} tool={ToolItemName.Laser} setCurrentTool={setCurrentTool} currentTool={currentTool} >
                <MousePointer size={20} className="transition-all group-hover:text-white" />
            </ToolSelectionButton>
            <ToolSelectionButton canvas={canvas} tool={ToolItemName.Array} setCurrentTool={setCurrentTool} currentTool={currentTool} >
                <Brackets size={20} className="transition-all group-hover:text-white" />
            </ToolSelectionButton>
        </div>
        <ToolToolbar tool={currentTool} canvas={canvas} />
    </div>
}

export function ToolSelectionButton({ canvas, tool, setCurrentTool, currentTool, children }: { canvas: Canvas | null, tool: ToolItemName, setCurrentTool: (tool: ToolItemName) => void, currentTool: ToolItemName, children: React.ReactNode }) {
    return <button
        onClick={() => {
            setCurrentTool(tool);
            switchTools(canvas, tool);
        }}
        className={cn("transition-all group rounded-full p-3 hover:bg-purple-400 active:bg-purple-200 border-2", tool == currentTool ? "border-purple-400 inset-2 bg-purple-100" : "border-transparent bg-transparent ")}>
        {children}
    </button>
}