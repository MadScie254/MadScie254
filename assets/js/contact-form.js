// ==========================================
// CONTACT-FORM.JS - Form handling with EmailJS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) return;

  // Initialize EmailJS (replace with your keys)
  // emailjs.init('YOUR_PUBLIC_KEY');

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Get form data
    const formData = {
      from_name: this.querySelector('[name="name"]').value,
      from_email: this.querySelector('[name="email"]').value,
      subject: this.querySelector('[name="subject"]').value,
      message: this.querySelector('[name="message"]').value
    };

    // Validate
    if (!validateForm(formData)) {
      showNotification('Please fill in all fields correctly', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      Sending...
    `;

    try {
      // Send email using EmailJS (uncomment when configured)
      // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData);
      
      // Simulate success for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to send message. Please try again or email directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // Form validation
  function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!data.from_name || data.from_name.length < 2) return false;
    if (!emailRegex.test(data.from_email)) return false;
    if (!data.subject || data.subject.length < 3) return false;
    if (!data.message || data.message.length < 10) return false;
    
    return true;
  }

  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="${type === 'success' ? 
            'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 
            'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'}">
        </path>
      </svg>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Real-time validation
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value.trim() === '') {
        this.classList.add('error');
      } else {
        this.classList.remove('error');
      }
    });
  });
});
