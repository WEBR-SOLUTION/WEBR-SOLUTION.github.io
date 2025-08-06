// contact-form.js

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Find the form
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (!form) {
        console.error('Contact form not found. Check if id="contact-form" exists.');
        return;
    }

    if (!formMessage) {
        console.error('Form message element not found. Check if id="form-message" exists.');
        return;
    }

    // Use HTTPS for PythonAnywhere
    const apiUrl = 'https://webrsolution.pythonanywhere.com/api/submit';
    const apiKey = '068e4b57f9876e6c17c03a00da76ff74'; // Keep this safe

    // Show message function
    function showMessage(message, isError = false) {
        formMessage.textContent = message;
        formMessage.className = `mb-4 text-center text-sm font-medium p-2 rounded-md transition-all duration-300 ${
            isError 
                ? 'text-red-600 bg-red-100' 
                : 'text-green-600 bg-green-100'
        }`;
        formMessage.classList.remove('hidden');
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }

    // Email validation
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Attach submit handler
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // 🔴 CRITICAL: Prevent page refresh

        const formData = {
            full_name: document.getElementById('full_name').value.trim(),
            email: document.getElementById('email').value.trim(),
            mobile_number: document.getElementById('mobile_number').value.trim(),
            service_interest: document.getElementById('service_interest').value,
            message: document.getElementById('message').value.trim()
        };

        // Validation
        if (!formData.full_name) return showMessage('Please enter your full name', true);
        if (!formData.email || !isValidEmail(formData.email)) return showMessage('Please enter a valid email', true);
        if (!formData.mobile_number) return showMessage('Please enter your mobile number', true);
        if (!formData.service_interest) return showMessage('Please select a service', true);
        if (!formData.message) return showMessage('Please enter a message', true);

        // Disable button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(formData)
            });

            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            if (!response.ok) {
                let errorText = 'Submission failed';
                try {
                    const err = await response.json();
                    errorText = err.error || errorText;
                } catch (e) {
                    errorText = await response.text();
                    if (errorText.length > 100) errorText = 'Server error (check console)';
                }
                return showMessage(`Error: ${errorText}`, true);
            }

            const result = await response.json();
            showMessage('Message sent successfully!');
            form.reset();

        } catch (error) {
            console.error('Fetch error:', error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Handle network/CORS issues
            if (error.name === 'TypeError') {
                showMessage('Network error. Check console for CORS or mixed content.', true);
            } else {
                showMessage('An unexpected error occurred.', true);
            }
        }
    });

    console.log('Contact form script loaded successfully.');
});
