"use client";
// src/Canvas.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Circle } from 'fabric';

export const MyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const zoomFactor = 0.1;

  useEffect(() => {
    if (!canvasRef.current) return;

    const newCanvas = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      selection: false,
    });

    // Create grid dots
    const createGrid = (spacing: number) => {
      for (let x = 0; x < newCanvas.width; x += spacing) {
        for (let y = 0; y < newCanvas.height; y += spacing) {
          const dot = new Circle({
            left: x,
            top: y,
            radius: 2,
            fill: 'black',
          });
          newCanvas.add(dot);
        }
      }
    };

    createGrid(50); // Adjust spacing as needed
    setCanvas(newCanvas);

    // Handle resizing
    const handleResize = () => {
      newCanvas.setDimensions({ width: window.innerWidth, height: window.innerHeight });
      newCanvas.clear();
      createGrid(50);
    };

    window.addEventListener('resize', handleResize);

    // Panning with two fingers
    let isPanning = false;
    let lastPos: { x: number; y: number } | null = null;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        isPanning = true;
        lastPos = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (isPanning && lastPos) {
        const deltaX = event.touches[0].clientX - lastPos.x;
        const deltaY = event.touches[0].clientY - lastPos.y;
        newCanvas.viewportTransform[4] += deltaX;
        newCanvas.viewportTransform[5] += deltaY;
        newCanvas.renderAll();
        lastPos = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    };

    const handleTouchEnd = () => {
      isPanning = false;
    };

    // Zooming with pinch gesture
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const zoom = event.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;
      newCanvas.setZoom(newCanvas.getZoom() * zoom);
    };

    const handleTouchZoom = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const distance = (touch1: Touch, touch2: Touch) => {
          return Math.sqrt(
            (touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2
          );
        };

        const currentDistance = distance(event.touches[0], event.touches[1]);
        const initialDistance = distance(event.changedTouches[0], event.changedTouches[1]);

        const zoom = currentDistance / initialDistance;
        newCanvas.setZoom(newCanvas.getZoom() * zoom);
      }
    };

    canvasRef.current.addEventListener('touchstart', handleTouchStart);
    canvasRef.current.addEventListener('touchmove', handleTouchMove);
    canvasRef.current.addEventListener('touchend', handleTouchEnd);
    canvasRef.current.addEventListener('touchmove', handleTouchZoom);
    // newCanvas.on('mouse:wheel', handleWheel);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvasRef.current?.removeEventListener('touchstart', handleTouchStart);
      canvasRef.current?.removeEventListener('touchmove', handleTouchMove);
      canvasRef.current?.removeEventListener('touchend', handleTouchEnd);
      canvasRef.current?.removeEventListener('touchmove', handleTouchZoom);
      newCanvas.off('mouse:wheel', handleWheel);
      newCanvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
