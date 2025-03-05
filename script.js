// Slider functionality
let slideIndex = 1;
showSlides(slideIndex);

function changeSlide(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.querySelectorAll('.landing-slider .slide');
    const dots = document.querySelectorAll('.landing-slider .dot');
    
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    
    slides.forEach(slide => slide.style.opacity = '0');
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[slideIndex-1].style.opacity = '1';
    dots[slideIndex-1].classList.add('active');
}

// Auto slide
setInterval(() => {
    changeSlide(1);
}, 5000);

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    // Contact form handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            if (nameInput.value.trim() === '') {
                alert('Please enter your name');
                nameInput.focus();
                return;
            }

            if (emailInput.value.trim() === '') {
                alert('Please enter your email');
                emailInput.focus();
                return;
            }

            if (!isValidEmail(emailInput.value)) {
                alert('Please enter a valid email address');
                emailInput.focus();
                return;
            }

            if (messageInput.value.trim() === '') {
                alert('Please enter your message');
                messageInput.focus();
                return;
            }

            // If validation passes, show success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });

        // Real-time name validation
        nameInput.addEventListener('input', function() {
            const nameValidation = document.getElementById('nameValidation');
            
            if (this.value.length < 2) {
                this.className = 'error';
                nameValidation.textContent = 'Name must be at least 2 characters';
                nameValidation.className = 'validation-message error';
            } else {
                this.className = 'success';
                nameValidation.textContent = 'Looks good!';
                nameValidation.className = 'validation-message success';
            }
        });

        // Real-time email validation
        emailInput.addEventListener('input', function() {
            const emailValidation = document.getElementById('emailValidation');
            
            if (!isValidEmail(this.value)) {
                this.className = 'error';
                emailValidation.textContent = 'Please enter a valid email address';
                emailValidation.className = 'validation-message error';
            } else {
                this.className = 'success';
                emailValidation.textContent = 'Valid email!';
                emailValidation.className = 'validation-message success';
            }
        });
    }

    // Email validation helper function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            aboutSection.scrollIntoView({ 
                behavior: 'smooth'
            });
        });
    }

    // Navigation bar scroll effects
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.nav-bar');
        const currentScroll = window.pageYOffset;

        // Only hide navbar when scrolling down significantly
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add background when scrolled
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Modified fade-in animation
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px' // Adjust this value if needed
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            // Don't hide elements initially
            if (!entry.target.classList.contains('fade-in-visible')) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
            }
            
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Only observe elements below the landing page
    document.querySelectorAll('#about, #menu, section:not(.landing-page)').forEach(section => {
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Get modal elements
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-modal');

    // Add click handlers to product rows
    document.querySelectorAll('.product-row').forEach(row => {
        row.addEventListener('click', function() {
            const imagePath = this.dataset.image;
            const description = this.dataset.description;
            if (imagePath) {
                modal.classList.add('show');
                modalImg.src = imagePath;
                document.getElementById('modalDescription').textContent = description;
            }
        });
    });

    // Close modal when clicking X
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });

    if (messageInput) {
        const maxLength = 500;
        const charCount = document.getElementById('charCount');
        
        messageInput.addEventListener('input', function() {
            const remaining = maxLength - this.value.length;
            charCount.textContent = `${remaining} characters remaining`;
            
            // Add color feedback
            if (remaining < 50) {
                charCount.className = 'char-counter danger';
            } else if (remaining < 100) {
                charCount.className = 'char-counter warning';
            } else {
                charCount.className = 'char-counter';
            }
        });
    }

    // Highlight current day in hours page
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const today = new Date().getDay(); // 0 is Sunday, 1-6 is Monday-Saturday
        
        console.log('Current day:', today); // Debug line
        
        timelineItems.forEach(item => {
            const dayNum = parseInt(item.dataset.day);
            console.log('Item day:', dayNum); // Debug line
            
            // Check if it's a weekday (Monday-Saturday) and matches current day
            if ((today >= 1 && today <= 6 && dayNum === 1) || 
                (today === 0 && dayNum === 0)) {
                console.log('Highlighting item:', item); // Debug line
                item.classList.add('current-day');
            }
        });
    }
});