const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  frame: 0,
  animate: true,
  bg: "#fff",
  stroke: "#000",
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = params.bg;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = params.stroke;

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridW = width * 0.8;
    const gridH = height * 0.8;
    const cellW = gridW / cols;
    const cellH = gridH / rows;
    const margX = (width - gridW) * 0.5;
    const margY = (height - gridH) * 0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellW;
      const y = row * cellH;
      const w = cellW * 0.8;

      const f = params.animate ? frame : params.frame;

      const n = random.noise3D(x, y, f * 10, params.freq);
      const angle = n * Math.PI * params.amp;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(x, y);
      context.translate(margX, margY);
      context.translate(cellW * 0.5, cellH * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;

      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.stroke();

      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();

  const folGrid = pane.addFolder({ title: "Grid" });
  folGrid.addInput(params, "cols", { min: 2, max: 50, step: 1 });
  folGrid.addInput(params, "rows", { min: 2, max: 50, step: 1 });
  folGrid.addInput(params, "scaleMin", { min: 1, max: 100 });
  folGrid.addInput(params, "scaleMax", { min: 1, max: 100 });

  const folNoise = pane.addFolder({ title: "Noise" });
  folNoise.addInput(params, "freq", { min: -0.01, max: 0.01 });
  folNoise.addInput(params, "amp", { min: 0, max: 1 });

  const folAnimate = pane.addFolder({ title: "Animate" });
  folAnimate.addInput(params, "animate");
  folAnimate.addInput(params, "frame", { min: 0, max: 999 });

  const folColor = pane.addFolder({ title: "Color" });
  folColor.addInput(params, "bg");
  folColor.addInput(params, "stroke");
};

createPane();
canvasSketch(sketch, settings);
