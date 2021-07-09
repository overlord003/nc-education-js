const store = createStore(reducer);

store.subscribe((state) => console.log(state));

let app = document.getElementById('app');

let table = new Table();
table.appendTo(app);

let button = new Button({textContent: 'Добавить'});
button.appendTo(app);
button.addHandler('click', () => table.addNewRow());


table.generateRow('Chirstina');
table.generateRow('Nikita');
table.generateRow('Mark');
table.generateRow('Sofia');