/* ===================================================================
   SONU SWATHWICK ANDE - MAIN JAVASCRIPT CONTROLLER
   Handles Navigation, Themes, Filters, Modals, Register Lab & Interaction
   =================================================================== */

// Project Technical Data for Deep Dive Modals
const PROJECTS_DATA = {
  eyantra: {
    title: "e-Yantra CropDrop Bot — Autonomous Agricultural System",
    category: "Autonomous Robotics & Control",
    badge: "National Finalist — All India Rank 5 (2025–26)",
    platform: "STM32F103RB (ARM Cortex-M3 @ 72 MHz) | STM32CubeIDE",
    role: "Team Lead & Embedded Systems Developer (4 members)",
    overview: "An autonomous robotics platform engineered for precision agricultural object identification, collection, and delivery. Designed and built from scratch to navigate complex track lines, detect target fruit/crop objects with high spectral accuracy, actuate an electromagnetic picker, and deposit them into designated aggregation zones.",
    hardware: [
      "Microcontroller: STM32 Nucleo-F103RB board",
      "Sensing Array: 5-channel Infrared reflectance array + TCS3200 RGB sensor + Sharp IR proximity sensor",
      "Actuation: High-torque DC metal gear motors driven by L298N H-bridge, 12V High-flux Electromagnet",
      "Mechanical: Custom low center-of-gravity chassis designed in Autodesk Fusion 360 with optimized wheel traction and clearance"
    ],
    firmware: [
      "Configured STM32 TIM1/TIM2 in PWM mode for motor speed control with deadband compensation",
      "Developed high-frequency PID line-following loop with dynamic sensor weighting and cornering heuristics",
      "Color detection algorithm with white-balance calibration to handle variable ambient arena lighting",
      "Explored Q-table state representation and action-selection reinforcement learning for arena navigation",
      "UART telemetry transmission for live sensor diagnostics and tuning"
    ],
    validation: "Bench-tested motor current draws, verified line tracking response times under 15ms, and validated electromagnetic drop timing. Resulted in securing 5th place nationally out of thousands of participating university teams across India.",
    tags: ["STM32F103", "Embedded C", "PID Control", "Q-Learning", "Fusion 360", "Sensors", "HAL"]
  },

  nrf52platform: {
    title: "Real-Time Low-Power Control Platform on Nordic nRF52",
    category: "Bare-Metal & Low-Power Embedded",
    badge: "Hardware-Assisted Peripheral Interconnect",
    platform: "Nordic nRF52832 (ARM Cortex-M4 @ 64 MHz) | PCA10040 Kit",
    role: "Embedded Firmware Developer",
    overview: "A bare-metal, event-driven embedded control architecture built to maximize energy efficiency by offloading peripheral coordination from the CPU using Nordic's Programmable Peripheral Interconnect (PPI) and EasyDMA.",
    hardware: [
      "Target SoC: Nordic nRF52832 (ARM Cortex-M4 with FPU, 512KB Flash, 64KB RAM)",
      "Development Kit: Nordic PCA10040 board with onboard J-Link",
      "DAC Interface: Microchip MCP4921 12-bit SPI Digital-to-Analog Converter",
      "Measurement Setup: Rigol Digital Storage Oscilloscope, Logic Analyzer, RTT logging stream"
    ],
    firmware: [
      "Configured GPIOTE and PPI channels to autonomously trigger SAADC conversions on hardware timer compare events without CPU wake-up",
      "Utilized EasyDMA to stream acquired analog values directly into RAM circular buffers",
      "Implemented hardware SPI master running at 8 MHz to drive the MCP4921 DAC for precision waveform generation",
      "Integrated Nordic S132 SoftDevice BLE stack for wireless parameter tuning and live telemetry transmission",
      "Zero-latency real-time diagnostic logging using SEGGER Real-Time Terminal (RTT)"
    ],
    validation: "Verified zero-jitter event-to-task triggering via PPI on an oscilloscope. Demonstrated substantial power savings compared to traditional polling and interrupt-heavy implementations.",
    tags: ["Nordic nRF52", "ARM Cortex-M4", "PPI / EasyDMA", "SAADC", "SPI DAC", "BLE S132", "SEGGER RTT"]
  },

  fesdevice: {
    title: "Functional Electrical Stimulation (FES) Rehabilitation Firmware",
    category: "Medical Rehabilitation & Industry Internship",
    badge: "Industry Project @ RYMO Technologies",
    platform: "Nordic nRF52832 | Medical Grade Embedded Systems",
    role: "Embedded Systems Intern (June–September 2026)",
    overview: "Developed embedded firmware and performed comprehensive hardware validation for a medical rehabilitation device that delivers controlled neuromuscular electrical stimulation to assist neuro-rehabilitation therapy.",
    hardware: [
      "Custom medical-grade PCB based on Nordic nRF52832 SoC",
      "High-voltage pulse transformation and biphasic output stage",
      "Digital-to-Analog conversion stage for precise current/voltage regulation",
      "Instruments: Rigol 4-channel Digital Storage Oscilloscope, USB Logic Analyzer, Programmable Power Supplies"
    ],
    firmware: [
      "Engineered deterministic microsecond timing generation for biphasic electrical pulses with strict charge-balance constraints",
      "Configured hardware timers, PPI channels, and SPI peripherals for output stage parameter modulation (frequency, pulse width, amplitude)",
      "Implemented hardware safety watchdogs, electrode impedance checks, and emergency shutdown routines",
      "Created automated test scripts and serial logging tools that automated repetitive validation cycles, cutting manual test effort by ~80%"
    ],
    validation: "Performed board-level bring-up, solder inspection, noise floor validation, and timing jitter analysis. Ensured therapeutic pulses remained strictly within medical tolerance limits.",
    tags: ["Medical Embedded", "nRF52832", "Hardware Validation", "Test Automation (~80%)", "Oscilloscope", "SPI"]
  },

  pacbot: {
    title: "PacBot Autonomous Maze Navigation & Physical Simulation",
    category: "Robotics Kinematics & Path Planning",
    badge: "Simulation & Autonomous Algorithms",
    platform: "Python | MuJoCo Physics Engine | MQTT Protocol",
    role: "Robotics & Algorithm Developer",
    overview: "A simulated autonomous robotics agent designed to navigate grid-based maze environments, dodge dynamic obstacles, gather items, and calculate optimal paths in real time.",
    hardware: [
      "Physics Engine: MuJoCo high-fidelity physics simulator",
      "Kinematic Model: Differential drive robot with sensor array simulation (LiDAR / Ultrasonic / Gyroscope)",
      "Messaging Protocol: Asynchronous MQTT broker for real-time sensor/actuator telemetry streams"
    ],
    firmware: [
      "Implemented Breadth-First Search (BFS) algorithm for guaranteed shortest-path route planning through mazes",
      "Designed PID-based wall-following and obstacle-clearing controllers",
      "Utilized gyroscope feedback with an angular turn PID controller for precise 90-degree cornering",
      "Created state-machine for autonomous transition between explore, collect, and escape modes"
    ],
    validation: "Demonstrated zero collision rates over 50 randomized maze configurations and verified convergence of PID orientation angles.",
    tags: ["MuJoCo", "Python", "BFS Path Planning", "PID Control", "MQTT", "State Machine"]
  },

  rovleak: {
    title: "4-Channel ROV Leak Detection & Safety System",
    category: "Electronics Hardware & Analog Design",
    badge: "Marine Electronics & Fault Protection",
    platform: "KiCad EDA | Analog Electronics | Comparator Circuitry",
    role: "Hardware & PCB Designer",
    overview: "A high-reliability multi-channel water ingress detection and alarm subsystem engineered for deep-submergence underwater Remotely Operated Vehicles (ROVs).",
    hardware: [
      "KiCad Schematic & 2-Layer PCB design with moisture isolation trenches",
      "Quad precision voltage comparator IC with hysteresis to prevent oscillation",
      "Gold-plated probe interfaces with AC sensing or corrosion mitigation bias",
      "Visual status indicators (4x discrete LED channels) and master alarm buzzer/relay output"
    ],
    firmware: [
      "Pure analog/hardware safety fail-safe logic ensuring zero software crash vulnerability",
      "Designed for ultra-low quiescent standby current during subsea missions",
      "Integrated noise-rejection RC filters to eliminate false positives caused by motor EMI or capacitive spikes",
      "Provides digital open-collector logic outputs compatible with companion onboard flight computers"
    ],
    validation: "Circuit simulation in SPICE verified clean hysteresis switching thresholds for fluid conductivities ranging from distilled water to high-salinity seawater.",
    tags: ["KiCad", "Analog Circuits", "PCB Design", "Comparators", "Marine ROV", "Noise Immunity"]
  },

  agrover: {
    title: "Autonomous Agricultural Soil-Monitoring Rover",
    category: "Robotics & IoT Prototyping",
    badge: "Field Robotics & Automation",
    platform: "ESP32 SoC | ESP32-CAM | FreeRTOS",
    role: "System Architect & Embedded Developer",
    overview: "A rugged agricultural field robot engineered to patrol farm plots, deploy soil moisture probes into the soil via a servo arm, capture crop health images, and trigger precision irrigation valves.",
    hardware: [
      "Core Microcontroller: ESP32 dual-core Wi-Fi/BLE module + ESP32-CAM for visual inspection",
      "Motor Drive: High-torque DC planetary gear motors with L298N dual H-bridge",
      "Mechanism: Servo-actuated 1-DOF soil probe deployer and weeding blade mechanism",
      "Irrigation: 12V RS-585 high-pressure DC water pump with relay trigger",
      "Chassis: High ground-clearance rigid PVC tubular frame"
    ],
    firmware: [
      "FreeRTOS multitasking: Task 1 (Motor Control), Task 2 (Sensor acquisition), Task 3 (Web telemetry)",
      "Web-socket server hosted directly on the ESP32 for live low-latency video feed and manual override",
      "Automatic threshold triggering: drives pump when moisture readings fall below defined agronomic levels",
      "Deep sleep low-power cycling between sensor inspection rounds"
    ],
    validation: "Tested across real agricultural soil beds, demonstrating reliable autonomous probe insertion, accurate moisture telemetry, and live camera streaming over Wi-Fi.",
    tags: ["ESP32", "ESP32-CAM", "FreeRTOS", "IoT", "Sensors", "Field Robotics", "Servos"]
  }
};

