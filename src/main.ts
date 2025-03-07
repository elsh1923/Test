// Form validation
document.addEventListener('DOMContentLoaded', () => {
    // Product Modal Implementation
    class ProductModal {
        private modal: HTMLElement | null;
        private modalImage: HTMLImageElement | null;
        private modalDescription: HTMLElement | null;
        private closeBtn: HTMLElement | null;

        constructor() {
            this.modal = document.getElementById('imageModal');
            this.modalImage = document.getElementById('modalImage') as HTMLImageElement;
            this.modalDescription = document.getElementById('modalDescription');
            this.closeBtn = document.querySelector('.close-modal');
            this.initModal();
        }

        private initModal(): void {
            // Add click handlers for product rows
            document.querySelectorAll('.product-row').forEach(row => {
                row.addEventListener('click', () => {
                    const imageSrc = row.getAttribute('data-image');
                    const description = row.getAttribute('data-description');
                    this.openModal(imageSrc || '', description || '');
                });
            });

            // Close modal when clicking the close button
            this.closeBtn?.addEventListener('click', () => this.closeModal());

            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });

            // Close modal with escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                }
            });
        }

        private openModal(imageSrc: string, description: string): void {
            if (this.modal && this.modalImage && this.modalDescription) {
                this.modalImage.src = imageSrc;
                this.modalDescription.textContent = description;
                this.modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            }
        }

        private closeModal(): void {
            if (this.modal) {
                this.modal.classList.remove('show');
                document.body.style.overflow = ''; // Restore scrolling
            }
        }
    }

    // Initialize the product modal
    new ProductModal();

    // Scroll Indicator Implementation
    class ScrollIndicator {
        private scrollIndicator: HTMLElement | null;

        constructor() {
            this.scrollIndicator = document.querySelector('.scroll-indicator');
            this.initScrollIndicator();
        }

        private initScrollIndicator(): void {
            if (this.scrollIndicator) {
                this.scrollIndicator.addEventListener('click', () => {
                    const mainContent = document.querySelector('main');
                    if (mainContent) {
                        mainContent.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });

                // Hide scroll indicator when scrolling down
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 100) {
                        this.scrollIndicator?.classList.add('fade-out');
                    } else {
                        this.scrollIndicator?.classList.remove('fade-out');
                    }
                });
            }
        }
    }

    // Initialize scroll indicator
    new ScrollIndicator();

    // Image Slider Implementation
    class ImageSlider {
        private slideIndex: number = 1;
        private slides: HTMLElement[];
        private dots: HTMLElement[];
        private autoPlayInterval: number = 0;

        constructor() {
            this.slides = Array.from(document.querySelectorAll('.slide'));
            this.dots = Array.from(document.querySelectorAll('.dot'));
            this.showSlides(this.slideIndex);
            this.startAutoPlay();

            // Add global functions for slider controls
            (window as any).changeSlide = (n: number) => this.plusSlides(n);
            (window as any).currentSlide = (n: number) => this.currentSlide(n);
        }

        private plusSlides(n: number): void {
            this.showSlides(this.slideIndex += n);
        }

        private currentSlide(n: number): void {
            this.showSlides(this.slideIndex = n);
        }

        private showSlides(n: number): void {
            if (n > this.slides.length) this.slideIndex = 1;
            if (n < 1) this.slideIndex = this.slides.length;

            this.slides.forEach(slide => slide.style.display = "none");
            this.dots.forEach(dot => dot.classList.remove("active"));

            this.slides[this.slideIndex - 1].style.display = "block";
            this.dots[this.slideIndex - 1].classList.add("active");
        }

        private startAutoPlay(): void {
            this.autoPlayInterval = window.setInterval(() => {
                this.plusSlides(1);
            }, 5000); // Change slide every 5 seconds
        }
    }

    // Initialize the slider
    new ImageSlider();

    // Form elements
    const contactForm = document.querySelector('form');
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const messageInput = document.getElementById('message') as HTMLTextAreaElement;
    const charCount = document.getElementById('charCount');
    const copyBtn = document.getElementById('copyBtn');

    // Form validation
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            const isValid = nameInput.value.length >= 2;
            nameInput.classList.toggle('error', !isValid);
            nameInput.classList.toggle('success', isValid);
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailPattern.test(emailInput.value);
            emailInput.classList.toggle('error', !isValid);
            emailInput.classList.toggle('success', isValid);
        });
    }

    // Character counter for message
    if (messageInput && charCount) {
        messageInput.addEventListener('input', () => {
            const remaining = 500 - messageInput.value.length;
            charCount.textContent = `${remaining} characters remaining`;
            charCount.classList.toggle('warning', remaining < 100);
            charCount.classList.toggle('danger', remaining < 50);
        });
    }

    // Copy contact info
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const address = document.querySelector('address');
            if (address) {
                navigator.clipboard.writeText(address.textContent || '')
                    .then(() => {
                        alert('Contact information copied to clipboard!');
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
            }
        });
    }

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            const successMessage = document.querySelector('.form-message.success');
            if (successMessage) {
                successMessage.removeAttribute('hidden');
                setTimeout(() => {
                    successMessage.setAttribute('hidden', '');
                }, 3000);
            }
        });
    }

    // Store Hours Implementation
    class StoreHours {
        private statusElement: HTMLElement | null;
        private nextHoursElement: HTMLElement | null;
        private timelineItems: NodeListOf<Element>;
        private regularHours: { [key: string]: { open: string; close: string } };
        private holidays: { date: string; name: string; hours: string }[];

        constructor() {
            this.statusElement = document.getElementById('store-status');
            this.nextHoursElement = document.getElementById('next-hours');
            this.timelineItems = document.querySelectorAll('.timeline-item');
            
            // Regular store hours
            this.regularHours = {
                '1': { open: '14:00', close: '23:00' }, // Monday
                '2': { open: '14:00', close: '23:00' }, // Tuesday
                '3': { open: '14:00', close: '23:00' }, // Wednesday
                '4': { open: '14:00', close: '23:00' }, // Thursday
                '5': { open: '14:00', close: '23:00' }, // Friday
                '6': { open: '12:00', close: '23:00' }, // Saturday
                '0': { open: '', close: '' }  // Sunday (closed)
            };

            // Holiday schedule
            this.holidays = [
                { date: '2024-04-01', name: 'Easter Monday', hours: '15:00-22:00' },
                { date: '2024-05-01', name: 'Labor Day', hours: 'Closed' }
            ];

            this.initialize();
        }

        private initialize(): void {
            if (window.location.pathname.includes('hours.html')) {
                this.updateStoreStatus();
                this.highlightCurrentDay();
                setInterval(() => this.updateStoreStatus(), 60000); // Update every minute
            }
        }

        private updateStoreStatus(): void {
            if (!this.statusElement || !this.nextHoursElement) return;

            const now = new Date();
            const day = now.getDay().toString();
            const currentTime = now.getHours() * 100 + now.getMinutes();

            // Check if it's a holiday
            const holiday = this.isHoliday(now);
            if (holiday) {
                if (holiday.hours === 'Closed') {
                    this.setStatus('Closed', 'Holiday: ' + holiday.name);
                    return;
                }
                const [openTime, closeTime] = holiday.hours.split('-');
                this.checkAndSetStatus(openTime, closeTime, holiday.name);
                return;
            }

            // Regular hours
            const hours = this.regularHours[day];
            if (!hours.open) {
                this.setStatus('Closed', 'We are closed on Sundays');
                return;
            }

            this.checkAndSetStatus(hours.open, hours.close);
        }

        private isHoliday(date: Date): { name: string; hours: string } | null {
            const dateString = date.toISOString().split('T')[0];
            const holiday = this.holidays.find(h => h.date === dateString);
            return holiday || null;
        }

        private checkAndSetStatus(openTime: string, closeTime: string, specialNote?: string): void {
            const now = new Date();
            const currentTime = now.getHours() * 100 + now.getMinutes();
            const [openHour, openMin] = openTime.split(':').map(Number);
            const [closeHour, closeMin] = closeTime.split(':').map(Number);
            const openTimeNum = openHour * 100 + openMin;
            const closeTimeNum = closeHour * 100 + closeMin;

            if (currentTime >= openTimeNum && currentTime < closeTimeNum) {
                this.setStatus('Open', specialNote ? `${specialNote}: Open until ${closeTime}` : `Open until ${closeTime}`);
            } else {
                const nextOpenTime = this.getNextOpenTime(now);
                this.setStatus('Closed', `Opens ${nextOpenTime}`);
            }
        }

        private setStatus(status: string, message: string): void {
            if (!this.statusElement || !this.nextHoursElement) return;

            this.statusElement.textContent = status;
            this.statusElement.className = 'status-indicator status-' + status.toLowerCase();
            this.nextHoursElement.textContent = message;
        }

        private getNextOpenTime(now: Date): string {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowDay = tomorrow.getDay().toString();

            // Check if tomorrow is a holiday
            const holiday = this.isHoliday(tomorrow);
            if (holiday) {
                if (holiday.hours === 'Closed') {
                    return 'after the holiday';
                }
                return `tomorrow at ${holiday.hours.split('-')[0]}`;
            }

            // Regular schedule
            const hours = this.regularHours[tomorrowDay];
            if (!hours.open) {
                return 'on Monday at 14:00';
            }
            return `tomorrow at ${hours.open}`;
        }

        private highlightCurrentDay(): void {
            const currentDay = new Date().getDay().toString();
            this.timelineItems.forEach(item => {
                const dayAttribute = item.getAttribute('data-day');
                if (dayAttribute === currentDay) {
                    item.classList.add('current-day');
                }
            });
        }
    }

    // Initialize store hours functionality
    new StoreHours();

    // Contact Form Handler
    class ContactForm {
        private form: HTMLFormElement;
        private submitButton: HTMLButtonElement;
        private notification: HTMLElement | null = null;
        private inputs: { [key: string]: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement };
        private validationTimeouts: { [key: string]: number } = {};

        constructor() {
            const formElement = document.getElementById('contactForm');
            if (!formElement) throw new Error('Contact form not found');
            
            this.form = formElement as HTMLFormElement;
            const submitBtn = this.form.querySelector('.submit-btn');
            if (!submitBtn) throw new Error('Submit button not found');
            
            this.submitButton = submitBtn as HTMLButtonElement;
            this.notification = document.getElementById('notification');
            this.inputs = {
                name: this.form.querySelector('#name') as HTMLInputElement,
                email: this.form.querySelector('#email') as HTMLInputElement,
                phone: this.form.querySelector('#phone') as HTMLInputElement,
                subject: this.form.querySelector('#subject') as HTMLSelectElement,
                message: this.form.querySelector('#message') as HTMLTextAreaElement,
                contactTime: this.form.querySelector('#contactTime') as HTMLSelectElement
            };

            this.initializeValidation();
            this.initializeFormSubmission();
        }

        private initializeValidation(): void {
            // Name validation
            this.inputs.name?.addEventListener('input', () => {
                this.debounceValidation('name', () => {
                    const isValid = this.inputs.name.value.length >= 2;
                    this.updateValidationUI(
                        'name',
                        isValid,
                        isValid ? 'Looks good!' : 'Name must be at least 2 characters'
                    );
                });
            });

            // Email validation
            this.inputs.email?.addEventListener('input', () => {
                this.debounceValidation('email', () => {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const isValid = emailPattern.test(this.inputs.email.value);
                    this.updateValidationUI(
                        'email',
                        isValid,
                        isValid ? 'Valid email!' : 'Please enter a valid email address'
                    );
                });
            });

            // Phone validation (optional)
            this.inputs.phone?.addEventListener('input', () => {
                this.debounceValidation('phone', () => {
                    const phonePattern = /^\+?[\d\s-]{10,}$/;
                    const isValid = this.inputs.phone.value === '' || phonePattern.test(this.inputs.phone.value);
                    this.updateValidationUI(
                        'phone',
                        isValid,
                        isValid ? 'Valid phone number!' : 'Please enter a valid phone number'
                    );
                });
            });

            // Message validation
            this.inputs.message?.addEventListener('input', () => {
                this.debounceValidation('message', () => {
                    const isValid = this.inputs.message.value.length > 0;
                    this.updateValidationUI(
                        'message',
                        isValid,
                        isValid ? 'Message looks good!' : 'Please enter a message'
                    );
                    this.updateCharacterCount();
                });
            });
        }

        private debounceValidation(field: string, callback: () => void): void {
            if (this.validationTimeouts[field]) {
                window.clearTimeout(this.validationTimeouts[field]);
            }
            this.validationTimeouts[field] = window.setTimeout(callback, 500);
        }

        private updateValidationUI(field: string, isValid: boolean, message: string): void {
            const input = this.inputs[field];
            const feedback = input.parentElement?.querySelector('.validation-feedback');
            
            if (feedback) {
                feedback.textContent = message;
                feedback.className = `validation-feedback ${isValid ? 'valid' : 'invalid'}`;
            }
            
            input.classList.toggle('valid', isValid);
            input.classList.toggle('invalid', !isValid);
        }

        private updateCharacterCount(): void {
            const maxLength = 500;
            const remaining = maxLength - (this.inputs.message?.value.length || 0);
            const counter = this.form.querySelector('.char-counter');
            
            if (counter) {
                counter.textContent = `${remaining} characters remaining`;
                counter.className = `char-counter ${
                    remaining < 50 ? 'danger' : remaining < 100 ? 'warning' : ''
                }`;
            }
        }

        private showNotification(message: string, type: 'success' | 'error'): void {
            if (!this.notification) return;

            const icon = this.notification.querySelector('.notification-icon');
            const messageElement = this.notification.querySelector('.notification-message');
            
            if (icon && messageElement) {
                icon.className = `notification-icon fas ${
                    type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'
                }`;
                messageElement.textContent = message;
            }

            this.notification.style.display = 'flex';
            this.notification.style.backgroundColor = 
                type === 'success' ? 'rgba(81, 207, 102, 0.2)' : 'rgba(255, 107, 107, 0.2)';

            setTimeout(() => {
                if (this.notification) {
                    this.notification.style.display = 'none';
                }
            }, 5000);
        }

        private initializeFormSubmission(): void {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Show loading state
                const btnText = this.submitButton.querySelector('.btn-text') as HTMLElement;
                const btnLoader = this.submitButton.querySelector('.btn-loader') as HTMLElement;
                if (btnText) btnText.style.opacity = '0';
                if (btnLoader) btnLoader.style.display = 'block';
                this.submitButton.disabled = true;

                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    this.showNotification('Message sent successfully!', 'success');
                    this.form.reset();
                } catch (error) {
                    this.showNotification('Failed to send message. Please try again.', 'error');
                } finally {
                    // Reset button state
                    if (btnText) btnText.style.opacity = '1';
                    if (btnLoader) btnLoader.style.display = 'none';
                    this.submitButton.disabled = false;
                }
            });

            // Handle notification close button
            const closeBtn = this.notification?.querySelector('.notification-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    if (this.notification) {
                        this.notification.style.display = 'none';
                    }
                });
            }
        }
    }

    // Initialize contact form if on contact page
    if (document.getElementById('contactForm')) {
        new ContactForm();
    }

    // Signup Form Validation
    interface ValidationResult {
        isValid: boolean;
        message: string;
    }

    interface PasswordValidation {
        hasUpperCase: boolean;
        hasLowerCase: boolean;
        hasNumbers: boolean;
        hasSpecialChar: boolean;
        isLongEnough: boolean;
    }

    class SignupFormValidator {
        private form: HTMLFormElement;
        private password: HTMLInputElement;
        private confirmPassword: HTMLInputElement;
        private submitButton: HTMLButtonElement;
        private validationMessages: { [key: string]: HTMLElement };
        private passwordStrengthIndicator: HTMLElement;

        constructor() {
            const formElement = document.getElementById('signupForm');
            if (!formElement) throw new Error('Signup form not found');

            this.form = formElement as HTMLFormElement;
            
            const passwordInput = this.form.querySelector('#password');
            const confirmInput = this.form.querySelector('#confirmPassword');
            const submitBtn = this.form.querySelector('button[type="submit"]');
            
            if (!passwordInput || !confirmInput || !submitBtn) {
                throw new Error('Required form elements not found');
            }

            this.password = passwordInput as HTMLInputElement;
            this.confirmPassword = confirmInput as HTMLInputElement;
            this.submitButton = submitBtn as HTMLButtonElement;
            
            this.validationMessages = {
                password: document.createElement('div'),
                confirm: document.createElement('div')
            };

            this.passwordStrengthIndicator = document.createElement('div');
            this.initializeValidation();
        }

        private initializeValidation(): void {
            // Add validation message elements
            this.validationMessages.password.className = 'validation-message';
            this.validationMessages.confirm.className = 'validation-message';
            this.passwordStrengthIndicator.className = 'password-strength';

            this.password.parentElement?.appendChild(this.validationMessages.password);
            this.confirmPassword.parentElement?.appendChild(this.validationMessages.confirm);
            this.password.parentElement?.appendChild(this.passwordStrengthIndicator);

            // Add event listeners
            this.password.addEventListener('input', () => this.validatePassword());
            this.confirmPassword.addEventListener('input', () => this.validateConfirmPassword());
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        private validatePassword(): ValidationResult {
            const value = this.password.value;
            const validation = this.checkPasswordStrength(value);
            
            if (value.length === 0) {
                return { isValid: false, message: 'Password is required' };
            }

            const strengthChecks = Object.values(validation).filter(Boolean).length;
            const strengthPercentage = (strengthChecks / 5) * 100;
            
            this.updatePasswordStrengthIndicator(strengthPercentage);

            if (!validation.isLongEnough) {
                return { isValid: false, message: 'Password must be at least 8 characters' };
            }

            if (strengthChecks < 3) {
                return { 
                    isValid: false, 
                    message: 'Password must contain at least 3: uppercase, lowercase, number, special character'
                };
            }

            return { isValid: true, message: 'Password is strong' };
        }

        private validateConfirmPassword(): ValidationResult {
            const value = this.confirmPassword.value;
            
            if (value.length === 0) {
                return { isValid: false, message: 'Please confirm your password' };
            }

            if (value !== this.password.value) {
                return { isValid: false, message: 'Passwords do not match' };
            }

            return { isValid: true, message: 'Passwords match' };
        }

        private checkPasswordStrength(password: string): PasswordValidation {
            return {
                hasUpperCase: /[A-Z]/.test(password),
                hasLowerCase: /[a-z]/.test(password),
                hasNumbers: /\d/.test(password),
                hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
                isLongEnough: password.length >= 8
            };
        }

        private updatePasswordStrengthIndicator(percentage: number): void {
            this.passwordStrengthIndicator.style.width = `${percentage}%`;
            
            if (percentage <= 40) {
                this.passwordStrengthIndicator.style.backgroundColor = '#ff4444';
            } else if (percentage <= 70) {
                this.passwordStrengthIndicator.style.backgroundColor = '#ffa700';
            } else {
                this.passwordStrengthIndicator.style.backgroundColor = '#00C851';
            }
        }

        private handleSubmit(e: Event): void {
            e.preventDefault();

            const passwordValidation = this.validatePassword();
            const confirmValidation = this.validateConfirmPassword();

            this.updateValidationUI('password', passwordValidation);
            this.updateValidationUI('confirm', confirmValidation);

            if (passwordValidation.isValid && confirmValidation.isValid) {
                // Form is valid, you can submit it here
                console.log('Form is valid, submitting...');
                this.form.submit();
            }
        }

        private updateValidationUI(field: 'password' | 'confirm', validation: ValidationResult): void {
            const messageElement = this.validationMessages[field];
            const input = field === 'password' ? this.password : this.confirmPassword;

            messageElement.textContent = validation.message;
            messageElement.className = `validation-message ${validation.isValid ? 'success' : 'error'}`;
            input.classList.toggle('valid', validation.isValid);
            input.classList.toggle('invalid', !validation.isValid);
        }
    }

    // Initialize signup form validation if on signup page
    if (document.getElementById('signupForm')) {
        new SignupFormValidator();
    }
}); 