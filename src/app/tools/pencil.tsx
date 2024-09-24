// utilities/canvas/pencil.ts
import { Canvas, PencilBrush } from 'fabric';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { TwitterPicker } from 'react-color'

let pencilBrush: PencilBrush;
let pencilWidth = 2;
let pencilColor = '#9900EF';

export const initializePencil = (canvas: Canvas) => {
    pencilBrush = new PencilBrush(canvas);
    pencilBrush.width = pencilWidth; // Set pencil width
    pencilBrush.color = pencilColor; // Set pencil color
    canvas.freeDrawingBrush = pencilBrush;
    canvas.isDrawingMode = true; // Enable drawing mode
    function dispose() {
        canvas.isDrawingMode = false;
    }
    return dispose;
};

export const PencilToolbar = ({ canvas }: { canvas: Canvas | null }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [initialX, setInitialX] = useState(0);
    const [initialY, setInitialY] = useState(0);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [currentWidth, setCurrentWidth] = useState(pencilWidth);
    useEffect(() => {
        if (canvas && pencilBrush) {
            pencilBrush.width = currentWidth;
        }
    }, [currentWidth, canvas]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setInitialX(e.clientX); // Record the initial X position
        setInitialY(e.clientY); // Record the initial Y position
    };



    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            if (isDragging) {
                const deltaX = e.clientX - initialX;
                const deltaY = e.clientY - initialY;
                let newWidth = currentWidth + deltaX / 10 - deltaY / 10; // Adjust sensitivity as needed

                newWidth = Math.max(1, Math.min(newWidth, 13));
                setCurrentWidth(newWidth);
                pencilWidth = newWidth;
                setInitialX(e.clientX); // Update initial X to prevent further accumulation
                setInitialY(e.clientY); // Update initial Y to prevent further accumulation
            }
        };
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, initialX, currentWidth, initialY]);

    return <>
        <div className="relative bg-white border-2 p-1 rounded-full z-50 m-3 ml-0 flex flex-row gap-1">
            <button
                onMouseDown={handleMouseDown}
                className={cn("transition-all flex flex-row justify-center items-center w-[50px] group rounded-full p-3 hover:bg-purple-400 active:bg-purple-200 border-2 border-purple-400 inset-2 bg-purple-100")}>
                <div className='rounded-full bg-purple-400 group-hover:bg-white' style={{ height: currentWidth, width: currentWidth }}></div>
            </button>
            <div className='h-full'>
                <button
                    onClick={() => setPickerVisible(!pickerVisible)}
                    className='w-[50px] h-[50px] p-3 rounded-full border-2' style={{ backgroundColor: pencilColor }}></button>
                {pickerVisible ? <div style={{
                    position: 'absolute',
                    zIndex: '2',
                    top: '62px',
                }}>
                    <div style={{
                        position: 'fixed',
                        top: '0px',
                        right: '0px',
                        bottom: '0px',
                        left: '0px',
                    }} onClick={() => {
                        setPickerVisible(false);
                    }} />
                    <TwitterPicker colors={['#000000', '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#EB144C', '#F78DA7', '#9900EF']} onChange={(color) => {
                        pencilBrush.color = color.hex;
                        pencilColor = color.hex;
                        setPickerVisible(false);
                    }} />
                </div> : null}
            </div>
        </div>
    </>
};