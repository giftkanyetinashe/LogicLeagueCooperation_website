/**
 * LOGIC LEAGUE COOPERATION - PRESTIGE ENGINE
 * Handles strategic problem solving (Command Bar), scroll reveals, and World-Class Hero Slider.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Load Global Components First
    await loadGlobalComponents();

    initScrollEffects();
    initCommandBar();
    initNavBehavior();
    initHeroSlider();
    initCounters();

    // Portal Specifics
    if (document.getElementById('dataRainContainer')) {
        // Start Visual Engines
        initDataRain();
        initDataRain('navigator-rain', '#0A192F');
        initPointCloud();
        initCounters();
    }
});

/**
 * Load Header and Footer from separate files
 */
async function loadGlobalComponents() {
    try {
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        if (headerPlaceholder) {
            const headerRes = await fetch('header.html');
            const headerHtml = await headerRes.text();
            headerPlaceholder.outerHTML = headerHtml;
        }

        if (footerPlaceholder) {
            const footerRes = await fetch('footer.html');
            const footerHtml = await footerRes.text();
            footerPlaceholder.outerHTML = footerHtml;
        }

        // Apply dynamic branding to the logo
        const logoArm = document.querySelector('.logo-arm');
        const divisionTag = document.querySelector('.division-tag');
        
        if (logoArm && divisionTag) {
            const page = window.location.pathname.split('/').pop() || 'index.html';
            const branding = {
                'index.html': { name: '// HQ', color: '#D32F2F' },
                'insight.html': { name: '// Insight', color: '#00E5FF' },
                'digital-lab.html': { name: '// Digital Lab', color: '#10B981' },
                'designs.html': { name: '// Designs', color: '#D4AF37' },
                'automate.html': { name: '// Automate', color: '#FFBF00' },
                'audit.html': { name: '// Strategic Audit', color: '#00E5FF' }
            };
            
            const current = branding[page] || branding['index.html'];
            logoArm.style.color = current.color;
            divisionTag.innerText = current.name;
        }


        // Auto-set active nav link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });

        // Mobile Menu Toggle Logic
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenu && navMenu) {
            mobileMenu.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when a link is clicked
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

    } catch (error) {
        console.warn("Global components could not be loaded via fetch (local environment?). Falling back to static placeholders.");
    }
}

/**
 * Data Rain Effect (ZiG & USD Volatility)
 */
function initDataRain(containerId = 'dataRainContainer', color = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const isLocal = containerId !== 'dataRainContainer';
    const symbols = ['ZiG', '$', 'USD', '₿', '€', '£'];
    const count = 50;

    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = 'data-drop';
        drop.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        drop.style.left = Math.random() * 100 + '%';
        drop.style.top = Math.random() * 100 + '%';
        
        // Custom animation
        drop.animate([
            { transform: `translateY(${isLocal ? '-20%' : '-10vh'})`, opacity: 0 },
            { transform: `translateY(${isLocal ? '120%' : '110vh'})`, opacity: color ? 0.3 : 0.15 }
        ], {
            duration: Math.random() * 5000 + 5000,
            iterations: Infinity,
            delay: Math.random() * 5000
        });

        container.appendChild(drop);
    }
}

/**
 * 3D Point Cloud Simulation (Hero Visual)
 */
