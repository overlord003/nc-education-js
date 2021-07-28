// Демонстрация работы с генерацией пользовательских событий.

let btnToggleTheme = new Button('app__button button _toggle');
btnToggleTheme.appendTo(document.querySelector('.app'));

let toggleTheme = () => {
    let event = new CustomEvent('toggle-theme', {
        cancelable: true
    });

    if (!btnToggleTheme.dispatchEvent(event)) {
        alert('Вы отменили выбор темы.');
    } else {
        if(document.documentElement.hasAttribute("theme")){
            document.documentElement.removeAttribute("theme");
        } else {
            document.documentElement.setAttribute("theme", "light");
        }
    }
};

let confirmNewTheme = event => {
    if (!confirm('Вы уверены, что хотите сменить тему?')) {
        event.preventDefault();
    }
};

btnToggleTheme.addHandler('click', toggleTheme);
btnToggleTheme.addHandler('toggle-theme', confirmNewTheme);

btnToggleTheme.addHandler('click', event => event.stopPropagation());