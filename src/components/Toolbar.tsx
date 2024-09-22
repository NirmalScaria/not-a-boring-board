import { ToolItemName } from "@/app/enums/toosl";
import { cn } from "@/lib/utils";
import { Hand, Pencil } from "lucide-react";

export default function Toolbar({ currentTool, setCurrentTool }: { currentTool: ToolItemName, setCurrentTool: (tool: ToolItemName) => void }) {
    return <div className="fixed bg-white border-2 p-1 rounded-full z-50 m-3 flex flex-row gap-1">
        <ToolSelectionButton tool={ToolItemName.Pencil} setCurrentTool={setCurrentTool} currentTool={currentTool} >
            <Pencil size={20} className="transition-all group-hover:text-white" />
        </ToolSelectionButton>
        <ToolSelectionButton tool={ToolItemName.Hand} setCurrentTool={setCurrentTool} currentTool={currentTool} >
            <Hand size={20} className="transition-all group-hover:text-white" />
        </ToolSelectionButton>
    </div>
}

function ToolSelectionButton({ tool, setCurrentTool, currentTool, children }: { tool: ToolItemName, setCurrentTool: (tool: ToolItemName) => void, currentTool: ToolItemName, children: React.ReactNode }) {
    return <button
        onClick={() => setCurrentTool(tool)}
        className={cn("transition-all group rounded-full p-3 hover:bg-purple-400 active:bg-purple-200 border-2", tool == currentTool ? "border-purple-400 inset-2 bg-purple-100" : "border-transparent bg-transparent ")}>
        {children}
    </button>
}