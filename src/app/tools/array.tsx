// utilities/canvas/pencil.ts
import { Canvas, Line, Rect, TPointerEvent, TPointerEventInfo, Text } from 'fabric';

class ArrayItem {
    declare x1: number;
    declare y1: number;
    declare x2: number;
    declare y2: number;
    declare rect: Rect;
    declare lines: Line[];
    declare indices: Text[];
    declare numbers: Text[];
    declare canvas: Canvas;
    constructor(canvas: Canvas, x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.canvas = canvas;
        this.lines = [];
        this.indices = [];
        this.numbers = [];
        this.rect = new Rect({
            left: x1,
            top: y1,
            width: x2 - x1,
            height: y2 - y1,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            selectable: false,
            evented: false
        });
    }
    draw(x2: number, y2: number) {
        if(x2 - this.x1 < 5) return;
        if(y2 - this.y1 < 5) return;
        this.x2 = x2;
        this.y2 = y2;
        const cellCount = Math.max(0, Math.floor((x2 - this.x1) / (y2 - this.y1)));
        const actualWidth = cellCount * (y2 - this.y1);
        const cellWidth = y2 - this.y1;
        this.rect.set({ width: actualWidth, height: y2 - this.y1 });
        if (actualWidth > 5) {
            for (let i = 0; i <= Math.min(50, cellCount); i++) {
                if (i >= this.lines.length) {
                    const line = new Line([this.x1 + i * cellWidth, this.y1, this.x1 + i * cellWidth, this.y2], {
                        stroke: 'black',
                        strokeWidth: 1,
                        selectable: false,
                        evented: false
                    });
                    this.lines.push(line);
                    this.canvas.add(line);
                }
                else {
                    this.lines[i].set({ x1: this.x1 + i * cellWidth, x2: this.x1 + i * cellWidth, y2: this.y2 });
                }
            }
            for (let i = 0; i < Math.min(50, cellCount); i++) {
                if (i >= this.indices.length) {
                    const index = new Text(i.toString(), {
                        left: this.x1 + i * cellWidth,
                        top: this.y1 - 20,
                        fontSize: 12,
                        fontFamily: 'Helvetica',
                        selectable: false,
                        evented: false
                    });
                    const number = Math.floor(Math.random() * 20);
                    const text = new Text(number.toString(), {
                        left: this.x1 + (i + 1/4) * cellWidth,
                        width: cellWidth,
                        height: cellWidth,
                        textAlign: 'center',
                        top: this.y1 + 1/4 * cellWidth,
                        fontSize: cellWidth / 2,
                        fontFamily: 'Helvetica',
                        selectable: false,
                        evented: false
                    });
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
                        left: this.x1 + (i + 1/4) * cellWidth,
                        width: cellWidth,
                        height: cellWidth,
                        textAlign: 'center',
                    });
                }
            }
            for (let i = Math.min(50, cellCount) + 1; i < this.lines.length; i++) {
                this.canvas.remove(this.lines[i]);
            }
            for (let i = Math.min(50, cellCount); i < this.indices.length; i++) {
                this.canvas.remove(this.indices[i]);
                this.canvas.remove(this.numbers[i]);
            }
            this.lines = this.lines.slice(0, Math.min(50, cellCount) + 1);
            this.indices = this.indices.slice(0, Math.min(50, cellCount));
            this.numbers = this.numbers.slice(0, Math.min(50, cellCount));
        }
    }
    render() {
        this.canvas.add(this.rect);
    }
}

export const initialiseArray = (canvas: Canvas) => {
    let currentArray: ArrayItem | null = null;
    let isDrawing: boolean = false;
    canvas.isDrawingMode = false;
    function startArray(options: TPointerEventInfo<TPointerEvent>) {
        isDrawing = true;
        currentArray = new ArrayItem(canvas, options.pointer.x, options.pointer.y, options.pointer.x, options.pointer.y);
        currentArray.render();
    }
    function drawArray(options: TPointerEventInfo<TPointerEvent>) {
        if (!isDrawing) return;
        currentArray?.draw(options.pointer.x, options.pointer.y);
        canvas.requestRenderAll();
    }
    function endArray() {
        isDrawing = false;
        currentArray = null;
        canvas.requestRenderAll();
    }
    canvas.on('mouse:down', startArray);
    canvas.on('mouse:move', drawArray);
    canvas.on('mouse:up', endArray);
    function dispose() {
        canvas.off('mouse:down', startArray);
        canvas.off('mouse:move', drawArray);
        canvas.off('mouse:up', endArray);
    }
    return dispose;
};

