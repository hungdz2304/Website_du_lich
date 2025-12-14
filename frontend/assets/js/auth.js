(() => {
const {
    apiRequest,
    setUserData,
    showToast
} = window.TourBooking || {};

function toggleFormLoading(form, isLoading) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = isLoading;
        submitBtn.innerHTML = isLoading 
            ? '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...' 
            : submitBtn.dataset.defaultText;
    }
}

// Toggle Password Visibility
function initPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Password Strength Checker
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!passwordInput || !strengthFill) return;
    
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = checkPasswordStrength(password);
        
        strengthFill.className = 'strength-fill';
        
        if (password.length === 0) {
            strengthFill.style.width = '0';
            strengthText.textContent = 'Độ mạnh mật khẩu';
        } else if (strength < 2) {
            strengthFill.classList.add('weak');
            strengthText.textContent = 'Yếu';
        } else if (strength < 4) {
            strengthFill.classList.add('medium');
            strengthText.textContent = 'Trung bình';
        } else {
            strengthFill.classList.add('strong');
            strengthText.textContent = 'Mạnh';
        }
    });
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
}

// Social Login Handlers (placeholder - would need OAuth implementation)
function initSocialLogin() {
    const googleBtn = document.getElementById('googleLoginBtn');
    const facebookBtn = document.getElementById('facebookLoginBtn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showToast('Đăng nhập Google sẽ sớm được hỗ trợ', 'info');
            // TODO: Implement Google OAuth
            // window.location.href = '/api/auth/google';
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            showToast('Đăng nhập Facebook sẽ sớm được hỗ trợ', 'info');
            // TODO: Implement Facebook OAuth
            // window.location.href = '/api/auth/facebook';
        });
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
        showToast('Vui lòng nhập đầy đủ thông tin', 'error');
        return;
    }

    toggleFormLoading(form, true);

    try {
        const res = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (res.success) {
            const user = {
                user_id: res.data.user_id || res.data.userId,
                full_name: res.data.full_name,
                email: res.data.email,
                phone: res.data.phone,
                role: res.data.role,
                avatar_url: res.data.avatar_url
            };
            setUserData(res.data.token, user);
            showToast('Đăng nhập thành công!', 'success');
            
            // Check for redirect URL
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
            
            // Redirect based on role or redirect param
            setTimeout(() => {
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                } else if (res.data.role === 'admin') {
                    window.location.href = 'admin/index.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 500);
        }
    } catch (error) {
        console.error('Login error:', error);
        if (error.message === 'Invalid email or password') {
            showToast('Email hoặc mật khẩu không đúng', 'error');
        } else {
            showToast(error.message || 'Đăng nhập thất bại', 'error');
        }
    } finally {
        toggleFormLoading(form, false);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;

    const payload = {
        full_name: form.full_name.value.trim(),
        email: form.email.value.trim(),
        password: form.password.value,
        confirm_password: form.confirm_password.value,
        phone: form.phone.value.trim(),
        gender: form.gender.value,
        date_of_birth: form.date_of_birth.value,
        address: form.address.value.trim()
    };

    // Validation
    if (!payload.full_name || !payload.email || !payload.password) {
        showToast('Vui lòng nhập đầy đủ thông tin bắt buộc', 'error');
        return;
    }

    if (payload.password.length < 6) {
        showToast('Mật khẩu phải từ 6 ký tự', 'error');
        return;
    }

    if (payload.password !== payload.confirm_password) {
        showToast('Mật khẩu xác nhận không khớp', 'error');
        return;
    }

    // Check terms agreement
    const agreeTerms = form.agree_terms?.checked;
    if (form.agree_terms && !agreeTerms) {
        showToast('Vui lòng đồng ý với điều khoản sử dụng', 'error');
        return;
    }

    toggleFormLoading(form, true);

    try {
        const res = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                full_name: payload.full_name,
                email: payload.email,
                password: payload.password,
                phone: payload.phone,
                gender: payload.gender || 'other',
                date_of_birth: payload.date_of_birth || null,
                address: payload.address
            })
        });

        if (res.success) {
            showToast('Đăng ký thành công! Chuyển đến trang đăng nhập...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Register error:', error);
        if (error.message === 'Email already registered') {
            showToast('Email này đã được đăng ký', 'error');
        } else {
            showToast(error.message || 'Đăng ký thất bại', 'error');
        }
    } finally {
        toggleFormLoading(form, false);
    }
}

function bindAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.dataset.defaultText = submitBtn.innerHTML;
        }
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.dataset.defaultText = submitBtn.innerHTML;
        }
        registerForm.addEventListener('submit', handleRegister);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.TourBooking) {
        console.error('TourBooking helpers missing');
        return;
    }
    
    bindAuthForms();
    initPasswordToggle();
    initPasswordStrength();
    initSocialLogin();
});
})();
