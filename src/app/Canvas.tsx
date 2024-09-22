"use client";
import React, { useEffect, useRef } from 'react';
import { Canvas } from 'fabric';
import { drawDots } from './utilities/canvas/background';
import { addPanAndZoom } from './utilities/canvas/panAndZoom';
import Toolbar from '@/components/Toolbar';
import { ToolItemName } from './enums/toosl';
import { initializePencil } from './tools/pencil';

export const MyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTool, setCurrentTool] = React.useState<ToolItemName>(ToolItemName.Pencil);
  const [canvas, setCanvas] = React.useState<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const newCanvas = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      selection: false,
      freeDrawingCursor: 'crosshair',
    });

    const panAndZoom = addPanAndZoom(newCanvas);
    newCanvas.on('mouse:wheel', panAndZoom);

    drawDots(newCanvas);
    initializePencil(newCanvas);

    newCanvas.requestRenderAll();
    setCanvas(newCanvas);

    return () => {
      newCanvas.off('mouse:wheel', panAndZoom);
      newCanvas.dispose();
    };
  }, []);

  return <><Toolbar canvas={canvas} currentTool={currentTool} setCurrentTool={setCurrentTool} /><canvas ref={canvasRef} /></>;
};

export default MyCanvas;