// Register Bitfield Definition (STM32 TIMx_CR1 & Nordic PPI CHEN)
const REGISTER_MODES = {
  tim_cr1: {
    name: "TIMx_CR1 (Timer Control Register 1)",
    family: "STM32F103 / ARM Cortex-M",
    bits: [
      { num: 0, name: "CEN", desc: "Counter Enable (1 = Counter enabled, 0 = Counter disabled)" },
      { num: 1, name: "UDIS", desc: "Update Disable (1 = Update event disabled)" },
      { num: 2, name: "URS", desc: "Update Request Source (1 = Only overflow/underflow generates UEV)" },
      { num: 3, name: "OPM", desc: "One-Pulse Mode (1 = Counter stops at next update event)" },
      { num: 4, name: "DIR", desc: "Direction (0 = Counter upcounter, 1 = Counter downcounter)" },
      { num: 5, name: "CMS[0]", desc: "Center-aligned mode selection bit 0" },
      { num: 6, name: "CMS[1]", desc: "Center-aligned mode selection bit 1" },
      { num: 7, name: "ARPE", desc: "Auto-reload Preload Enable (1 = TIMx_ARR is buffered)" },
      { num: 8, name: "CKD[0]", desc: "Clock Division bit 0" },
      { num: 9, name: "CKD[1]", desc: "Clock Division bit 1" },
      { num: 10, name: "RES10", desc: "Reserved bit (Read as 0)" },
      { num: 11, name: "RES11", desc: "Reserved bit (Read as 0)" },
      { num: 12, name: "RES12", desc: "Reserved bit (Read as 0)" },
      { num: 13, name: "RES13", desc: "Reserved bit (Read as 0)" },
      { num: 14, name: "RES14", desc: "Reserved bit (Read as 0)" },
      { num: 15, name: "RES15", desc: "Reserved bit (Read as 0)" }
    ],
    defaultVal: 0x0081 // CEN=1, ARPE=1 (Common timer PWM configuration)
  }
};

