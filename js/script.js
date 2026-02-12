/* =========================================
   Global Configuration & Variables
   ========================================= */
const _0x4f2a = "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J5TURqT3c0RzA4ZkFBZm9GWU1UdmhvSElSMEJ1S053d0xMaXVQaVJUV2w5WFdDVHJZUHlVLVkyaTVwQnhqMlZDMkVnUS9leGVj";
const API_URL = atob(_0x4f2a);

/* =========================================
   Main Initialization (DOMContentLoaded)
   ========================================= */
document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Footer & Body Padding Adjustment
    adjustBodyPadding();
    window.addEventListener('resize', adjustBodyPadding);

    // 2. Animate On Scroll (AOS)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            offset: 80,
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true
        });
    }

    // 3. Header Scroll Behavior
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        if (!header) return;
        
        if (window.scrollY > 50) {
            header.classList.add('header--fixed', 'is-fixed');
        } else {
            header.classList.remove('header--fixed', 'is-fixed');
        }
    });

    // 4. Accordion Logic (Services)
    const accordionItems = document.querySelectorAll('.service-item');
    accordionItems.forEach(item => {
        item.addEventListener('click', () => {
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // 5. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileCanvas = document.querySelector('.mobile-canvas');
    if (menuToggle && mobileCanvas) {
        menuToggle.addEventListener('click', function () {
            mobileCanvas.classList.toggle('mobile-canvas--opened');
            this.classList.toggle('menu-toggle--opened');
        });
    }

    // 6. Form Validation & UI (Contact Form)
    initContactForm();

    // 7. Video Hover Logic (Delegation for all swipers)
    initVideoHoverLogic();

    // 8. Reviews Slider Initialization
    initReviewsSlider();

    // 9. Load Projects from Google Sheets (Async)
    loadProjects();
});

/* =========================================
   Helper Functions
   ========================================= */

// --- Body Padding for Fixed Footer ---
function adjustBodyPadding() {
    const footer = document.querySelector('.footer');
    const webpage = document.querySelector('.webpage'); // або body
    if (footer && webpage) {
        const footerHeight = footer.offsetHeight;
        webpage.style.paddingBottom = `${footerHeight}px`;
    }
}

// --- Form Logic ---
function initContactForm() {
    // Floating labels
    const fields = document.querySelectorAll('.discuss-project__field.field');
    fields.forEach(label => {
        const input = label.querySelector('input, textarea');
        if (!input) return;
        
        const sync = () => {
            if (input.value && input.value.trim() !== '') label.classList.add('field--filled');
            else label.classList.remove('field--filled');
        };
        
        input.addEventListener('input', sync);
        input.addEventListener('blur', sync);
        sync();
    });

    // Submit & Validation
    const form = document.querySelector('.discuss-project__wrapper form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = form.querySelector('input[name="name"]');
        const email = form.querySelector('input[name="email"]');
        const message = form.querySelector('textarea[name="message"]');
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let valid = true;

        const checks = [
            { el: name, ok: name && name.value.trim() !== '', msg: 'Please enter your name.' },
            { el: email, ok: email && emailRe.test(email.value.trim()), msg: 'Please enter a valid email.' },
            { el: message, ok: message && message.value.trim() !== '', msg: 'Please enter a message.' }
        ];

        checks.forEach(c => {
            const label = c.el ? c.el.closest('.field') : null;
            if (!label) return;
            label.classList.remove('error', 'success');
            const prev = label.querySelector('.field__error');
            if (prev) prev.remove();
            
            if (!c.ok) {
                valid = false;
                label.classList.add('error');
                const err = document.createElement('div');
                err.className = 'field__error';
                err.textContent = c.msg;
                label.appendChild(err);
            } else {
                label.classList.add('success');
            }
        });

        const btn = form.querySelector('.discuss-project__send');
        if (!valid) {
            if (btn) btn.disabled = false;
            return;
        }

        // Simulate sending
        if (btn) {
            btn.disabled = true;
            const textNode = btn.querySelector('.btn__text');
            const originalText = textNode ? textNode.textContent : '';
            
            if (textNode) textNode.textContent = 'Sending...';
            
            setTimeout(() => {
                if (textNode) textNode.textContent = 'Sent';
                btn.classList.add('btn--success');
                const wrapper = document.querySelector('.discuss-project__wrapper');
                if (wrapper) wrapper.classList.add('submitted');
                
                setTimeout(() => {
                    if (textNode) textNode.textContent = originalText;
                    btn.disabled = false;
                    btn.classList.remove('btn--success');
                    
                    // Clear fields
                    fields.forEach(label => {
                        const input = label.querySelector('input, textarea');
                        if (input) input.value = '';
                        label.classList.remove('field--filled', 'success');
                        const prev = label.querySelector('.field__error');
                        if (prev) prev.remove();
                    });
                }, 1600);
            }, 900);
        }
    });
}

// --- Video Hover Logic (Universal) ---
function initVideoHoverLogic() {
    // Використовуємо делегування подій на document, щоб працювало і для динамічно завантажених слайдів
    document.addEventListener('mouseover', async function (e) {
        // Шукаємо найближчу картку, але перевіряємо, чи ми всередині слайдера
        const card = e.target.closest('.carousel-card');
        if (!card) return;

        const video = card.querySelector('video');
        if (video) {
            try {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        if (error.name !== 'AbortError') {
                            console.error("Video play error:", error);
                        }
                    });
                }
            } catch (err) {
                // Ignore older browser errors
            }
        }
    }, true); // true = capture phase

    document.addEventListener('mouseout', function (e) {
        const card = e.target.closest('.carousel-card');
        if (!card) return;

        const video = card.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
            video.load(); // Повертає постер
        }
    }, true);
}

