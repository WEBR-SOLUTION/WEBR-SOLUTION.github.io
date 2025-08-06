document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const apiUrl = 'https://webrsolution.pythonanywhere.com/api/submit';
    const apiKey = '068e4b57f9876e6c17c03a00da76ff74';

    // Function to display messages
    function showMessage(message, isError = false) {
        formMessage.textContent = message;
        formMessage.className = `mb-4 text-center text-sm font-medium p-2 rounded-md ${isError ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`;
        formMessage.classList.remove('hidden');
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }

    // Basic email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

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

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage('Thank you! Your message has been sent successfully.');
                form.reset();
            } else {
                showMessage(result.error || 'Failed to send message. Please try again.', true);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('An error occurred. Please try again later.', true);
        }
    });
});
