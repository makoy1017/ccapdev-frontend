document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginContainer = document.querySelector('.login-container');
    const signupContainer = document.querySelector('.signup-container');
    const toggleLogin = document.getElementById('toggle-login');
    const toggleSignup = document.getElementById('toggle-signup');
    const signupErrorMessages = document.getElementById('signup-error-messages');
    const loginErrorMessages = document.getElementById('login-error-messages');

    toggleLogin.addEventListener('click', () => {
        loginContainer.classList.add('active');
        signupContainer.classList.remove('active');
        toggleLogin.classList.add('active');
        toggleSignup.classList.remove('active');
    });

    toggleSignup.addEventListener('click', () => {
        loginContainer.classList.remove('active');
        signupContainer.classList.add('active');
        toggleLogin.classList.remove('active');
        toggleSignup.classList.add('active');
    });

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const errors = [];

        const firstName = signupForm.elements['firstName'].value.trim();
        const lastName = signupForm.elements['lastName'].value.trim();
        const email = signupForm.elements['email'].value.trim();
        const phoneNumber = signupForm.elements['phoneNumber'].value.trim();
        const password = signupForm.elements['password'].value;
        const confirmPassword = signupForm.elements['confirmPassword'].value;
        const profilePicture = signupForm.elements['profilePicture'].files[0];

        if (!firstName) errors.push('First Name is required.');
        if (!lastName) errors.push('Last Name is required.');
        if (!email) errors.push('Email is required.');
        if (!phoneNumber) errors.push('Phone Number is required.');
        if (!password) errors.push('Password is required.');
        if (password !== confirmPassword) errors.push('Passwords do not match.');
        if (profilePicture && !['image/jpeg', 'image/png', 'image/gif'].includes(profilePicture.type)) {
            errors.push('Profile Picture must be a JPEG, PNG, or GIF file.');
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|edu\.ph)$/.test(email)) {
            errors.push('Invalid email format.');
        }
        if (!/^(\+63|0)\d{10}$/.test(phoneNumber)) errors.push('Invalid phone number format.');
        if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{12,36}$/.test(password)) {
            errors.push('Password must be 12-36 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        }

        if (errors.length > 0) {
            signupErrorMessages.innerHTML = errors.join('<br>');
        } else {
            signupErrorMessages.innerHTML = '';

            const formData = new FormData(signupForm);
            
            fetch('php/signup.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                if (data.includes("Email already exists")) {
                    signupErrorMessages.innerHTML = data;
                } else if (data.includes("Success")) {
                    alert('Account created successfully!');
                    window.location.href = "index.html";
                } else {
                    signupErrorMessages.innerHTML = "An unexpected error occurred.";
                }
            })
            .catch(error => {
                signupErrorMessages.innerHTML = "An error occurred: " + error.message;
            });
        }
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const formData = new FormData(loginForm);
    
        fetch('php/authenticate.php', { 
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.admin_checker == 1) {
                    window.location.href = "php/admin_home.php";
                } else if (data.room_manager == 1) {
                    window.location.href = "php/room_management.php";
                } else if (data.amenities_manager == 1) {
                    window.location.href = "php/amenities_management.php";
                } else {
                    window.location.href = "php/home.php";
                }
            } else {
                loginErrorMessages.innerHTML = data.message;
            }
        })
        .catch(error => {
            loginErrorMessages.innerHTML = "An error occurred: " + error.message;
        });
    });
});
