"use client";
import React, { useEffect, useRef } from 'react';
import { Canvas, Point, TPointerEventInfo } from 'fabric';

const CELL_SIZE = 40;

export const MyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const newCanvas = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      selection: false,
    });

    const handleWheel = (opt: TPointerEventInfo<WheelEvent>) => {
      const e = opt.e;
      e.preventDefault();

      if (e.ctrlKey) {
        const zoom = newCanvas.getZoom();
        const newZoom = Math.max(0.3, zoom * (1 - e.deltaY * 0.01));
        newCanvas.zoomToPoint({ x: e.offsetX, y: e.offsetY } as Point, newZoom);
      } else {
        const delta = newCanvas.viewportTransform ? new Point(-e.deltaX, -e.deltaY) : null;
        if (delta) {
          newCanvas.relativePan(delta);
        }
      }
    };

    newCanvas.on('mouse:wheel', handleWheel);


    newCanvas.requestRenderAll();

    newCanvas.on('before:render', () => {
      const ctx = newCanvas.contextTop;
      ctx.clearRect(0, 0, newCanvas.width, newCanvas.height);

      const zoom = newCanvas.getZoom();
      const offsetX = newCanvas.viewportTransform[4];
      const offsetY = newCanvas.viewportTransform[5];

      // ctx.strokeStyle = "#cecece";
      // ctx.lineWidth = 1;

      const gridSize = CELL_SIZE * zoom;
      console.log("Zoom : ", zoom)
      const numCellsX = Math.ceil(newCanvas.width / gridSize);
      const numCellsY = Math.ceil(newCanvas.height / gridSize);

      const gridOffsetX = offsetX % gridSize;
      const gridOffsetY = offsetY % gridSize;

      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= numCellsX; x++) {
        for (let y = 0; y <= numCellsY; y++) {
          const xCoord = gridOffsetX + x * gridSize;
          const yCoord = gridOffsetY + y * gridSize;
          ctx.beginPath();
          ctx.ellipse(xCoord, yCoord, 1.5, 1.5, 0, 0, 2 * Math.PI);
          ctx.fillStyle = '#777777';
          ctx.fill();
          ctx.closePath();
        }
      }

    });

    return () => {
      newCanvas.off('mouse:wheel', handleWheel);
      newCanvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default MyCanvas;
