class LanguageSwitcher {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || this.detectBrowserLanguage() || 'en';
        this.translations = window.translations;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setLanguage(this.currentLanguage);
        this.updateActiveButton();
    }

    bindEvents() {
        const languageButtons = document.querySelectorAll('.lang-btn');
        
        languageButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const selectedLang = e.target.getAttribute('data-lang');
                this.switchLanguage(selectedLang);
            });
        });

        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'l') {
                this.toggleLanguage();
            }
        });
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        // Return supported language or default to English
        return this.translations[langCode] ? langCode : 'en';
    }

    getStoredLanguage() {
        try {
            return localStorage.getItem('preferred-language');
        } catch (error) {
            console.warn('LocalStorage not available:', error);
            return null;
        }
    }

    storeLanguage(language) {
        try {
            localStorage.setItem('preferred-language', language);
        } catch (error) {
            console.warn('Unable to store language preference:', error);
        }
    }

    switchLanguage(language) {
        if (!this.translations[language]) {
            console.error(`Language '${language}' not supported`);
            return;
        }

        this.currentLanguage = language;
        this.storeLanguage(language);
        this.setLanguage(language);
        this.updateActiveButton();
        
        // Add smooth transition effect
        this.animateLanguageSwitch();
    }

    toggleLanguage() {
        const nextLang = this.currentLanguage === 'en' ? 'fr' : 'en';
        this.switchLanguage(nextLang);
    }

    setLanguage(language) {
        const languageData = this.translations[language];
        
        if (!languageData) {
            console.error(`Translation data for '${language}' not found`);
            return;
        }

        // Update all translatable elements
        Object.keys(languageData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                // Preserve any HTML formatting while updating text
                if (element.innerHTML.includes('<')) {
                    // Element contains HTML, be more careful
                    element.innerHTML = languageData[key];
                } else {
                    element.textContent = languageData[key];
                }
            }
        });

        // Update document language attribute
        document.documentElement.setAttribute('lang', language);
        
        // Update page title
        document.title = languageData['page-title'] || document.title;
    }

    updateActiveButton() {
        const languageButtons = document.querySelectorAll('.lang-btn');
        
        languageButtons.forEach(button => {
            const buttonLang = button.getAttribute('data-lang');
            button.classList.toggle('active', buttonLang === this.currentLanguage);
        });
    }

    animateLanguageSwitch() {
        const mainContent = document.querySelector('.main-content');
        
        if (mainContent) {
            mainContent.classList.add('fade-out');
            
            setTimeout(() => {
                mainContent.classList.remove('fade-out');
                mainContent.classList.add('fade-in');
                
                setTimeout(() => {
                    mainContent.classList.remove('fade-in');
                }, 200);
            }, 100);
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return Object.keys(this.translations);
    }
}

// Utility functions for enhanced user experience
class PageEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.addScrollEffects();
        this.addLoadingStates();
        this.addKeyboardNavigation();
        this.addAccessibilityFeatures();
    }

    addScrollEffects() {
        const cards = document.querySelectorAll('.question-card, .tech-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    addLoadingStates() {
        // Simulate initial loading
        const mainContent = document.querySelector('.main-content');
        
        if (mainContent) {
            mainContent.classList.add('loading');
            
            setTimeout(() => {
                mainContent.classList.remove('loading');
            }, 500);
        }
    }

    addKeyboardNavigation() {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (element.classList.contains('lang-btn')) {
                        e.preventDefault();
                        element.click();
                    }
                }
            });
        });
    }

    addAccessibilityFeatures() {
        // Add ARIA labels and descriptions
        const languageButtons = document.querySelectorAll('.lang-btn');
        
        languageButtons.forEach(button => {
            const lang = button.getAttribute('data-lang');
            const langName = lang === 'en' ? 'English' : 'Français';
            
            button.setAttribute('aria-label', `Switch to ${langName}`);
            button.setAttribute('role', 'button');
        });

        // Add skip link for keyboard users
        this.addSkipLink();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 4px;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add id to main content for skip link
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.setAttribute('id', 'main-content');
        }
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.startTime = performance.now();
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            this.measureLoadTime();
        });
    }

    measureLoadTime() {
        const loadTime = performance.now() - this.startTime;
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);

        // Log performance metrics (in a real application, you might send this to analytics)
        if (performance.getEntriesByType) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                console.log('Performance metrics:', {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    totalTime: navigation.loadEventEnd - navigation.navigationStart
                });
            }
        }
    }
}

// Error handling
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript error:', event.error);
            this.showErrorMessage('An error occurred. Please refresh the page.');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showErrorMessage('An error occurred. Please try again.');
        });
    }

    showErrorMessage(message) {
        // Create a simple error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        errorDiv.textContent = message;

        document.body.appendChild(errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality
    const languageSwitcher = new LanguageSwitcher();
    const pageEnhancements = new PageEnhancements();
    const performanceMonitor = new PerformanceMonitor();
    const errorHandler = new ErrorHandler();

    // Make language switcher available globally for debugging
    window.languageSwitcher = languageSwitcher;

    console.log('Course Management Platform Reflection Page initialized successfully');
    console.log('Available commands:');
    console.log('- Alt+L: Toggle language');
    console.log('- languageSwitcher.switchLanguage("en"|"fr"): Change language programmatically');
    console.log('- languageSwitcher.getCurrentLanguage(): Get current language');
});

// Service Worker registration for offline capability (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // In a production environment, you would register a service worker here
        console.log('Service Worker support detected');
    });
}