let currentRegisterValue = REGISTER_MODES.tim_cr1.defaultVal;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initProjectFilters();
  initModals();
  initLabTabs();
  initRegisterExplorer();
  initOscilloscopes();
  initTerminal();
  initContactForm();
  initAtoZModal();
});

/* ===================================================================
   THEME SWITCHER (Dark default / Light toggle)
   =================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('sonu_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('sonu_theme', nextTheme);
      updateThemeIcon(nextTheme);
      showToast(`Switched to ${nextTheme} mode`);
    });
  }
}

function updateThemeIcon(theme) {
  const iconSpan = document.getElementById('themeIcon');
  if (iconSpan) {
    iconSpan.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/* ===================================================================
   NAVIGATION & SCROLL SPY
   =================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    const sections = document.querySelectorAll('section[id]');
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinks.forEach(l => {
      l.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ===================================================================
   PROJECTS FILTERING
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   MODALS: PROJECT DEEP DIVE & RESUME
   =================================================================== */
function initModals() {
  const modalBackdrop = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalProjectTitle');
  const modalBody = document.getElementById('modalProjectBody');
  const closeBtns = document.querySelectorAll('.modal-close-trigger');

  // Open Project Modal
  document.querySelectorAll('[data-open-project]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = trigger.getAttribute('data-open-project');
      const data = PROJECTS_DATA[projKey];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalBody.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <span class="badge badge-amber" style="margin-right: 0.5rem;">${data.badge}</span>
          <span class="badge badge-emerald">${data.category}</span>
        </div>
        <p style="font-size: 1.05rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 1.5rem;">
          ${data.overview}
        </p>

        <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-cyan); margin-bottom: 0.5rem; text-transform: uppercase;">
            Target Architecture &amp; Role
          </h4>
          <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
            <strong>Platform:</strong> <code>${data.platform}</code>
          </div>
          <div style="font-size: 0.9rem; color: var(--text-secondary);">
            <strong>Role:</strong> ${data.role}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
          <div style="background: var(--bg-tertiary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <h4 style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-emerald); margin-bottom: 0.75rem;">
              ⚡ HARDWARE SUBSYSTEMS
            </h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
              ${data.hardware.map(item => `<li><span style="color:var(--accent-emerald); margin-right: 6px;">▸</span>${item}</li>`).join('')}
            </ul>
          </div>

          <div style="background: var(--bg-tertiary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <h4 style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-cyan); margin-bottom: 0.75rem;">
              💾 FIRMWARE &amp; ALGORITHMS
            </h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
              ${data.firmware.map(item => `<li><span style="color:var(--accent-cyan); margin-right: 6px;">▸</span>${item}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-emerald); margin-bottom: 0.4rem;">
            🔬 VALIDATION &amp; TEST RESULTS
          </h4>
          <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
            ${data.validation}
          </p>
        </div>

        <div>
          <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
            Tech Stack Tags
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${data.tags.map(t => `<span class="tech-pill">${t}</span>`).join('')}
          </div>
        </div>
      `;

      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Resume Modal
  const resumeModal = document.getElementById('resumeModal');
  document.querySelectorAll('[data-open-resume]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modals
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
      document.body.style.overflow = '';
    });
  });

  // Click outside modal dialog to close
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Escape key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
      document.body.style.overflow = '';
    }
  });
}