function initPointCloud() {
    const canvas = document.getElementById('pointCloudCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    const points = [];
    const pointCount = 100;

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < pointCount; i++) {
        points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * width,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            vz: (Math.random() - 0.5) * 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#D32F2F';
        
        points.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            if (p.z < 0 || p.z > width) p.vz *= -1;

            const scale = 400 / (400 + p.z);
            const x2d = (p.x - width / 2) * scale + width / 2;
            const y2d = (p.y - height / 2) * scale + height / 2;
            
            ctx.globalAlpha = scale;
            ctx.beginPath();
            ctx.arc(x2d, y2d, 2 * scale, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * World-Class Hero Slider Logic
 * Features: Progress bar, parallax zoom, staggered text reveals, and high-fidelity transitions.
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.control-dot');
    const progress = document.getElementById('sliderProgress');
    let currentSlide = 0;
    let slideInterval;
    let progressInterval;
    let startTime;
    const duration = 6000; // 6 seconds per slide

    if (!slides.length) return;

    function goToSlide(index) {
        // Reset state
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        // Activate new slide
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Reset progress
        resetProgress();
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function resetProgress() {
        startTime = Date.now();
        if (progress) progress.style.width = '0%';
    }

    function updateProgress() {
        if (!progress) return;
        const elapsed = Date.now() - startTime;
        const percent = Math.min((elapsed / duration) * 100, 100);
        progress.style.width = `${percent}%`;
        
        if (percent >= 100) {
            nextSlide();
        }
        progressInterval = requestAnimationFrame(updateProgress);
    }

    function startAutoPlay() {
        resetProgress();
        progressInterval = requestAnimationFrame(updateProgress);
    }

    function stopAutoPlay() {
        cancelAnimationFrame(progressInterval);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            goToSlide(index);
            startAutoPlay();
        });
    });

    // Start the engine
    startAutoPlay();

    // Subtle Parallax on Mouse Move
    document.querySelector('.hero-slider').addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        const activeBg = slides[currentSlide].querySelector('.slide-bg');
        if (activeBg) {
            activeBg.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
        }
    });
}

/**
 * Command Bar Logic - "The Zivo Principle"
 * Redirects executives to solutions based on strategic keywords.
 */
function initCommandBar() {
    const input = document.getElementById('commandInput');
    if (!input) return;

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = input.value.toLowerCase();
            handleStrategicQuery(query);
            input.value = ''; // Clear after search
        }
    });
}

function handleStrategicQuery(query) {
    const keywords = {
        'growth': 'insight.html',
        'churn': 'insight.html',
        'strategy': 'insight.html',
        'data': 'insight.html',
        'intelligence': 'insight.html',
        'systems': 'digital-lab.html',
        'engine': 'digital-lab.html',
        'software': 'digital-lab.html',
        'web': 'digital-lab.html',
        'odoo': 'digital-lab.html',
        'creative': 'designs.html',
        'branding': 'designs.html',
        'design': 'designs.html',
        'future': 'automate.html',
        'ai': 'automate.html',
        'zivo': 'automate.html',
        'automate': 'automate.html',
        'audit': 'audit.html',
        'session': 'audit.html',
        'proof': 'case-studies.html',
        'cases': 'case-studies.html'
    };

    for (const key in keywords) {
        if (query.includes(key)) {
            window.location.href = keywords[key];
            return;
        }
    }

    // Default: scroll to top if no match
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Scroll Reveal Animations
 */
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/**
 * Impact Bar Counters - Animated Number Logic
 */
function initCounters() {
    const counters = document.querySelectorAll('.impact-number');
    const options = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                const hasCommas = counter.getAttribute('data-commas') === 'true';
                
                animateCounter(counter, target, suffix, hasCommas);
                observer.unobserve(counter);
            }
        });
    }, options);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target, suffix, hasCommas) {
    let start = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quadratic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = easeProgress * target;

        let displayValue = currentCount;
        
        if (target % 1 !== 0) {
            displayValue = currentCount.toFixed(2);
        } else {
            displayValue = Math.floor(currentCount);
        }

        if (hasCommas) {
            displayValue = displayValue.toLocaleString();
        }

        el.textContent = displayValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = (hasCommas ? target.toLocaleString() : target) + suffix;
        }
    }

    requestAnimationFrame(update);
}

/**
 * Handle navigation styling on scroll
 */
function initNavBehavior() {
    const header = document.querySelector('header');
    const btnReturn = document.getElementById('btnReturn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Return to Strategy Button
        if (window.scrollY > 500) {
            btnReturn.classList.add('visible');
        } else {
            btnReturn.classList.remove('visible');
        }
    });
}

/**
 * Animated Counter Engine
 */
function initCounters() {
    const counters = document.querySelectorAll('.number, .impact-number');
    const options = { threshold: 0.3, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseFloat(target.getAttribute('data-target'));
                const prefix = target.getAttribute('data-prefix') || '';
                const suffix = target.getAttribute('data-suffix') || '';
                const duration = 2500; // Unified professional duration

                animateValue(target, 0, endValue, duration, prefix, suffix);
                observer.unobserve(target);
            }
        });
    }, options);

    counters.forEach(counter => observer.observe(counter));
}

