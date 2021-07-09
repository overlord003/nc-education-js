const store = createStore(reducer);

store.subscribe((state) => console.log(state));

let app = document.getElementById('app');

let table = new Table();
table.appendTo(app);

// Ha-ha-ha!
let button = document.createElement('button');
button.innerHTML = 'Добавить';
app.append(button);

button.addEventListener('click', () => table.addNewRow());

table.generateRow('Chirstina');
table.generateRow('Nikita');
table.generateRow('Mark');
table.generateRow('Sofia');