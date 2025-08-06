// contact-form.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    // ✅ Use HTTPS for PythonAnywhere (required for browser security)
    const apiUrl = 'https://webrsolution.pythonanywhere.com/api/submit';
    const apiKey = '068e4b57f9876e6c17c03a00da76ff74'; // Keep this safe in production

    // Function to display messages (success or error)
    function showMessage(message, isError = false) {
        formMessage.textContent = message;
        formMessage.className = `mb-4 text-center text-sm font-medium p-2 rounded-md transition-opacity duration-300 ${
            isError 
                ? 'text-red-600 bg-red-100' 
                : 'text-green-600 bg-green-100'
        }`;
        formMessage.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.classList.add('opacity-0');
            setTimeout(() => {
                formMessage.classList.add('hidden');
                formMessage.classList.remove('opacity-0');
            }, 300);
        }, 5000);
    }

    // Basic email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Form submission handler
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form values
        const formData = {
            full_name: document.getElementById('full_name').value.trim(),
            email: document.getElementById('email').value.trim(),
            mobile_number: document.getElementById('mobile_number').value.trim(),
            service_interest: document.getElementById('service_interest').value,
            message: document.getElementById('message').value.trim()
        };

        // Client-side validation
        if (!formData.full_name) {
            showMessage('Please enter your full name', true);
            return;
        }
        if (!formData.email || !isValidEmail(formData.email)) {
            showMessage('Please enter a valid email address', true);
            return;
        }
        if (!formData.mobile_number) {
            showMessage('Please enter your mobile number', true);
            return;
        }
        if (!formData.service_interest) {
            showMessage('Please select a service', true);
            return;
        }
        if (!formData.message) {
            showMessage('Please enter a message', true);
            return;
        }

        // Disable button to prevent duplicate submissions
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

            // Handle non-2xx responses
            if (!response.ok) {
                let errorMessage = 'Unknown error occurred';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (jsonError) {
                    // If response isn't JSON (e.g. 500 error page)
                    const textError = await response.text();
                    errorMessage = textError.includes('<') 
                        ? 'Server error (check console)' 
                        : textError.substring(0, 100);
                }
                console.warn('Server error:', errorMessage);
                showMessage(`Error: ${errorMessage}`, true);
                return;
            }

            // Success
            const result = await response.json();
            showMessage('Thank you! Your message has been sent successfully.');
            form.reset();

        } catch (error) {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Network-level errors (CORS, DNS, offline, etc.)
            console.error('Fetch error:', error);
            if (error.name === 'TypeError') {
                showMessage('Network error. Check your connection or try again later.', true);
            } else {
                showMessage('An unexpected error occurred. Please try again.', true);
            }
        }
    });
});
