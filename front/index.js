const app = document.getElementById('app');

// TODO create HTTP service, добавить get, post (посмотреть на Angular http client)
function ajax(method, path) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        mode: 'cors',
    };

    return fetch(`http://localhost:8002/${path}`, options)
        .then(resp => resp.json());
}

// Функция для создания одной в строчки в таблице (по аналогии с примером
// создания li элементов списка ul в learnjs)
function getRowContent(userName, columnsCount) {
    // Все ячейки строки
    let cells = [];

    // Создаем первую (и единственный по началу) ячейку - имя пользователя
    let userCell = document.createElement('td');
    userCell.classList.add('td', 'user-cell');
    userCell.textContent = userName;
    cells.push(userCell);

    // Создаем остальные ячейки для опроса (может или не может в этот день)
    for (let i = 0; i < columnsCount; i++) {
        let simpleCell = document.createElement('td');
        simpleCell.classList.add('td');
        simpleCell.textContent="...";

        cells.push(simpleCell);
    }

    return cells;
}

// В голове таблицы отражаются даты на ближайшее время
function createTHead(dates=['1 августа', '2 августа', '3 августа', '4 августа', '5 августа']) {
    let tr = [];

    let th = document.createElement('th');
    th.classList.add('th', 'bg-white');
    tr.push(th);

    for (let i = 0; i < dates.length; i++) {
        let th = document.createElement('th');
        th.classList.add('th');
        th.textContent = dates[i];

        tr.push(th);
    }

    return tr;
}

// Функция для создания таблицы по умолчанию
function createTable(count=5) {
    // Создаем таблицу
    let table = document.createElement('table');
    table.classList.add('table');

    // Создаем тело таблицы
    let tbody = document.createElement('tbody');
    tbody.classList.add('tbody');

    // Создаем голову таблицы
    let thead = document.createElement('thead');
    thead.classList.add('thead');
    thead.append(...createTHead());



    // Создаем первую (и единственный по началу) строчку
    let tr = document.createElement('tr');
    tr.classList.add('tr');
    tr.append(...getRowContent('Christina', count));

    tbody.append(tr);
    table.append(thead);
    table.append(tbody);
    app.append(table);
}

// Кнопка добавления ячейки в табличку
function createButton() {
    const button = document.createElement('button');
    button.innerHTML = "Добавить";

    button.onclick = function() {
        let tbody = document.querySelector('.thead');

        let tr = document.createElement('tr');
        tr.classList.add('tr');
        tr.append(...getRowContent('Christina', 5));

        tbody.append(tr);
    };

    app.append(button);
}


createTable();
createButton();