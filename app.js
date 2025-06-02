// Presentation App JavaScript
const ChartDataLabels = window.ChartDataLabels;

class PresentationApp {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.slides = document.querySelectorAll('.slide');
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupKeyboardNavigation();
        this.updateProgress();
        this.updateSlideCounter();
        this.initializeAnimations();
        this.createCharts();
    }

    setupNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        prevBtn.addEventListener('click', () => this.previousSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());

        this.updateNavigationButtons();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideIndex) {
        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[this.currentSlide].classList.add('prev');

        // Update current slide index
        this.currentSlide = slideIndex;

        // Add active class to new slide
        this.slides[this.currentSlide].classList.remove('prev');
        this.slides[this.currentSlide].classList.add('active');

        // Clean up prev class after animation
        setTimeout(() => {
            this.slides.forEach(slide => slide.classList.remove('prev'));
        }, 500);

        this.updateProgress();
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.triggerSlideAnimations();
        this.animateNumbers();
        this.updateGanttResponsiveness();
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        progressFill.style.width = `${progress}%`;
    }

    updateSlideCounter() {
        const counter = document.getElementById('slide-counter');
        counter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        prevBtn.disabled = this.currentSlide === 0;
        nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }

    initializeAnimations() {
        // Trigger animations for the first slide
        setTimeout(() => {
            this.triggerSlideAnimations();
            this.animateNumbers();
            this.updateGanttResponsiveness();
        }, 100);
    }

    triggerSlideAnimations() {
        const currentSlideElement = this.slides[this.currentSlide];
        const animatedElements = currentSlideElement.querySelectorAll('.animate-in');
        
        // Reset animations
        animatedElements.forEach(el => {
            el.classList.remove('visible');
        });

        // Trigger animations with delay
        setTimeout(() => {
            animatedElements.forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
    }

    animateNumbers() {
        const currentSlideElement = this.slides[this.currentSlide];
        const numberElements = currentSlideElement.querySelectorAll('[data-target]');
        
        numberElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            this.animateCounter(el, 0, target, 1500);
        });
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const range = end - start;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (range * easeOutQuart));
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = end;
            }
        };
        
        requestAnimationFrame(animate);
    }

    createCharts() {
        // Load ChartJS 
        this.loadChartJS().then(() => {
            // Initialize charts
            this.charts = {};
            this.createEnergyChart();
            this.createPolishChart();
            this.createAppleChart();
            this.createNetguruChart();
            this.createGenerationChart();
            this.createCDPRChart();
            this.createCDPRCampusChart();
        });
    }

    loadChartJS() {
        return new Promise((resolve) => {
            // Check if Chart is already loaded
            if (typeof Chart !== 'undefined') {
                resolve();
                return;
            }

            // Load Chart.js and ChartDataLabels plugin
            const chartScript = document.createElement('script');
            chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
            chartScript.onload = () => {
                const dataLabelsScript = document.createElement('script');
                dataLabelsScript.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.1.0/dist/chartjs-plugin-datalabels.min.js';
                dataLabelsScript.onload = () => {
                    window.ChartDataLabels = window.ChartDataLabels;
                    resolve();
                };
                document.head.appendChild(dataLabelsScript);
            };
            document.head.appendChild(chartScript);
        });
    }

    createEnergyChart() {
        const ctx = document.getElementById('energyChart');
        if (!ctx) return;

        this.charts.energy = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2020', '2022', '2024', '2026', '2028', '2030'],
                datasets: [{
                    label: 'Zużycie energii przez IT (%)',
                    data: [7, 8.5, 10, 11.5, 12.5, 13],
                    borderColor: '#2563eb',
                    backgroundColor: '#2563eb20',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        color: '#2563eb',
                        font: {
                            weight: 'bold'
                        },
                        formatter: function(value) {
                            return value + '%';
                        },
                        align: 'top',
                        anchor: 'end'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 15,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    createPolishChart() {
        const ctx = document.getElementById('polishChart');
        if (!ctx) return;

        this.charts.polish = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Strategiczne podejście', 'Podstawowe działania', 'Brak działań'],
                datasets: [{
                    data: [11, 44, 45],
                    backgroundColor: ['#16a34a', '#fbbf24', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            font: {
                                size: 11
                            }
                        }
                    },
                    datalabels: {
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 14
                        },
                        formatter: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    createAppleChart() {
        const ctx = document.getElementById('appleChart');
        if (!ctx) return;

        this.charts.apple = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Redukcja emisji CO₂', 'Cel do 2030 roku', 'Materiały z recyklingu', 'Energia odnawialna', 'Efektywność energetyczna'],
                datasets: [{
                    label: 'Apple - postęp (%)',
                    data: [60, 75, 100, 100, 70],
                    backgroundColor: [
                        'rgba(22, 163, 74, 0.6)',
                        'rgba(22, 163, 74, 0.4)',
                        'rgba(22, 163, 74, 0.8)',
                        'rgba(22, 163, 74, 1.0)',
                        'rgba(22, 163, 74, 0.7)'
                    ],
                    borderColor: '#16a34a',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '%';
                            }
                        }
                    },
                    datalabels: {
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 14
                        },
                        formatter: function(value) {
                            return value + '%';
                        },
                        anchor: 'center',
                        align: 'center'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    createNetguruChart() {
        const ctx = document.getElementById('netguruChart');
        if (!ctx) return;

        this.charts.netguru = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Netguru', 'Mediana branży'],
                datasets: [{
                    label: 'B Impact Score',
                    data: [89.4, 50.9],
                    backgroundColor: [
                        'rgba(22, 163, 74, 0.8)',
                        'rgba(156, 163, 175, 0.5)'
                    ],
                    borderColor: [
                        '#16a34a',
                        '#9ca3af'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 12
                        },
                        formatter: function(value) {
                            return value;
                        },
                        anchor: 'center',
                        align: 'center'
                    },
                    title: {
                        display: true,
                        text: 'B Impact Score (min. 80 punktów)',
                        font: {
                            size: 11
                        },
                        color: '#16a34a',
                        padding: {
                            bottom: 10
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            font: {
                                size: 10
                            },
                            callback: function(value) {
                                return value;
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 10
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    createGenerationChart() {
        const ctx = document.getElementById('generationChart');
        if (!ctx) return;

        this.charts.generation = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Gen Z\n(86%)', 'Millennials\n(89%)', 'Klimat <30 lat\n(76%)'],
                datasets: [{
                    label: 'Preferencje proekologiczne',
                    data: [86, 89, 76],
                    backgroundColor: ['#ea580c', '#ea580c80', '#ea580c60'],
                    borderColor: '#ea580c',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 14
                        },
                        formatter: function(value) {
                            return value + '%';
                        },
                        anchor: 'center',
                        align: 'center'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    createCDPRChart() {
        // ... existing code ...
    }

    // Chart animation on slide enter
    animateCharts() {
        const currentSlideElement = this.slides[this.currentSlide];
        const chartCanvases = currentSlideElement.querySelectorAll('canvas');
        
        chartCanvases.forEach(canvas => {
            const chartId = canvas.id;
            if (this.charts[chartId.replace('Chart', '')]) {
                const chart = this.charts[chartId.replace('Chart', '')];
                chart.update();
            }
        });
    }

    // Destroy charts when navigating away
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    updateGanttResponsiveness() {
        // Adjust Gantt chart for smaller screens if present on current slide
        const ganttContainer = document.querySelector('.gantt-chart-container');
        if (ganttContainer) {
            this.adjustGanttScale();
            // Bind adjustGanttScale to this class instance to ensure proper context
            window.addEventListener('resize', this.adjustGanttScale.bind(this));
        }
    }
    
    adjustGanttScale() {
        const ganttBars = document.querySelectorAll('.gantt-bar');
        const isMobile = window.innerWidth <= 768;
        
        // Adjust bar position/spacing for mobile view
        ganttBars.forEach(bar => {
            if (isMobile) {
                // Apply additional mobile-specific styles if needed
                bar.classList.add('mobile-view');
            } else {
                bar.classList.remove('mobile-view');
            }
        });
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PresentationApp();
    
    // Add some interactivity
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('slide') && !e.target.closest('.navigation')) {
            app.nextSlide();
        }
    });

    // Add hover effects for chart containers
    document.querySelectorAll('.chart-container').forEach(container => {
        container.addEventListener('mouseenter', () => {
            container.style.transform = 'scale(1.02)';
            container.style.transition = 'transform 0.2s ease';
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.transform = 'scale(1)';
        });
    });

    // Add pulse animation to presenter badges
    document.querySelectorAll('.presenter-badge').forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.animation = 'pulse 1s infinite';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.animation = 'none';
        });
    });

    // Add CSS for pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .chart-container:hover {
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .metric-card:hover,
        .trend-card:hover,
        .benefit-category:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .presenter-card:hover .presenter-color {
            transform: scale(1.2);
            transition: transform 0.2s ease;
        }
        
        .recommendation-card:hover {
            transform: translateX(5px);
            transition: transform 0.2s ease;
        }
        
        .timeline-item:hover {
            background: var(--color-primary);
            color: white;
            transition: all 0.2s ease;
        }
        
        .timeline-item:hover .timeline-year {
            color: white;
        }
    `;
    document.head.appendChild(style);

    // Add loading animation
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--color-background);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Ładowanie prezentacji...';
    loadingText.style.cssText = `
        font-size: 1.2rem;
        color: var(--color-text);
        font-weight: 500;
    `;
    
    loadingOverlay.appendChild(loadingText);
    document.body.appendChild(loadingOverlay);

    // Remove loading overlay after a short delay
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loadingOverlay);
        }, 500);
    }, 1000);

    // Add presentation controls info
    const controlsInfo = document.createElement('div');
    controlsInfo.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: var(--color-surface);
        padding: 10px 15px;
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-sm);
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        z-index: 1000;
        opacity: 0.8;
    `;
    controlsInfo.innerHTML = `
        <strong>Sterowanie:</strong><br>
        ← → Strzałki lub kliknięcie<br>
        Nawigacja: prawy dolny róg
    `;
    document.body.appendChild(controlsInfo);

    // Hide controls info after 5 seconds
    setTimeout(() => {
        controlsInfo.style.opacity = '0';
        controlsInfo.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (controlsInfo.parentNode) {
                document.body.removeChild(controlsInfo);
            }
        }, 500);
    }, 5000);
});