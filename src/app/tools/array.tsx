// utilities/canvas/pencil.ts
import { Canvas, Line, TPointerEvent, TPointerEventInfo } from 'fabric';

class ArrayItem {
    declare x1: number;
    declare y1: number;
    declare x2: number;
    declare y2: number;
    declare lineTop: Line;
    declare lineBottom: Line;
    declare lineLeft: Line;
    declare lineRight: Line;
    declare lines: Line[];
    declare canvas: Canvas;
    constructor(canvas: Canvas, x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.canvas = canvas;
        this.lineTop = new Line([x1, y1, x2, y1], {
            stroke: 'black',
            strokeWidth: 1,
            selectable: false,
            evented: false
        });
        this.lineBottom = new Line([x1, y2, x2, y2], {
            stroke: 'black',
            strokeWidth: 1,
            selectable: false,
            evented: false
        });
        this.lineLeft = new Line([x1, y1, x1, y2], {
            stroke: 'black',
            strokeWidth: 1,
            selectable: false,
            evented: false
        });
        this.lineRight = new Line([x2, y1, x2, y2], {
            stroke: 'black',
            strokeWidth: 1,
            selectable: false,
            evented: false
        });
    }
    draw(x2: number, y2: number) {
        this.x2 = x2;
        this.y2 = y2;
        this.lineTop.set({ x2: x2 });
        this.lineBottom.set({ y1: y2, y2: y2, x2: x2 });
        this.lineLeft.set({ y2: y2 });
        this.lineRight.set({ x1: x2, x2: x2, y2: y2 });
        this.render();
    }
    render() {
        this.canvas.add(this.lineTop);
        this.canvas.add(this.lineBottom);
        this.canvas.add(this.lineLeft);
        this.canvas.add(this.lineRight);
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

