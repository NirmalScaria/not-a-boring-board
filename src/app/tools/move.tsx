import { cn } from "@/lib/utils";
import { ActiveSelection, Canvas, Group } from "fabric";
import { ArrowDown01, Copy, Link, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { ArrayItem } from "./array";

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

export const MoveToolbar = ({ canvas }: { canvas: Canvas | null }) => {
    const [isObjectSelected, setIsObjectSelected] = useState(false);
    const [isMultipleObjectsSelected, setIsMultipleObjectsSelected] = useState(false);
    const [isArraySelected, setIsArraySelected] = useState(false);

    useEffect(() => {
        if (!canvas) return;

        const updateSelection = () => {
            setIsObjectSelected(!!canvas.getActiveObject());
            setIsMultipleObjectsSelected(canvas.getActiveObject()?.type == "activeselection");
            setIsArraySelected(canvas.getActiveObject()?.get("isArray") == true);
        };

        canvas.on("selection:created", updateSelection);
        canvas.on("selection:updated", updateSelection);
        canvas.on("selection:cleared", updateSelection);

        return () => {
            canvas.off("selection:created", updateSelection);
            canvas.off("selection:updated", updateSelection);
            canvas.off("selection:cleared", updateSelection);
        };
    }, [canvas]);

    async function duplicate() {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            if (activeObject.type === "activeselection") {
                const activeSelection = activeObject as ActiveSelection;
                const objects = activeSelection.getObjects();
                const clones = await Promise.all(objects.map(async (object) => {
                    const clone = await object.clone();
                    canvas.add(clone); 
                    return clone;
                }));
                const newSelection = new ActiveSelection(clones, {
                    left: activeSelection.left + 10,
                    top: activeSelection.top + 10
                });
                canvas.setActiveObject(newSelection);
                canvas.requestRenderAll();
            }
            else {
                const clone = await activeObject.clone();
                canvas.add(clone);
                canvas.setActiveObject(clone);
                clone.set({
                    left: clone.left + 10,
                    top: clone.top + 10
                });
                canvas.requestRenderAll();
            }
        }
    }
    function group() {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject instanceof ActiveSelection) {
            const objects = activeObject.getObjects();
            const group = new Group(objects);
            canvas.add(group);
            canvas.setActiveObject(group);
            canvas.requestRenderAll();
        }
    }
    function deleteSelection() {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            if (activeObject.type === "activeselection") {
                const activeSelection = activeObject as ActiveSelection;
                const objects = activeSelection.getObjects();
                canvas.discardActiveObject();
                objects.forEach((object) => {
                    canvas.remove(object);
                });
                canvas.remove(activeSelection);
            }
            else {
                canvas.remove(activeObject);
            }
        }
    }
    function sortArray() {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.get("isArray") == true) {
            const array = activeObject.get("arrayItem") as ArrayItem;
            array.sort();
        }
    }
    return <>
        {isObjectSelected && (
            <div className="relative bg-white border-2 p-1 rounded-full z-50 m-3 ml-0 flex flex-row gap-1">
                <button
                    onClick={duplicate}
                    className={cn("transition-all group rounded-full p-3 hover:bg-purple-400 active:bg-purple-200 border-2", "border-transparent bg-transparent ")}>
                    <Copy size={20} className="transition-all group-hover:text-white" />
                </button>
                <button
                    onClick={deleteSelection}
                    className={cn("transition-all group rounded-full p-3 hover:bg-purple-400 active:bg-purple-200 border-2", "border-transparent bg-transparent ")}>
                    <Trash size={20} className="transition-all group-hover:text-white" />
                </button>
                {
                    isMultipleObjectsSelected && <button
                        onClick={group}
                        className={cn("transition-all group rounded-full p-3 hover:bg-purple-400 active:bg-purple-200 border-2", "border-transparent bg-transparent ")}>
                        <Link size={20} className="transition-all group-hover:text-white" />
                    </button>
                }
                {
                    isArraySelected && <button
                        onClick={sortArray}
                        className={cn("transition-all group rounded-full p-3 hover:bg-purple-400 active:bg-purple-200 border-2", "border-transparent bg-transparent ")}>
                        <ArrowDown01 size={20} className="transition-all group-hover:text-white" />
                    </button>
                }
            </div>
        )}
    </>
}