function animateValue(obj, start, end, duration, prefix = '', suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Use easeOutExpo for a premium feel
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        const current = easeProgress * (end - start) + start;
        
        // Format based on whether it's an integer or float
        let formatted;
        if (Number.isInteger(end)) {
            formatted = Math.floor(current).toLocaleString();
        } else {
            formatted = current.toFixed(2);
        }

        obj.innerHTML = prefix + formatted + suffix;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}


/**
 * Strategic Audit Form Logic
 */
function initAuditLogic() {
    const serviceSelect = document.getElementById('auditService');
    const analysisContent = document.getElementById('analysisContent');
    const statusText = document.querySelector('.analysis-status span');

    if (!serviceSelect || !analysisContent) return;

    const insights = {
        customer: {
            title: "Revenue Optimization Mode",
            desc: "We will deploy RFM clustering and CLV prediction models. Deployment focus: Detecting 'Silent Churn' 180 days in advance using Stacked Ensemble architectures.",
            moat: "Predictive Edge: 94% Accuracy"
        },
        decision: {
            title: "Executive Intelligence Mode",
            desc: "Deployment of stochastic scenario modeling. Focus: Normalizing boardroom KPIs against national currency volatility and inflation shocks.",
            moat: "Boardroom Readiness: Elite"
        },
        automation: {
            title: "Autonomous Scale Mode",
            desc: "Integration of LLM-driven agents and custom OCR pipelines. Focus: Automating repetitive procurement and sales workflows without increasing headcount.",
            moat: "Headcount Efficiency: 5x"
        },
        bi: {
            title: "Total Visibility Mode",
            desc: "Architecture of live, low-latency executive dashboards. Focus: Real-time unit-level profitability tracking across 12,000+ SKU environments.",
            moat: "Latency: < 500ms"
        },
        risk: {
            title: "Resilience Protocol",
            desc: "Simulation of FX currency shocks and supply chain fragility. Focus: Dynamic pricing models that adjust in real-time to ZiG/USD fluctuations.",
            moat: "Risk Mitigation: 100%"
        },
        supply: {
            title: "Logistics Logic Mode",
            desc: "Application of Pareto compression and route optimization. Focus: Reducing fuel and operational drag through mathematical load balancing.",
            moat: "Operational ROI: 35%+"
        },
        governance: {
            title: "Bulletproof Protocol",
            desc: "Establishment of SHA-256 data integrity and SI 155/2024 compliance frameworks. Focus: Ensuring audit-ready privacy standards.",
            moat: "Regulatory Rating: A+"
        },
        research: {
            title: "Experimental Mode",
            desc: "Access to ZCHPC supercomputing clusters for deep research. Focus: Custom hypothesis testing and proprietary market modeling.",
            moat: "Computing Power: HPC"
        }
    };

    serviceSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const data = insights[val];

        if (data) {
            statusText.textContent = "Logic Engine: Analyzing Deployment...";
            analysisContent.style.opacity = '0.5';
            
            setTimeout(() => {
                analysisContent.innerHTML = `
                    <h4>${data.title}</h4>
                    <p>${data.desc}</p>
                    <div class="moat-tag">${data.moat}</div>
                `;
                analysisContent.style.opacity = '1';
                statusText.textContent = "Logic Engine: Strategy Generated";
            }, 600);
        }
    });

    const form = document.getElementById('strategicAuditForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        statusText.textContent = "Logic Engine: Transmitting Strategy...";
        analysisContent.innerHTML = `
            <h4>Transmitting...</h4>
            <p>Your strategic parameters are being encrypted and routed to the Logic League Strategic Command.</p>
            <div class="moat-tag">Uplink: Active</div>
        `;

        const formData = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                analysisContent.innerHTML = `
                    <h4>Audit Transmitted</h4>
                    <p>Your boardroom briefing request has been successfully queued. A strategist will contact you shortly.</p>
                    <div class="moat-tag">Status: Queued</div>
                `;
                statusText.textContent = "Logic Engine: Transmission Complete";
            } else {
                throw new Error('Transmission Failure');
            }
        } catch (error) {
            statusText.textContent = "Logic Engine: Network Error";
            analysisContent.innerHTML = `
                <h4>Transmission Interrupted</h4>
                <p>An error occurred while routing your data. Please retry or contact us directly.</p>
                <div class="moat-tag">Status: Failed</div>
            `;
        }
    });
}

// Call in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initCounters();
    initAuditLogic();
});


