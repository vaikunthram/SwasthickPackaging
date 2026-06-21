/**
 * Swasthick Packaging Products - Main JavaScript File
 * Handles all client-side interactions, animations, and form processing.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. Scroll Reveal Animations
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = (index % 4) * 80;
                    setTimeout(() => entry.target.classList.add('visible'), delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ==========================================
    // 1. Sticky Header and Scroll-Spy Active Links
    // ==========================================
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }

        let currentSection = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 160) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            const isHashLink = href.startsWith('#');
            const isActive = isHashLink && href === `#${currentSection}`;
            link.classList.toggle('active', isActive);
        });
    }, { passive: true });

    // ==========================================
    // 2. Mobile Navigation Drawer Menu
    // ==========================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');

    function closeMobileNav() {
        navToggle?.classList.remove('open');
        navMenu?.classList.remove('open');
        navOverlay?.classList.remove('active');
        document.body.classList.remove('nav-open');
        navToggle?.setAttribute('aria-expanded', 'false');
    }

    function openMobileNav() {
        navToggle?.classList.add('open');
        navMenu?.classList.add('open');
        navOverlay?.classList.add('active');
        document.body.classList.add('nav-open');
        navToggle?.setAttribute('aria-expanded', 'true');
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        navOverlay?.addEventListener('click', closeMobileNav);

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }

    // ==========================================
    // 3. Product Catalog Tab Filters
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const productCards = document.querySelectorAll('.product-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 3b. Product Category Split Card Triggers
    // ==========================================
    const filterTriggers = document.querySelectorAll('.filter-trigger');
    const catalogSection = document.getElementById('catalog-section');

    filterTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const filterValue = trigger.getAttribute('data-target-filter');
            
            // Find corresponding tab button
            const correspondingTab = document.querySelector(`.tab-btn[data-filter="${filterValue}"]`);
            if (correspondingTab) {
                correspondingTab.click();
            }

            // Scroll to catalog section
            if (catalogSection) {
                const headerOffset = 80;
                const elementPosition = catalogSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 3d. Improve mobile UX: close nav drawer on resize to desktop
    // ==========================================
    window.addEventListener('resize', () => {
        // If user rotates/resizes to desktop width, ensure drawer is closed
        if (window.innerWidth > 991) {
            document.body.classList.remove('nav-open');
            navToggle?.classList.remove('open');
            navMenu?.classList.remove('open');
            navOverlay?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
        }
    });




    // ==========================================
    // 4. Product Quote Trigger Linkage
    // ==========================================
    const productQuoteTriggers = document.querySelectorAll('.quote-trigger');
    const productSelect = document.getElementById('quote-product');
    const requirementsText = document.getElementById('quote-requirements');
    const quoteSizeInput = document.getElementById('quote-size');

    productQuoteTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const productName = trigger.getAttribute('data-product');
            if (productSelect && productName) {
                // Auto-select option in quote form dropdown
                productSelect.value = productName;
                
                // Pre-fill details text area
                requirementsText.value = `Hello, I'd like a wholesale price quote for "${productName}". Please supply bulk rate details.`;
                
                // Focus size input field
                if (quoteSizeInput) {
                    quoteSizeInput.focus();
                } else {
                    requirementsText.focus();
                }
                
                // Trigger dynamic quote insight updates
                updateQuantityDisplay();
            }
        });
    });

    // Handle "Free Sample" CTA link trigger
    const sampleTrigger = document.querySelector('.sample-btn-trigger');
    if (sampleTrigger && requirementsText) {
        sampleTrigger.addEventListener('click', () => {
            requirementsText.value = "Hello, I would like to request a Free Sample batch of your bags. My postal address is:";
            requirementsText.focus();
        });
    }



    // ==========================================
    // 6. FAQ Accordion Height Animation
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach((question, index) => {
        const faqItem = question.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const answerId = `faq-answer-${index + 1}`;

        answer.id = answerId;
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', answerId);

        question.addEventListener('click', () => {
            const isActive = faqItem.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const q = item.querySelector('.faq-question');
                const a = item.querySelector('.faq-answer');
                q?.setAttribute('aria-expanded', 'false');
                if (a) a.style.maxHeight = null;
            });

            if (!isActive) {
                faqItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ==========================================
    // 7. FAQ Live Search Filtering
    // ==========================================
    const faqSearch = document.getElementById('faq-search');
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqSearch) {
        const faqList = document.getElementById('faqs-list');
        let noResultsEl = faqList?.querySelector('.faq-no-results');

        if (faqList && !noResultsEl) {
            noResultsEl = document.createElement('p');
            noResultsEl.className = 'faq-no-results';
            noResultsEl.textContent = 'No matching questions found. Try a different keyword or contact us directly.';
            noResultsEl.hidden = true;
            faqList.appendChild(noResultsEl);
        }

        faqSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            faqItems.forEach(item => {
                const questionText = item.querySelector('.faq-question span').textContent.toLowerCase();
                const answerText = item.querySelector('.faq-answer-content').textContent.toLowerCase();
                const matches = questionText.includes(query) || answerText.includes(query);

                item.style.display = matches ? 'block' : 'none';
                if (matches) visibleCount++;
            });

            if (noResultsEl) {
                noResultsEl.hidden = visibleCount > 0 || !query;
            }
        });
    }

    // ==========================================
    // 8. Dynamic Quote Quantity Slider & Estimates
    // ==========================================
    const quantitySlider = document.getElementById('quote-quantity');
    const quantityValueDisplay = document.getElementById('quantity-val');

    function updateQuantityDisplay() {
        if (!quantitySlider || !quantityValueDisplay) return;
        const val = parseInt(quantitySlider.value);
        let formattedVal = val.toLocaleString();
        if (val >= 50000) formattedVal += '+';
        quantityValueDisplay.textContent = formattedVal;
    }

    if (quantitySlider) {
        quantitySlider.addEventListener('input', updateQuantityDisplay);
        updateQuantityDisplay();
    }

    // ==========================================
    // 9. Quick Quote Form Submission Logic
    // ==========================================
    const quoteForm = document.getElementById('quote-form');
    const successCard = document.getElementById('form-success');
    const successContactDetail = document.getElementById('success-contact-detail');
    const resetFormBtn = document.getElementById('btn-success-reset');

    if (quoteForm && successCard) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect Form Values for dynamic success summary
            const name = document.getElementById('quote-name').value;
            const email = document.getElementById('quote-email').value;
            const phone = document.getElementById('quote-phone').value;
            const product = document.getElementById('quote-product')?.value || '';
            const size = document.getElementById('quote-size')?.value || '';
            const quantity = document.getElementById('quote-quantity')?.value || '';
            const requirements = document.getElementById('quote-requirements')?.value || '';

            // Set contact detail text
            if (successContactDetail) {
                successContactDetail.textContent = `${email} (or phone: ${phone})`;
            }

            // Toggle success card
            successCard.classList.add('active');

            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: (typeof CONFIG !== 'undefined' && CONFIG.WEB3FORMS_ACCESS_KEY) || 'YOUR_ACCESS_KEY_HERE',
                    subject: `New Quote Request from ${name}`,
                    from_name: 'Swasthick Web Page',
                    name: name,
                    email: email,
                    phone: phone,
                    product: product,
                    size: size,
                    quantity: quantity,
                    requirements: requirements
                })
            })
            .then(response => response.json())
            .then(data => console.log('Web3Forms response:', data))
            .catch(error => console.error('Web3Forms error:', error));

            // 2. Open WhatsApp with pre-filled details (For real-time chat lead)
            const whatsappNumber = '919043034090';
            const text = [
                `Hello Swasthick Packaging, I want a wholesale quote.`,
                product ? `• Product: ${product}` : '',
                size ? `• Size: ${size}` : '',
                quantity ? `• Quantity: ${quantity}` : '',
                requirements ? `• Requirements: ${requirements}` : '',
                name ? `• Name: ${name}` : '',
                email ? `• Email: ${email}` : '',
                phone ? `• Phone: ${phone}` : ''
            ].filter(Boolean).join('\n');

            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
            
            // Redirect after a brief delay to let page scroll finish
            setTimeout(() => {
                window.open(waUrl, '_blank', 'noopener,noreferrer');
            }, 800);
        });
    }


    if (resetFormBtn && quoteForm && successCard) {
        resetFormBtn.addEventListener('click', () => {
            // Reset Form Fields
            quoteForm.reset();
            
            // Reset Slider Displays
            if (quantitySlider) {
                quantitySlider.value = 10000;
                updateQuantityDisplay();
            }

            // Hide Success Overlay Card
            successCard.classList.remove('active');
        });
    }
});