/* ===================================================================
   LAB TABS: OSCILLOSCOPE VS REGISTER EXPLORER
   =================================================================== */
function initLabTabs() {
  const tabBtns = document.querySelectorAll('.lab-tab-btn');
  const panes = document.querySelectorAll('.lab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(btn.getAttribute('data-tab'));
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   INTERACTIVE REGISTER BITFIELD EXPLORER
   =================================================================== */
function initRegisterExplorer() {
  const bitGrid = document.getElementById('regBitfieldGrid');
  const hexDisplay = document.getElementById('regHexValue');
  const regBreakdown = document.getElementById('regBreakdown');
  const regSelect = document.getElementById('regSelectDropdown');

  const regInfo = REGISTER_MODES.tim_cr1;

  function renderBits() {
    if (!bitGrid) return;
    bitGrid.innerHTML = '';

    // Render 15 down to 0
    for (let i = 15; i >= 0; i--) {
      const bitDef = regInfo.bits[i];
      const isSet = (currentRegisterValue & (1 << i)) !== 0;

      const cell = document.createElement('div');
      cell.className = `bit-cell ${isSet ? 'active' : ''}`;
      cell.innerHTML = `
        <div class="bit-num">${i}</div>
        <div class="bit-val">${isSet ? '1' : '0'}</div>
      `;

      cell.title = `${bitDef.name}: ${bitDef.desc}`;

      cell.addEventListener('click', () => {
        // Toggle bit
        currentRegisterValue ^= (1 << i);
        renderBits();
        updateHexAndBreakdown();
        showToast(`Bit ${i} (${bitDef.name}) set to ${(currentRegisterValue & (1 << i)) ? '1' : '0'}`);
      });

      bitGrid.appendChild(cell);
    }
  }

  function updateHexAndBreakdown() {
    if (hexDisplay) {
      hexDisplay.textContent = '0x' + currentRegisterValue.toString(16).toUpperCase().padStart(4, '0');
    }

    if (regBreakdown) {
      regBreakdown.innerHTML = '';
      regInfo.bits.slice(0, 8).forEach(b => {
        const isSet = (currentRegisterValue & (1 << b.num)) !== 0;
        const card = document.createElement('div');
        card.className = 'field-badge-card';
        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4>${b.name} <span style="font-size:0.7rem; color:var(--text-muted);">(Bit ${b.num})</span></h4>
            <span class="badge ${isSet ? 'badge-emerald' : ''}">${isSet ? 'ENABLED (1)' : 'DISABLED (0)'}</span>
          </div>
          <p>${b.desc}</p>
        `;
        regBreakdown.appendChild(card);
      });
    }
  }

  renderBits();
  updateHexAndBreakdown();
}

/* ===================================================================
   OSCILLOSCOPES INITIALIZATION
   =================================================================== */
let labScope = null;
let heroScope = null;

function initOscilloscopes() {
  if (typeof OscilloscopeSimulator === 'undefined') return;

  // Mini scope in hero silicon card
  heroScope = new OscilloscopeSimulator('heroMiniScope', {
    isMini: true,
    signalType: 'spi',
    timeDiv: 1.0,
    voltDiv: 1.0
  });

  // Main lab scope
  labScope = new OscilloscopeSimulator('labOscilloscope', {
    isMini: false,
    signalType: 'spi',
    timeDiv: 1.0,
    voltDiv: 1.0
  });

  // Lab controls
  const signalButtons = document.querySelectorAll('.signal-select-btn');
  signalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      signalButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sigType = btn.getAttribute('data-signal');
      if (labScope) labScope.setSignal(sigType);
      if (heroScope) heroScope.setSignal(sigType);
      showToast(`Oscilloscope channel set to ${sigType.toUpperCase()}`);
    });
  });

  const timeSlider = document.getElementById('scopeTimebaseSlider');
  if (timeSlider) {
    timeSlider.addEventListener('input', (e) => {
      if (labScope) labScope.setTimeDiv(e.target.value);
    });
  }

  const voltSlider = document.getElementById('scopeVoltSlider');
  if (voltSlider) {
    voltSlider.addEventListener('input', (e) => {
      if (labScope) labScope.setVoltDiv(e.target.value);
    });
  }

  const pauseBtn = document.getElementById('scopePauseBtn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      if (labScope) {
        const running = labScope.toggleRun();
        pauseBtn.textContent = running ? '⏸ PAUSE RUN' : '▶ RESUME RUN';
        pauseBtn.className = running ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-primary';
      }
    });
  }
}

/* ===================================================================
   UART TERMINAL INITIALIZATION
   =================================================================== */
function initTerminal() {
  if (typeof FirmwareTerminal === 'undefined') return;
  new FirmwareTerminal('termOutputBody', 'termCommandLineInput');
}

/* ===================================================================
   A-Z ENGINEERING PROFILE MODAL
   =================================================================== */
function initAtoZModal() {
  // Add quick info popup or highlight when clicking A-Z items
  document.querySelectorAll('.az-card').forEach(card => {
    card.addEventListener('click', () => {
      const letter = card.querySelector('.az-letter').textContent.trim();
      const theme = card.querySelector('.az-theme').textContent.trim();
      showToast(`[${letter}] ${theme}`);
    });
  });
}

/* ===================================================================
   CONTACT FORM & TOAST NOTIFICATION
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const subject = document.getElementById('senderSubject').value;
      const message = document.getElementById('senderMessage').value;

      // Construct mailto link as fallback
      const mailtoLink = `mailto:sonuande@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
      
      window.open(mailtoLink, '_blank');
      showToast('Opening email client with your message...');
      form.reset();
    });
  }

  // Copy Email Button
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = "sonuande@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard: sonuande@gmail.com');
      }).catch(() => {
        showToast('Direct email: sonuande@gmail.com');
      });
    });
  }
}

// Global Toast Messenger
function showToast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="color:var(--accent-cyan)">⚡</span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