// --- Reviews Slider ---
function initReviewsSlider() {
    if (!document.querySelector('.reviews-slider')) return;
    
    new Swiper('.reviews-slider', {
        loop: true,
        speed: 800,
        autoHeight: true,
        spaceBetween: 40,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        navigation: {
            nextEl: '.reviews-btn--next',
            prevEl: '.reviews-btn--prev',
        },
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
    });
}

// --- Load Projects (API) ---
async function loadProjects() {
    const wrapper = document.getElementById('swiper-wrapper-fixed');
    if (!wrapper) return;

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            mode: 'cors',
            redirect: 'follow'
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const projects = await response.json();
        
        // Очищаємо та формуємо HTML одним шматком для продуктивності
        let slidesHTML = '';

        projects.forEach((project) => {
            const videoSrc = project.videourl || '';
            const poster = project.posterurl || '';
            const title = project.title || '';
            const tag = project.tag || project.domain || '';
            const date = project.date || '';

            slidesHTML += `
              <div class="carousel__item carousel-card swiper-slide">
                <video class="carousel-card__media" loop muted playsinline poster="${poster}" preload="metadata">
                  <source src="${videoSrc}" type="video/mp4">
                </video>
                <div class="carousel-card__overlay"></div>
                <div class="carousel-card__bottom">
                  <div class="carousel-card__info">
                    <span class="carousel-card__category">${tag}</span>
                    <h3 class="carousel-card__title">${title}</h3>
                  </div>
                  <div class="carousel-card__meta">
                    <span class="carousel-card__year">${date}</span>
                    <span class="carousel-card__icon">
                      <svg width="29" height="29"><use xlink:href="#link-arrow"></use></svg>
                    </span>
                  </div>
                </div>
              </div>`;
        });

        wrapper.innerHTML = slidesHTML;

        // Ініціалізуємо Swiper тільки після додавання слайдів
        initProjectSwiper();

    } catch (error) {
        console.error("Data load error:", error);
    }
}

function initProjectSwiper() {
    new Swiper('.__js_carousel', {
        loop: true,
        speed: 800,
        spaceBetween: 30,
        slidesPerView: 1,
        navigation: { nextEl: '.carousel__btn--next', prevEl: '.carousel__btn--prev' },
        breakpoints: { 
            768: { slidesPerView: 2, spaceBetween: 30 }, 
            1200: { slidesPerView: 2, spaceBetween: 60 } 
        }
    });
}