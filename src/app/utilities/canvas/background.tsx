import { Canvas } from "fabric";

const CELL_SIZE = 40;

export function drawDots(newCanvas: Canvas) {
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
}