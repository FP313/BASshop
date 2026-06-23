const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function btnErrorChecker(res, errorCode, textError, textReturn, btn){
    if(res.status == errorCode){
        btn.textContent = textError;
        btn.disabled = true;
        await sleep(1500);
        btn.textContent = textReturn;
        btn.disabled = false;
        return false;
    }
    return true;
}




document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.authForm');

    forms.forEach(form => {
        form.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            let isValid = true;

            const inputs = form.querySelectorAll('input');

            inputs.forEach(input => {
                let errorMsg = input.parentElement.querySelector('.errorMessage');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'errorMessage';
                    input.parentElement.appendChild(errorMsg);
                }


                errorMsg.textContent = '';
                input.classList.remove('errorInput');


                if (input.required && !input.value.trim()) {
                    errorMsg.textContent = 'Это поле обязательно для заполнения';
                    input.classList.add('errorInput');
                    isValid = false;
                }

                else if (input.type === 'email' && input.value.trim() !== '') {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value)) {
                        errorMsg.textContent = 'Введите корректный email адрес';
                        input.classList.add('errorInput');
                        isValid = false;
                    }
                }

                else if (input.name === 'pass' && input.value.length < 6 && input.value.trim() !== '') {
                    errorMsg.textContent = 'Пароль должен содержать минимум 6 символов';
                    input.classList.add('errorInput');
                    isValid = false;
                }
            });


            if (isValid) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const logBtn = form.querySelector('.submitBtn');
                

                if(event.submitter.name == "SignUp"){
                    const res = await fetch('/api/registration', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    
                    if (res.status !== 200) {
                        await btnErrorChecker(res, res.status, "Ошибка регистрации", "Регистрация", logBtn);
                        return;
                    }

                    await btnErrorChecker(res, 200, "Успех", "Войти", logBtn);

                    const res1 = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify(data)
                    });

                    if (res1.status === 200) {
                        const result = await res1.json();
                        localStorage.setItem("Token", result.token);
                        localStorage.setItem("Auth", "true");
                    } else {
                        await btnErrorChecker(res1, res1.status, "Ошибка входа", "Войти", logBtn);
                        return;
                    }
                }
                
                if(event.submitter.name == "LogIn"){
                    const res = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify(data)
                    });

                    if (res.status === 200) {
                        const result = await res.json();
                        localStorage.setItem("Token", result.token);
                        localStorage.setItem("Auth", "true");
                        await btnErrorChecker(res, 200, "Успех", "Войти", logBtn);
                    } else {
                        await btnErrorChecker(res, 404, "Пользователь не найден", "Войти", logBtn);
                        return;
                    }
                }

                
                
                const SaveUrl = localStorage.getItem('SaveUrl');
                SaveUrl != "" || SaveUrl != null? window.location.href = SaveUrl: window.location.href = "../pages/Catalog.html";
                
            }
        });

        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('errorInput');
                const errorMsg = input.parentElement.querySelector('.errorMessage');
                if (errorMsg) {
                    errorMsg.textContent = '';
                }
            });
        });
    });

    const tabs = document.querySelectorAll('.tabBtn');
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {

            document.querySelectorAll('.tabBtn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.authForm').forEach(f => f.classList.remove('active'));
            
            tab.classList.add('active');
            forms[index].classList.add('active');
        });
    });
});