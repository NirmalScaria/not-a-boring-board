import { Canvas, FabricObject, Rect, TPointerEvent, TPointerEventInfo, Text } from 'fabric';

class ArrayItem {
    declare x1: number;
    declare y1: number;
    declare x2: number;
    declare y2: number;
    declare indices: Text[];
    declare rects: Rect[];
    declare numbers: Text[];
    declare canvas: Canvas;
    constructor(canvas: Canvas, x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.canvas = canvas;
        this.indices = [];
        this.numbers = [];
        this.rects = [];
    }
    draw(x2: number, y2: number) {
        if (x2 - this.x1 < 5) return;
        if (y2 - this.y1 < 5) return;
        this.x2 = x2;
        this.y2 = y2;
        const cellCount = Math.max(0, Math.floor((x2 - this.x1) / (y2 - this.y1)));
        const actualWidth = cellCount * (y2 - this.y1);
        const cellWidth = y2 - this.y1;
        if (actualWidth > 5) {
            for (let i = 0; i < Math.min(50, cellCount); i++) {
                if (i >= this.indices.length) {
                    const index = new Text(i.toString(), {
                        left: this.x1 + i * cellWidth,
                        top: this.y1 - 20,
                        fontSize: 12,
                        fontFamily: 'Helvetica',
                    });
                    const number = Math.floor(Math.random() * 20);
                    const text = new Text(number.toString(), {
                        left: this.x1 + (i + 1 / 4) * cellWidth,
                        width: cellWidth,
                        height: cellWidth,
                        textAlign: 'center',
                        top: this.y1 + 1 / 4 * cellWidth,
                        fontSize: cellWidth / 2,
                        fontFamily: 'Helvetica',
                    });
                    const rect = new Rect({
                        left: this.x1 + i * cellWidth,
                        top: this.y1,
                        width: cellWidth,
                        height: cellWidth,
                        fill: 'white',
                        stroke: 'black',
                        strokeWidth: 1,
                    });
                    this.rects.push(rect);
                    this.canvas.add(rect);
                    this.numbers.push(text);
                    this.canvas.add(text);
                    this.indices.push(index);
                    this.canvas.add(index);
                }
                else {
                    this.indices[i].set({ left: this.x1 + i * cellWidth, top: this.y1 - 20 });
                    this.numbers[i].set({
                        top: this.y1 + cellWidth / 4,
                        fontSize: cellWidth / 2,
                        left: this.x1 + (i + 1 / 4) * cellWidth,
                        width: cellWidth,
                        height: cellWidth,
                        textAlign: 'center',
                    });
                    this.rects[i].set({ left: this.x1 + i * cellWidth, top: this.y1, width: cellWidth, height: cellWidth });
                }
            }
            for (let i = Math.min(50, cellCount); i < this.indices.length; i++) {
                this.canvas.remove(this.indices[i]);
                this.canvas.remove(this.numbers[i]);
                this.canvas.remove(this.rects[i]);
            }
            this.indices = this.indices.slice(0, Math.min(50, cellCount));
            this.numbers = this.numbers.slice(0, Math.min(50, cellCount));
            this.rects = this.rects.slice(0, Math.min(50, cellCount));
        }
    }
    // Workaround for bug.
    // Selection feature behaves weird after creating an array.
    // It magically gets fixed if the items are selected once programmatically and discarded.
    selectArray() {
        [...this.rects, ...this.indices, ...this.numbers].forEach(rect => {
            this.canvas.setActiveObject(rect);
        })
        this.canvas.discardActiveObject();
    }
}

export const initialiseArray = (canvas: Canvas) => {
    let currentArray: ArrayItem | null = null;
    let isDrawing: boolean = false;
    canvas.isDrawingMode = true;
    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = 0;
        canvas.freeDrawingBrush.color = 'transparent';
    }
    function startArray(options: TPointerEventInfo<TPointerEvent>) {
        isDrawing = true;
        currentArray = new ArrayItem(canvas, options.pointer.x, options.pointer.y, options.pointer.x, options.pointer.y);
    }

    function drawArray(options: TPointerEventInfo<TPointerEvent>) {
        if (!isDrawing) return;
        currentArray?.draw(options.pointer.x, options.pointer.y);
        canvas.requestRenderAll();
    }

    function endArray() {
        if (!isDrawing || !currentArray) return;
        isDrawing = false;
        currentArray.selectArray();
        currentArray = null;
        canvas.requestRenderAll();
    }

    // Workaround
    // If free drawing is disabled while using the array tool, the cursor acts like a selection tool too.
    // So, if a user clicks on an item and drags, it will move the item along with drawing new array.
    // To avoid that, here a dummy free drawing brush is enabled with 0 width and transparent color.
    // To avoid performance issues and clutter, the path is removed immediately after creation.
    function pathCreated(event: {
        path: FabricObject;
    }) {
        canvas.remove(event.path);
    }

    canvas.on('mouse:down', startArray);
    canvas.on('mouse:move', drawArray);
    canvas.on('mouse:up', endArray);
    canvas.on('path:created', pathCreated);
    function dispose() {
        canvas.off('mouse:down', startArray);
        canvas.off('mouse:move', drawArray);
        canvas.off('mouse:up', endArray);
        canvas.off('path:created', pathCreated);
    }
    return dispose;
};

