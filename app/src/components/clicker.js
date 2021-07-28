// Еслии тыкаем на фон, то увеличивается счетчик (кстати тут замыкание).
// В других местах на элементы с атрибутом main навешаны обработчики,
// что клики не всплывают.

const MAX_CLICKS = 5;

function clicker() {
    let count = 0;

    function counter(event) {
        count += 1;
        if (count > MAX_CLICKS) {
            alert('Картина, конечно, красивая, но вы тратите время зря!');
            count = 0;
        }
    }

    return counter;
}

window.addEventListener('click', clicker());
