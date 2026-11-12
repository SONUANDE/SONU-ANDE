/* ===================================================================
   INTERACTIVE HARDWARE LAB: OSCILLOSCOPE & LOGIC ANALYZER ENGINE
   Simulates real-world embedded signals: SPI, PWM, FES Biphasic Pulse, UART
   =================================================================== */

class OscilloscopeSimulator {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.options = Object.assign({
      isMini: false,
      gridColor: '#0c2238',
      traceColor: '#00e5ff',
      traceColor2: '#10b981',
      traceColor3: '#f59e0b',
      sampleRate: 1000,
      timeDiv: 1.0,
      voltDiv: 1.0,
      signalType: 'spi' // 'spi', 'pwm', 'fes', 'uart'
    }, options);

    this.isRunning = true;
    this.phase = 0;
    this.frequency = 1.0;
    this.pwmDuty = 0.65;
    this.animationId = null;
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.start();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  setSignal(type) {
    this.signalType = type;
    this.options.signalType = type;
  }

  setTimeDiv(val) {
    this.options.timeDiv = parseFloat(val);
  }

  setVoltDiv(val) {
    this.options.voltDiv = parseFloat(val);
  }

  setPwmDuty(duty) {
    this.pwmDuty = parseFloat(duty);
  }

  toggleRun() {
    this.isRunning = !this.isRunning;
    return this.isRunning;
  }

  drawGrid(w, h) {
    const ctx = this.ctx;
    ctx.strokeStyle = this.options.gridColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    const numCols = 10;
    const numRows = 8;
    const dx = w / numCols;
    const dy = h / numRows;

    // Vertical grid lines
    for (let x = 0; x <= w; x += dx) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = 0; y <= h; y += dy) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Center crosshairs (solid)
    ctx.setLineDash([]);
    ctx.strokeStyle = '#1e3a5f';
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
  }

  render() {
    if (!this.canvas) return;
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Dark screen background with slight persistence glow
    ctx.fillStyle = 'rgba(2, 6, 23, 0.28)';
    ctx.fillRect(0, 0, w, h);

    if (!this.options.isMini) {
      this.drawGrid(w, h);
    }

    ctx.lineWidth = this.options.isMini ? 1.8 : 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const t = this.phase;
    const speed = this.isRunning ? 0.04 * this.options.timeDiv : 0;
    this.phase += speed;

    const signal = this.options.signalType;

    if (signal === 'spi') {
      this.drawSPISignals(w, h, t);
    } else if (signal === 'pwm') {
      this.drawPWMSignal(w, h, t);
    } else if (signal === 'fes') {
      this.drawFESSignal(w, h, t);
    } else if (signal === 'uart') {
      this.drawUARTSignal(w, h, t);
    }

    this.animationId = requestAnimationFrame(() => this.render());
  }

  // Multi-channel SPI: CS (Yellow), SCK (Cyan), MOSI (Green)
  drawSPISignals(w, h, t) {
    const ctx = this.ctx;
    const clkRow = h * 0.35;
    const mosiRow = h * 0.65;
    const csRow = h * 0.15;

    // Channel 1: SPI CS# (Chip Select Active Low)
    ctx.strokeStyle = this.options.traceColor3; // Amber
    ctx.shadowColor = this.options.traceColor3;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const cycle = ((x * 0.015 - t * 0.3) % 4 + 4) % 4;
      const isLow = cycle < 2.8;
      const y = isLow ? csRow + 15 : csRow;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Channel 2: SPI SCK Clock (Cyan)
    ctx.strokeStyle = this.options.traceColor; // Cyan
    ctx.shadowColor = this.options.traceColor;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const cycle = ((x * 0.08 - t * 1.5) % 2 + 2) % 2;
      const csCycle = ((x * 0.015 - t * 0.3) % 4 + 4) % 4;
      const isEnabled = csCycle < 2.8;
      const y = isEnabled ? (cycle > 1 ? clkRow - 20 : clkRow + 20) : clkRow - 20;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Channel 3: SPI MOSI Data (Emerald)
    ctx.strokeStyle = this.options.traceColor2; // Emerald
    ctx.shadowColor = this.options.traceColor2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const bitIndex = Math.floor((x * 0.08 - t * 1.5) / 2);
      const fakeBits = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0];
      const bit = fakeBits[((bitIndex % fakeBits.length) + fakeBits.length) % fakeBits.length];
      const y = bit ? mosiRow - 20 : mosiRow + 20;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.shadowBlur = 0; // reset
  }

  // PWM Signal with variable duty cycle
  drawPWMSignal(w, h, t) {
    const ctx = this.ctx;
    const midY = h * 0.5;
    const amp = (h * 0.3) * this.options.voltDiv;
    const duty = this.pwmDuty;

    ctx.strokeStyle = this.options.traceColor;
    ctx.shadowColor = this.options.traceColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();

    const period = 80;
    for (let x = 0; x < w; x++) {
      const pos = ((x - t * 60) % period + period) % period;
      const isHigh = pos < period * duty;
      const y = isHigh ? midY - amp : midY + amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // FES Biphasic Rehabilitation Pulse (from RYMO Internship experience)
  drawFESSignal(w, h, t) {
    const ctx = this.ctx;
    const baseline = h * 0.5;
    const amp = (h * 0.35) * this.options.voltDiv;

    ctx.strokeStyle = this.options.traceColor2; // Emerald
    ctx.shadowColor = this.options.traceColor2;
    ctx.shadowBlur = 8;
    ctx.beginPath();

    const cycleLen = 140;
    for (let x = 0; x < w; x++) {
      const pos = ((x - t * 40) % cycleLen + cycleLen) % cycleLen;
      let y = baseline;
      if (pos >= 10 && pos < 25) {
        // Positive phase
        y = baseline - amp;
      } else if (pos >= 25 && pos < 32) {
        // Inter-phase interval
        y = baseline;
      } else if (pos >= 32 && pos < 47) {
        // Negative charge-balancing phase
        y = baseline + amp;
      }
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // UART Serial Packet (Start bit, 8 bits data, Stop bit)
  drawUARTSignal(w, h, t) {
    const ctx = this.ctx;
    const highY = h * 0.3;
    const lowY = h * 0.7;

    ctx.strokeStyle = this.options.traceColor3; // Amber
    ctx.shadowColor = this.options.traceColor3;
    ctx.shadowBlur = 8;
    ctx.beginPath();

    // Byte pattern: Start(0), 1, 0, 1, 0, 1, 1, 0, Stop(1), Idle(1)
    const pattern = [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1];
    const bitWidth = 35;
    const totalWidth = pattern.length * bitWidth;

    for (let x = 0; x < w; x++) {
      const pos = ((x - t * 50) % totalWidth + totalWidth) % totalWidth;
      const bitIdx = Math.floor(pos / bitWidth);
      const isHigh = pattern[bitIdx] === 1;
      const y = isHigh ? highY : lowY;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  start() {
    if (!this.animationId) {
      this.render();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// Export or expose globally
window.OscilloscopeSimulator = OscilloscopeSimulator;
