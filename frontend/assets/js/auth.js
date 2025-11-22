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
        submitBtn.innerHTML = isLoading ? '<i class="fas fa-spinner fa-spin"></i> Đang xử lý' : submitBtn.dataset.defaultText;
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
            showToast('Đăng nhập thành công', 'success');
            
            // Redirect admin to admin panel, customer to homepage
            if (res.data.role === 'admin') {
                window.location.href = 'index.html'; // hoặc 'admin/index.html' nếu muốn
            } else {
                window.location.href = 'index.html';
            }
        }
    } catch (error) {
        showToast(error.message || 'Đăng nhập thất bại', 'error');
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
            showToast('Đăng ký thành công, vui lòng đăng nhập', 'success');
            window.location.href = 'login.html';
        }
    } catch (error) {
        showToast(error.message || 'Đăng ký thất bại', 'error');
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
            submitBtn.dataset.defaultText = submitBtn.textContent.trim();
        }
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.dataset.defaultText = submitBtn.textContent.trim();
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
});
})();
