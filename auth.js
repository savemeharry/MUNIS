// auth.js
(function() {
    'use strict';

    // ВАЖНО: Замените "DEFAULT_PASSWORD_PLEASE_CHANGE" на ваш реальный пароль!
    const CORRECT_PASSWORD = "1423";
    const AUTH_KEY = 'site_authenticated_session';

    function isAuthenticated() {
        try {
            return sessionStorage.getItem(AUTH_KEY) === 'true';
        } catch (e) {
            // sessionStorage может быть недоступен в некоторых средах (например, file:// в некоторых браузерах при определенных настройках)
            console.warn("Session storage is not available. Password protection might not work as expected.");
            return false; // Если sessionStorage недоступен, считаем, что пользователь не аутентифицирован
        }
    }

    function storeAuthentication() {
        try {
            sessionStorage.setItem(AUTH_KEY, 'true');
        } catch (e) {
            console.warn("Session storage is not available. Could not store authentication state.");
        }
    }

    function displayAccessDeniedPage(message) {
        // Полностью заменяем содержимое документа, чтобы предотвратить отображение защищенного контента
        document.documentElement.innerHTML = `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Доступ запрещен</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                        text-align: center; 
                        padding: 20px; 
                        margin: 0;
                        background-color: #f0f0f0;
                        color: #333;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        box-sizing: border-box;
                    }
                    .container {
                        background-color: #fff;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                    h1 { 
                        color: #d93025; 
                        font-size: 24px;
                        margin-bottom: 10px;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }
                    .reload-button {
                        padding: 10px 20px;
                        font-size: 16px;
                        color: #fff;
                        background-color: #1a73e8;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        text-decoration: none;
                    }
                    .reload-button:hover {
                        background-color: #1558b0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Доступ запрещен</h1>
                    <p>${message}</p>
                    <p>Пожалуйста, попробуйте ввести пароль еще раз.</p>
                    <button class="reload-button" onclick="window.location.reload()">Обновить страницу</button>
                </div>
            </body>
            </html>`;
    }

    function requestPasswordAndAuthenticate() {
        if (isAuthenticated()) {
            return; // Уже аутентифицирован
        }

        // Если sessionStorage недоступен с самого начала, и мы не можем даже проверить isAuthenticated,
        // то не показываем prompt, а сразу блокируем.
        try {
            sessionStorage.setItem('test_ss_availability', 'test');
            sessionStorage.removeItem('test_ss_availability');
        } catch (e) {
            displayAccessDeniedPage("Ошибка: Хранилище сессии недоступно. Невозможно сохранить состояние входа. Проверьте настройки браузера.");
            return;
        }

        let attempts = 0;
        const maxAttempts = 3; // Количество попыток ввода пароля

        while (attempts < maxAttempts) {
            const enteredPassword = prompt("Пожалуйста, введите пароль для доступа к сайту:");

            if (enteredPassword === null) {
                // Пользователь нажал "Отмена" в окне prompt
                displayAccessDeniedPage("Вы отменили ввод пароля.");
                return; // Прекращаем выполнение скрипта
            }

            if (enteredPassword === CORRECT_PASSWORD) {
                storeAuthentication();
                // Можно добавить alert('Пароль верный. Доступ разрешен.'); если нужно явное подтверждение
                // Позволяем странице загрузиться нормально
                return;
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    alert(`Неверный пароль. Осталось попыток: ${maxAttempts - attempts}.`);
                } else {
                    displayAccessDeniedPage("Слишком много неудачных попыток ввода пароля.");
                    return; // Прекращаем выполнение скрипта
                }
            }
        }
        // Эта часть кода не должна быть достигнута, если логика цикла верна,
        // но на всякий случай:
        displayAccessDeniedPage("Не удалось получить доступ. Пожалуйста, обновите страницу.");
    }

    // Выполняем проверку аутентификации немедленно
    // Этот скрипт должен быть размещен в <head> ваших HTML документов,
    // чтобы он выполнился до обработки остального содержимого страницы.
    // Если document.body еще не существует (скрипт в head очень рано),
    // то замена document.documentElement.innerHTML - это то, что нужно.
    // Если тело уже есть, это тоже сработает.
    if (document.readyState === 'loading') {
        // Если DOM еще не загружен, мы точно в head или очень рано
        requestPasswordAndAuthenticate();
    } else {
        // DOM уже загружен, скрипт мог быть вставлен динамически или в конце body
        // В этом случае, если не аутентифицирован, надо бы очистить body
        // Но displayAccessDeniedPage уже делает document.documentElement.innerHTML
        requestPasswordAndAuthenticate();
    }

})(); 