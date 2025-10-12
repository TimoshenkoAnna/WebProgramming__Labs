document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const registerBtn = document.getElementById('register-btn');

    const lastName = document.getElementById('lastName');
    const firstName = document.getElementById('firstName');
    const dob = document.getElementById('dob');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const nicknameInput = document.getElementById('nickname');
    const passwordChoice = document.getElementsByName('passwordChoice');
    const manualPasswordSection = document.getElementById('manual-password-section');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('terms');
    const regenerateBtn = document.getElementById('regenerate-nickname-btn');

    const API_URL = 'http://localhost:3000/users';
    let commonPasswords = new Set();
    
    let nicknameRegenAttempts = 0;

    async function fetchCommonPasswords() {
        try {
            const commonList = ["123456", "password", "123456789", "12345678", "12345", "111111", "1234567", "sunshine", "qwerty", "iloveyou"];
            commonPasswords = new Set(commonList);
            console.log("Список распространенных паролей загружен.");
        } catch (error) {
            console.error('Не удалось загрузить список распространенных паролей:', error);
        }
    }
    fetchCommonPasswords();
    
    const showError = (input, message) => {
        const formGroup = input.parentElement.closest('.form-group');
        const error = formGroup.querySelector('.error-message');
        error.textContent = message;
        input.classList.add('invalid');
    };

    const hideError = (input) => {
        const formGroup = input.parentElement.closest('.form-group');
        const error = formGroup.querySelector('.error-message');
        error.textContent = '';
        input.classList.remove('invalid');
    };

    const isRequired = value => value !== '';
    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhoneValid = (phone) => /^\+375 \((29|33|44|25)\) \d{3}-\d{2}-\d{2}$/.test(phone);

    const isPasswordSecure = (pass) => {
        const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,20})");
        return re.test(pass);
    };

    async function isNicknameUnique(nickname) {
        if (!nickname) return false;
        const response = await fetch(`${API_URL}?nickname=${nickname}`);
        const users = await response.json();
        return users.length === 0;
    }

    async function validateField(input) {
        hideError(input);
        let isValid = true;

        switch(input.id) {
            case 'lastName':
            case 'firstName':
                if (!isRequired(input.value.trim())) {
                    showError(input, 'Это обязательное поле.');
                    isValid = false;
                }
                break;

            case 'dob':
                if (!isRequired(input.value)) {
                    showError(input, 'Пожалуйста, введите вашу дату рождения.');
                    isValid = false;
                } else {
                    const birthDate = new Date(input.value);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    if (age < 16) {
                        showError(input, 'Для регистрации вам должно быть не менее 16 лет.');
                        isValid = false;
                    }
                }
                break;
            case 'email':
                if (!isRequired(input.value.trim())) {
                    showError(input, 'Email обязателен.');
                    isValid = false;
                } else if (!isEmailValid(input.value.trim())) {
                    showError(input, 'Пожалуйста, введите корректный email адрес.');
                    isValid = false;
                }
                break;
            case 'phone':
                 if (!isRequired(input.value.trim())) {
                    showError(input, 'Номер телефона обязателен.');
                    isValid = false;
                } else if (!isPhoneValid(input.value.trim())) {
                    showError(input, 'Используйте формат: +375 (XX) XXX-XX-XX.');
                    isValid = false;
                }
                break;
            case 'password':
                if (document.querySelector('input[name="passwordChoice"]:checked').value === 'manual') {
                     if (!isRequired(input.value)) {
                        showError(input, 'Пароль обязателен.');
                        isValid = false;
                    } else if (!isPasswordSecure(input.value)) {
                        showError(input, 'Пароль не соответствует требованиям безопасности.');
                        isValid = false;
                    } else if (commonPasswords.has(input.value)) {
                        showError(input, 'Этот пароль слишком простой. Выберите более надежный.');
                        isValid = false;
                    }
                }
                break;
            case 'confirmPassword':
                 if (document.querySelector('input[name="passwordChoice"]:checked').value === 'manual') {
                    if (!isRequired(input.value)) {
                        showError(input, 'Пожалуйста, подтвердите пароль.');
                        isValid = false;
                    } else if (password.value !== input.value) {
                        showError(input, 'Пароли не совпадают.');
                        isValid = false;
                    }
                 }
                break;
            case 'terms':
                if (!input.checked) {
                    showError(input, 'Вы должны согласиться с условиями.');
                    isValid = false;
                }
                break;

            case 'nickname':
                if (nicknameInput.readOnly === false) {
                    if (!isRequired(input.value.trim())) {
                        showError(input, 'Никнейм обязателен.');
                        isValid = false;
                    } else if (!(await isNicknameUnique(input.value.trim()))) {
                        showError(input, 'Этот никнейм уже занят. Пожалуйста, выберите другой.');
                        isValid = false;
                    }
                }
                break;
        }
        checkFormValidity();
        return isValid;
    };

    const generateNickname = async () => {
        if (!firstName.value.trim() || !lastName.value.trim() || nicknameInput.readOnly === false) {
            return;
        }

        const fNamePart = firstName.value.slice(0, 3);
        const lNamePart = lastName.value.slice(0, 3);
        const randomNumber = Math.floor(100 + Math.random() * 900);
        const generatedNickname = `${fNamePart}${lNamePart}${randomNumber}`;

        if (await isNicknameUnique(generatedNickname)) {
            nicknameInput.value = generatedNickname;
            hideError(nicknameInput);
        } else {
            if (nicknameRegenAttempts < 5) {
                generateNickname();
            }
        }
    };

    if(regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            nicknameRegenAttempts++;
            if (nicknameRegenAttempts >= 5) {
                nicknameInput.readOnly = false;
                nicknameInput.value = '';
                nicknameInput.focus();
                regenerateBtn.disabled = true;
                alert("Теперь вы можете ввести свой никнейм вручную.");
            } else {
                generateNickname();
            }
        });
    }

    const checkFormValidity = () => {
        let isFormValid = true;
        form.querySelectorAll('input[required], input[name="password"], #nickname').forEach(input => {
            if(input.id === 'password' && document.querySelector('input[name="passwordChoice"]:checked').value === 'auto') {
                return;
            }
            if(input.id === 'nickname' && input.readOnly === true && !input.value) {
                isFormValid = false;
                return;
            }
            if (input.classList.contains('invalid') || (input.required && !input.value && input.type !== 'checkbox') || (input.type === 'checkbox' && !input.checked)) {
                isFormValid = false;
            }
        });
        registerBtn.disabled = !isFormValid;
    };

    if(form) {
        form.addEventListener('input', async (e) => {
            await validateField(e.target);
        });

        [firstName, lastName].forEach(input => input.addEventListener('blur', generateNickname));

        passwordChoice.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'manual') {
                    manualPasswordSection.style.display = 'block';
                    password.setAttribute('required', 'required');
                    confirmPassword.setAttribute('required', 'required');
                } else {
                    manualPasswordSection.style.display = 'none';
                    password.removeAttribute('required');
                    confirmPassword.removeAttribute('required');
                    hideError(password);
                    hideError(confirmPassword);
                }
                checkFormValidity();
            });
        });

        if(confirmPassword) {
            confirmPassword.addEventListener('paste', e => e.preventDefault());
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            for (const input of form.querySelectorAll('input[required], input[name="password"], #nickname')) {
                if (!(await validateField(input))) {
                    isFormValid = false;
                }
            }

            if (!isFormValid) {
                alert('Пожалуйста, исправьте ошибки в форме перед отправкой.');
                return;
            }

            let finalPassword = password.value;
            if(document.querySelector('input[name="passwordChoice"]:checked').value === 'auto') {
                finalPassword = 'Auto' + Math.random().toString(36).slice(-10) + '!1';
            }

            const newUser = {
                lastName: lastName.value.trim(),
                firstName: firstName.value.trim(),
                middleName: document.getElementById('middleName').value.trim(),
                dob: dob.value,
                email: email.value.trim(),
                phone: phone.value.trim(),
                nickname: nicknameInput.value.trim(),
                password: finalPassword,
                role: "customer"
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });
                
                if(response.ok) {
                    const createdUser = await response.json();

                    localStorage.setItem('currentUser', JSON.stringify(createdUser));

                    alert(`Регистрация прошла успешно! Ваш никнейм: ${createdUser.nickname}.` + (document.querySelector('input[name="passwordChoice"]:checked').value === 'auto' ? `\nВаш временный пароль: ${finalPassword}` : '') + `\n\nСейчас вы будете перенаправлены на главную страницу.`);
                    
                    window.location.href = 'Brella__index.html';
                    
                } else {
                    throw new Error("Не удалось зарегистрироваться. Сервер ответил ошибкой.");
                }
            } catch (error) {
                console.error("Ошибка отправки:", error);
                alert("Во время регистрации произошла ошибка. Пожалуйста, попробуйте позже.");
            }
        });
    }

    checkFormValidity();
});
