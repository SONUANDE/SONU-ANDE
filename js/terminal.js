/* ===================================================================
   INTERACTIVE EMBEDDED UART SERIAL TERMINAL
   Allows visitors & recruiters to explore firmware credentials via CLI
   =================================================================== */

class FirmwareTerminal {
  constructor(containerId, inputId) {
    this.container = document.getElementById(containerId);
    this.input = document.getElementById(inputId);
    if (!this.container || !this.input) return;

    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => this.cmdHelp(),
      about: () => this.cmdAbout(),
      skills: () => this.cmdSkills(),
      projects: () => this.cmdProjects(),
      eyantra: () => this.cmdEyantra(),
      rymo: () => this.cmdRymo(),
      contact: () => this.cmdContact(),
      pinout: () => this.cmdPinout(),
      dmesg: () => this.cmdDmesg(),
      cat: (arg) => this.cmdCat(arg),
      clear: () => this.cmdClear(),
      cls: () => this.cmdClear(),
      whoami: () => `<span class="term-cyan">guest@recruiter-workstation [authenticated]</span>`,
      date: () => new Date().toUTCString()
    };

    this.init();
  }

  init() {
    this.printWelcome();

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const line = this.input.value.trim();
        if (line) {
          this.history.push(line);
          this.historyIndex = this.history.length;
          this.executeCommand(line);
        } else {
          this.printLine(`<span class="term-prompt">sonu@nRF52-FW:~$</span> `);
        }
        this.input.value = '';
        this.scrollToBottom();
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
        e.preventDefault();
      }
    });

    // Auto-focus on terminal click
    const terminalWindow = this.container.closest('.terminal-window');
    if (terminalWindow) {
      terminalWindow.addEventListener('click', () => {
        this.input.focus();
      });
    }
  }

  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  printLine(html) {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = html;
    this.container.appendChild(div);
  }

  printWelcome() {
    this.printLine(`<span class="term-cyan">===============================================================</span>`);
    this.printLine(`<span class="term-prompt">[SYSTEM BOOT]</span> Sonu Swathwick Ande — Embedded Firmware CLI v2.4`);
    this.printLine(`Target: ARM Cortex-M4 | Core Clock: 64.0 MHz | SoftDevice: S132`);
    this.printLine(`Type <span class="term-amber">'help'</span> to see available commands or explore credentials.`);
    this.printLine(`<span class="term-cyan">===============================================================</span>`);
    this.printLine('');
  }

  executeCommand(cmdStr) {
    this.printLine(`<span class="term-prompt">sonu@nRF52-FW:~$</span> ${this.escapeHtml(cmdStr)}`);
    const parts = cmdStr.split(' ').filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    if (this.commands[cmd]) {
      const output = this.commands[cmd](arg);
      if (output) {
        this.printLine(output);
      }
    } else {
      this.printLine(`<span style="color:#ef4444;">command not found: ${this.escapeHtml(cmd)}. Type 'help' for command listing.</span>`);
    }
    this.printLine('');
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  cmdHelp() {
    return `
Available commands:
  <span class="term-cyan">about</span>       - Engineer bio & core specializations
  <span class="term-cyan">skills</span>      - Firmware, microcontrollers & hardware matrix
  <span class="term-cyan">projects</span>    - Featured engineering project index
  <span class="term-cyan">eyantra</span>     - e-Yantra AIR 5 National Finalist spotlight
  <span class="term-cyan">rymo</span>        - RYMO Technologies internship & FES device
  <span class="term-cyan">cat resume</span>  - Display full engineering curriculum vitae
  <span class="term-cyan">pinout</span>      - Display ARM Cortex-M peripheral pinout
  <span class="term-cyan">dmesg</span>       - Show firmware kernel boot log
  <span class="term-cyan">contact</span>     - LinkedIn, GitHub, email & location
  <span class="term-cyan">clear</span>       - Clear serial screen output
    `;
  }

  cmdAbout() {
    return `
<span class="term-prompt">=== SONU SWATHWICK ANDE ===</span>
Title: Embedded Systems Engineer | Firmware Developer | Robotics Enthusiast
Degree: B.Tech in Electronics & Communication Engineering (RGUKT Ongole, 2027)
Location: Chirala, Andhra Pradesh, India
Focus: Bridging physical hardware with deterministic embedded firmware.
Key Hardware Platforms: STM32 (ARM Cortex-M3/M4), Nordic nRF52832, ESP32, AVR.
    `;
  }

  cmdSkills() {
    return `
<span class="term-cyan">[FIRMWARE &amp; CODE]</span>   : Embedded C, C++, Python, ARM Assembly, FreeRTOS
<span class="term-cyan">[MICROCONTROLLERS]</span>: STM32F103/Nucleo, Nordic nRF52832, ESP32, AVR
<span class="term-cyan">[PERIPHERALS]</span>     : GPIO, ADC/SAADC, DAC, PWM, Timers, DMA/EasyDMA, PPI, GPIOTE
<span class="term-cyan">[PROTOCOLS]</span>       : SPI, I2C, UART, BLE (Nordic SoftDevice), MQTT
<span class="term-cyan">[DEBUG &amp; BRING-UP]</span>: Digital Oscilloscopes, Logic Analyzers, J-Link RTT, KiCad
<span class="term-cyan">[CONTROL &amp; CAD]</span>   : PID Tuning, Q-learning, MuJoCo, CoppeliaSim, Fusion 360
    `;
  }

  cmdProjects() {
    return `
<span class="term-prompt">=== KEY ENGINEERING PROJECTS ===</span>
[01] <span class="term-amber">e-Yantra CropDrop Bot</span> (AIR 5 National Finalist)
     STM32F103RB, PID line-following, Q-learning, IR/RGB sensors, Electromagnet, Fusion 360.
[02] <span class="term-amber">Nordic nRF52 Real-Time Control Platform</span>
     PPI, EasyDMA, SAADC, SPI to MCP4921 DAC, S132 BLE, RTT logging, SEGGER.
[03] <span class="term-amber">FES Medical Rehabilitation Firmware</span> (RYMO Technologies)
     Pulse-width/DAC voltage control, oscilloscope validation, automated test framework (80% time cut).
[04] <span class="term-amber">PacBot Autonomous Maze Navigation</span>
     Python, MuJoCo simulation, MQTT, BFS path planning, PID wall-following, Gyroscope.
[05] <span class="term-amber">4-Channel ROV Leak Detection System</span>
     KiCad PCB, comparator analog sensing, wet/dry fault logic, noise immunity.
[06] <span class="term-amber">Autonomous Agricultural Rover</span>
     ESP32, ESP32-CAM, servo soil moisture sensor, weeding mechanism, 12V pump.
    `;
  }

  cmdEyantra() {
    return `
<span class="term-amber">=== e-Yantra Robotics Competition 2025-26 ===</span>
<span class="term-prompt">ACHIEVEMENT</span>: All India Rank 5 (AIR 5)
<span class="term-prompt">ROLE</span>       : Team Lead &amp; Embedded Systems Developer (4 members)
<span class="term-prompt">TARGET</span>     : STM32F103RB Nucleo Platform
<span class="term-prompt">SYSTEM</span>     : Autonomous crop detection and drop robot. Integrated IR reflection arrays,
              TCS3200 colour recognition, proximity telemetry, and an electromagnetic picker.
              Implemented PID motor control and explored Q-learning state navigation.
    `;
  }

  cmdRymo() {
    return `
<span class="term-cyan">=== RYMO TECHNOLOGIES — EMBEDDED SYSTEMS INTERN ===</span>
Domain: Functional Electrical Stimulation (FES) medical rehabilitation device.
Platform: Nordic nRF52832 (ARM Cortex-M4).
Key Tasks:
  • Configured GPIOTE, PPI, SAADC, and SPI communication with external DAC.
  • Generated precise biphasic therapeutic pulses with microsecond timing.
  • Validated board bring-up, PCB routing, and signal integrity with oscilloscopes.
  • Designed automated test pipelines cutting repetitive manual testing effort by ~80%.
    `;
  }

  cmdPinout() {
    return `
<span class="term-cyan">STM32F103RB Pinout &amp; Peripheral Mapping:</span>
         +-----------------------+
   VBAT  | [01]             [64] | BOOT0
   PC13  | [02]  TAMPER     [63] | PB9 (I2C1_SDA / TIM4_CH4)
   PC14  | [03]  OSC32_IN   [62] | PB8 (I2C1_SCL / TIM4_CH3)
   PC15  | [04]  OSC32_OUT  [61] | PB7 (I2C1_SDA)
   NRST  | [07]  RESET      [58] | PB4 (SPI1_MISO)
   PA0   | [14]  ADC1_IN0   [57] | PB3 (SPI1_SCK)
   PA1   | [15]  ADC1_IN1   [56] | PD2 (TIM3_ETR)
   PA2   | [16]  USART2_TX  [55] | PC12 (UART5_TX)
   PA3   | [17]  USART2_RX  [50] | PA14 (SWCLK / Debug)
   PA5   | [21]  SPI1_SCK   [49] | PA13 (SWDIO / Debug)
   PA6   | [22]  TIM3_CH1   [43] | PA10 (USART1_RX)
   PA7   | [23]  TIM3_CH2   [42] | PA9  (USART1_TX)
         +-----------------------+
    `;
  }

  cmdDmesg() {
    return `
[ 0.000000] System Initializing: ARM Cortex-M4 Core running @ 64.0 MHz
[ 0.001240] DWT cycle counter initialized. Flash latency: 2 wait states.
[ 0.002150] GPIO Port A, B, C peripheral clocks enabled.
[ 0.003100] NVIC Priority Group set to 4 bits pre-emption, 0 subpriority.
[ 0.004520] DMA1 Channel 1 mapped to SAADC buffer [RingBuffer size: 512B].
[ 0.005890] SPI1 configured in Master Mode @ 8 Mbps (CPOL=0, CPHA=0).
[ 0.007120] PPI Channels 0-3 configured for autonomous hardware task linking.
[ 0.008400] Nordic SoftDevice S132 BLE stack initialized successfully.
[ 0.009950] Watchdog Timer (WDT) active: Timeout 2000 ms.
[ 0.012000] System status: RUNNING deterministic loop.
    `;
  }

  cmdCat(arg) {
    if (arg && arg.toLowerCase().includes('resume')) {
      return `
========================================================================
RESUME: SONU SWATHWICK ANDE
Embedded Systems Engineer | Firmware Developer | Robotics Enthusiast
Chirala, AP, India | linkedin.com/in/sonuande | github.com/SONUANDE
========================================================================

EDUCATION:
• B.Tech in Electronics & Communication Eng. | RGUKT Ongole | CGPA: 8.4/10 (2027)
• Pre-University Course | RGUKT | CGPA: 9.69/10 (2023)

EXPERIENCE:
• Embedded Systems Intern | RYMO Technologies
  - Developed nRF52832 firmware for FES medical rehabilitation device.
  - Implemented PPI, EasyDMA, SAADC, SPI, and precise pulse-timing routines.
  - Automated PCB test captures with logic analyzers, reducing effort by ~80%.

SIGNATURE AWARDS:
• e-Yantra Robotics Competition 2025-26: All India Rank 5 (Team Lead)
• NXP AIM 2025: Regional Finalist

TECHNICAL SKILLS:
• Firmware: Embedded C, C, C++, Python, FreeRTOS concepts
• Hardware: STM32, Nordic nRF52, ESP32, ARM Cortex-M, PCB Bring-up
• Protocols: UART, SPI, I2C, BLE, MQTT, PPI, EasyDMA
• Testing: Oscilloscopes, Logic Analyzers, J-Link RTT, KiCad, Fusion 360
========================================================================
      `;
    }
    return `Usage: cat resume`;
  }

  cmdContact() {
    return `
<span class="term-prompt">=== CONTACT CHANNELS ===</span>
• LinkedIn : <a href="https://linkedin.com/in/sonuande" target="_blank" style="color:#38bdf8;text-decoration:underline;">https://linkedin.com/in/sonuande</a>
• GitHub   : <a href="https://github.com/SONUANDE" target="_blank" style="color:#38bdf8;text-decoration:underline;">https://github.com/SONUANDE</a>
• Location : Chirala, Andhra Pradesh, India
• Direct   : Available for Embedded Firmware &amp; Hardware R&amp;D roles.
    `;
  }

  cmdClear() {
    this.container.innerHTML = '';
    return null;
  }
}

window.FirmwareTerminal = FirmwareTerminal;
