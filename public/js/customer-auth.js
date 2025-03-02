document.addEventListener('DOMContentLoaded', () => {
    // Ensure the Supabase library is loaded
    if (typeof supabase === 'undefined') {
        console.error('Supabase library is not loaded. Please include it before this script.');
        return;
    }
    
    const { createClient } = supabase;
    const supabaseClient = createClient(
        'https://xiopytnqzutiixdgqxln.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpb3B5dG5xenV0aWl4ZGdxeGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MDU3NjYsImV4cCI6MjA1NjQ4MTc2Nn0.N5IfXuoTGa0cXBk9jviteOBOP6FclEPhwuze3Rj7FKs'
    );

    // Attach event listeners for form submissions
    document.getElementById('loginForm').addEventListener('submit', (event) => {
        handleLogin(event, supabaseClient);
    });

    document.getElementById('signupForm').addEventListener('submit', (event) => {
        handleSignup(event, supabaseClient);
    });

    // Initialize input validation on blur for all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
        });
    });
});

// Switch between login and signup forms
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginBtn = document.querySelector('[onclick="switchTab(\'login\')"]');
    const signupBtn = document.querySelector('[onclick="switchTab(\'signup\')"]');

    if (tab === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
    } else {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
        loginBtn.classList.remove('active');
        signupBtn.classList.add('active');
    }
}

// Handle login form submission using the Supabase client
async function handleLogin(event, supabaseClient) {
    event.preventDefault();

    if (!validateForm('loginForm')) {
        showNotification('Please fill in all fields correctly', 'error');
        return;
    }

    const loginBtn = event.target.querySelector('.login-button');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing In...';

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {
        const { data: customer, error } = await supabaseClient
            .from('customer')
            .select('*')
            .eq('customer_email', email)
            .eq('customer_password', password)
            .single();

        if (error || !customer) {
            throw new Error('Invalid email or password');
        }

        sessionStorage.setItem('token', 'supabase_dummy_token');
        localStorage.setItem('token', 'supabase_dummy_token');
        window.location.href = 'shop.html';
    } catch (error) {
        handleError(error);
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
    }
}

// Handle signup form submission using the Supabase client
async function handleSignup(event, supabaseClient) {
    event.preventDefault();

    if (!validateForm('signupForm')) {
        showNotification('Please fill in all fields correctly', 'error');
        return;
    }

    const signupBtn = event.target.querySelector('.login-button');
    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating Account...';

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const address = document.getElementById('signupAddress').value.trim();

    try {
        const { data, error } = await supabaseClient
            .from('customer')
            .insert({
                customer_full_name: name,
                customer_email: email,
                customer_password: password,
                customer_phone_number: phone,
                customer_address: address
            })
            .select()
            .maybeSingle();

        if (error) {
            throw error;
        }

        sessionStorage.setItem('token', 'supabase_dummy_token');
        localStorage.setItem('token', 'supabase_dummy_token');
        showNotification('Registration successful! Redirecting to shop...', 'success');
        setTimeout(() => {
            window.location.href = 'shop.html';
        }, 1500);
    } catch (error) {
        handleError(error);
    } finally {
        signupBtn.disabled = false;
        signupBtn.textContent = 'Create Account';
    }
}

// Validate form inputs
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }

        // Email validation
        if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
            input.classList.add('error');
        }

        // Phone validation
        if (input.type === 'tel' && !validatePhone(input.value)) {
            isValid = false;
            input.classList.add('error');
        }
    });

    return isValid;
}

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation function
function validatePhone(phone) {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
}
