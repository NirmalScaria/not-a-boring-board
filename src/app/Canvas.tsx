"use client";
// src/Canvas.tsx
import React, { useEffect, useRef } from 'react';
import { Canvas, Circle, Point, TPointerEventInfo } from 'fabric';

export const MyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const newCanvas = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      selection: false,
    });

    // Create grid dots
    const createGrid = (spacing: number) => {
      for (let x = 0; x < newCanvas.width!; x += spacing) {
        for (let y = 0; y < newCanvas.height!; y += spacing) {
          const dot = new Circle({
            left: x,
            top: y,
            radius: 2,
            fill: 'black',
            selectable: false,
            evented: false,
          });
          newCanvas.add(dot);
        }
      }
    };

    createGrid(50); // Adjust spacing as needed

    // Handle window resizing
    const handleResize = () => {
      newCanvas.setDimensions({ width: window.innerWidth, height: window.innerHeight });
      newCanvas.clear();
      createGrid(50);
    };

    window.addEventListener('resize', handleResize);

    // Wheel event for zooming and panning
    const handleWheel = (opt: TPointerEventInfo<WheelEvent>) => {
      const e = opt.e; // Get the native WheelEvent from Fabric.js event wrapper
      e.preventDefault();

      if (e.ctrlKey) {
        // Zoom logic
        const zoom = newCanvas.getZoom();
        const newZoom = zoom * (1 - e.deltaY * 0.01); // Adjust the zoom sensitivity
        newCanvas.zoomToPoint({ x: e.offsetX, y: e.offsetY } as Point, newZoom);

      } else {
        // Pan logic (invert the delta values to reverse direction)
        const delta = newCanvas.viewportTransform ? new Point(-e.deltaX, -e.deltaY) : null;
        if (delta) {
          newCanvas.relativePan(delta);
        }
      }
    };

    // Add wheel event listener
    newCanvas.on('mouse:wheel', handleWheel);

    return () => {
      window.removeEventListener('resize', handleResize);
      newCanvas.off('mouse:wheel', handleWheel);
      newCanvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default MyCanvas;
