const initialState = {
	items: [],
	dates: []
}

const reducer = (state = initialState, action) => {
	const {type, payload} = action;
	switch (type) {
		case 'ADD_DATE': {
			return {
				...state,
				items: state.items,
				dates: [
					...state.dates,
					payload
				]
			}
		}
		case 'REMOVE_DATE': {
			return {
				...state,
				items: state.items,
				dates: state
					.dates
					.filter(date => date !== payload)
			}
		}
		case 'ADD': {
			return {
				...state,
				items: [
					...state.items,
					payload
				]
			}
		}
		case 'RENAME': {
			return {
				...state,
				items: state
					.items
					.map(item => 
						item === payload.lastValue ? payload.newValue : item
					)
			}
		}
		case 'REMOVE': {
			return {
				...state,
				items: state.items.filter((item) => item !== payload)
			}
		}
		default:
			return state
	}
}

const createStore = (reducer) => {
	return {
		reducer,
		state: undefined,
		subscriptions: [],
		subscribe(subscription) {
			this.subscriptions.push(subscription)
		},
		dispatch(action) {
			this.state = this.reducer(this.state, action)
			this.subscriptions.forEach((subscription) => subscription(this.state))
		},
		checkStore(checkedDate) {
			return (this.state) ? this.state.dates.includes(checkedDate) : false;
		}
	}
}
class Node {
    constructor(tag, {classList='', textContent='', attributes={}}) {
        this.element = document.createElement(tag);
        this.element.className = classList;
        this.element.textContent = textContent;
        
        Object
            .entries(attributes)
            .forEach(([key, value]) =>
                this.element.setAttribute(key, value)
            );
    }

    addHandler(event, callback) {
        this.element.addEventListener(event, callback);
    }

    removeHandler(event, callback) {
        this.element.removeEventListener(event, callback);
    }

    addClass(addedClass) {
        this.element.classList.add(addedClass);
    }

    removeClass(removedClass) {
        this.element.classList.remove(removedClass);
    }

    appendTo(parent, replacement=false) {
        if (replacement) {
            parent.innerHTML = '';
        }
        parent.append(this.element);
    }

    insertText(text, replacement=false) {
        if (replacement) {
            this.element.innerHTML = '';
        }
        this.element.textContent = text;
    }

    setFocus(focus=true) {
        if (focus) {
            this.element.focus();
        } else {
            this.element.blur();
        }
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }
}
class Button extends Node {
    constructor(classList, textContent) {
        super('button', {
            classList: classList,
            textContent: textContent
        });
    }
}
class Input extends Node {
    constructor(type) {
        super('input', {
            attributes: {
                type: type,
            }
        });
    }

    get value() {
        return this.element.value;
    }

    set value(text) {
        this.element.value = text;
    }
}

class UserForm extends Node {
    constructor(props={}) {
        super('form', props);

        this._inputText = new Input('text');
        this._inputText.appendTo(this.element);
        
        this._btnOk = new Button('edit-ok', 'OK');
        this._btnOk.appendTo(this.element);

        this._btnCancel = new Button('edit-cancel', 'CANCEL');
        this._btnCancel.appendTo(this.element);
    }

    appendTo(parent, replacement=false, focused=false) {
        super.appendTo(parent, replacement);
        this._inputText.setFocus(focused);
    }

    get name() {
        return this._inputText.value;
    }

    set name(name) {
        this._inputText.value = name;
    }
}
class SelectionForm extends Node {
    constructor(value=false, props={}) {
        super('label', props);

        this._checkbox = new Node('input', {classList: 'checkbox__input _hidden', attributes: {type: 'checkbox'}});
        this._checkbox.appendTo(this.element);

        this._checkboxContent = new Node('span', {classList: 'checkbox__content'});
        this._checkboxContent.appendTo(this.element);
    }
}
class TableRow extends Node {
    constructor(name, columns, props={}) {
        super('div', {classList: 'table__row table-row'});
        
        this._userItem = new Node('div', {classList: 'table-row__user-item item user-item', textContent: name});
        this._userItem.appendTo(this.element);

        this._checkboxItems = new Array(columns).fill(null);
        this._checkboxItems
            .forEach(item => {
                item = new SelectionForm(false, {classList: 'item checkbox-item'});
                item.appendTo(this.element);
            }
        );
    }

    generateClick() {
        this._userItem.element.dispatchEvent(new Event('click', {bubbles: true}));
    }
}
class Table extends Node {
    constructor(names=[], columns=0) {
        if (typeof Table.instance === 'object') {
            return Table.instance;
        }

        // super('div', {classList: 'table-section__table table'});
        super('div', {classList: ''});


        this.rows = [];
        names.forEach(name => {
            let row = new TableRow(name, columns);
            row.appendTo(this.element);
            this.rows.push(row);

            store.dispatch({
                type: 'ADD',
                payload: name    
             });
        });

        this._editingItem = null;     
        this.element.onclick = (event) => {
            let target = event.target.closest('.user-item, .edit-ok, .edit-cancel');
            if (!this.element.contains(target)) return;
        
            if (target.classList.contains('edit-ok')) {
                this._finishUserItemEdit(true);
            } else if (target.classList.contains('edit-cancel')) {
                this._finishUserItemEdit();
            } else if (target.classList.contains('user-item')) { 
                if (this._editingItem) {
                    return;
                }
                this._makeItemEditable(target);
            }
        };

        Table.instance = this;
        return this;
    }

    _makeItemEditable(item) {
        this._editingItem = {
            item: item,
            data: item.innerHTML,
            form: new UserForm()
        };
    
        item.classList.add('edit-item');
        this._editingItem.form.appendTo(item, true);
    }
    
    _finishUserItemEdit(isOk=false) {
        if (isOk) {
            let newValue = this._editingItem.form.name;
            if (newValue) {
                this._editingItem.item.innerHTML = newValue;

                let lastValue = this._editingItem.data;
                store.dispatch({
                    type: 'RENAME',
                    payload: {lastValue, newValue}  
                });
            } else {
                alert('И что за фигня? Введи сюда хоть что-то, паразит.');
                return;
            }
        } else { 
            this._editingItem.item.innerHTML = this._editingItem.data;
        }
    
        this._editingItem.item.classList.remove('edit-item');
        this._editingItem = null;
    }

    addNewRow(columns) {
        if (this._editingItem) {
            alert('Попытался сломать? Фиг тебе! Сначала закончи с предыдущим пользователем.');
            return;
        }

        let newRow = new TableRow('', columns);
        newRow.appendTo(this.element);
        newRow.generateClick();
        this.rows.push(newRow);

        store.dispatch({
           type: 'ADD',
           payload: ''    
        });
    }
}
class SimpleTable extends Node {
    constructor(classList, headers=[]) {
        super('table', {classList: classList});

        this._classList = classList;

        // Создаем заголовки таблицы
        this._header = new Node('tr', {classList: `${classList}__th`});
        this._header.appendTo(this.element);
        headers.forEach(header =>
            new Node('th', {
                textContent: header
            })
            .appendTo(this._header.element)
        );

        this._rows = [];
    }

    // Создаем новую строчку таблицы
    createRow(values=[], columns=1) {
        let row = new Node('tr', {classList: `${this._classList}__tr ${this._classList}-tr`});
        row.appendTo(this.element);
        
        if (values.length < columns) {
            values = [
                ...values,
                 ...new Array(columns - values.length).fill({
                    text: '',
                    modificator: '_disabled'
                })
            ];
        }

        values.forEach(value => {
            new Node('td', {
                textContent: value.text,
                classList: `${this._classList}-tr__td ${value.modificator}`
            })
            .appendTo(row.element);
        });

        this._rows.push(row);
    }

    removeRows() {
        this._rows.forEach(row =>
            row.element.remove()
        );
    }
}

class Calendar extends SimpleTable {
    constructor(classList='') { 
        super(classList, ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']);

        this.currentYear = 2021;
        this.currentMonth = 7;

        this.element.onclick = (event) => {
            let td = event.target.closest('td'); 

            if (!td) return; 
            if (!this.element.contains(td)) return; 

            if (td.classList.contains('_disabled')) {
                return;
            } else if (td.classList.contains('_booked')) {
                td.classList.remove('_booked');

                store.dispatch({
                    type: 'REMOVE_DATE',
                    payload: this.formatDate(new Date(this.currentYear, this.currentMonth, +td.textContent))
                });
            } else {
                td.classList.add('_booked');

                store.dispatch({
                    type: 'ADD_DATE',
                    payload: this.formatDate(new Date(this.currentYear, this.currentMonth, +td.textContent))
                });
            }
        };
    }

    createCalendar(year, month) {
        this.removeRows();

        this.currentYear = year;
        this.currentMonth = month;

        let mon = month - 1;
        let d = new Date(year, mon);
        
        let values = [];

        for (let i = 0; i < this._getDay(d); i++) {
            values.push({text: '', modificator: '_disabled'});
        }
      
        while (d.getMonth() == mon) {
            values.push({
                text: d.getDate(),
                modificator: store.checkStore(
                    this.formatDate(
                        new Date(this.currentYear, this.currentMonth, d.getDate())
                    )) ? '_booked' : ''
                });
      
            if (this._getDay(d) % 7 == 6) {
                this.createRow(values);
                values = [];
            }
      
            d.setDate(d.getDate() + 1);
        }
        if (values.length) {
            this.createRow(values, 7);
        }
    }

    next() {
        this.currentMonth += 1;
        if (this.currentMonth === 13) {
            this.currentMonth = 1;
            this.currentYear += 1;
        }
        this.createCalendar(this.currentYear, this.currentMonth);
    }

    prev() {
        this.currentMonth -= 1;
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear -= 1;
        }
        this.createCalendar(this.currentYear, this.currentMonth);
    }

    formatDate(date) {
        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;
      
        let mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
      
        let yy = date.getFullYear() % 100;
        if (yy < 10) yy = '0' + yy;
      
        return dd + '.' + mm + '.' + yy;
    }

    _getDay(date) {
        let day = date.getDay();
        return day === 0 ? 6 : day - 1;
    }
}


class Booking extends Node {
    constructor() {
        super('div', {classList: 'table-section__table calendar'});
      
        // Навигационный блок с кнопками переключателями и заголовком текущего месяца
        this._header = new Node('header', {classList: 'calendar__header calendar-header'});
        this._header.appendTo(this.element);

        this._prevButton = new Button('calendar-header__button', 'Пред.');
        this._nextButton = new Button('calendar-header__button', 'След.');

        this._title = new Node('h2', {classList: 'calendar-header__title'});
        
        this._prevButton.appendTo(this._header.element);
        this._title.appendTo(this._header.element);
        this._nextButton.appendTo(this._header.element);

        // Календарный блок
        this._calendar = new Calendar('calendar-table');
        this._calendar.addClass('calendar__calendar-table');
        this._calendar.appendTo(this.element);

        this.start();
    }

    // Активируем календарь - вешаем обработчики, наполняем его смыслом...
    start() {
        let currentDate = new Date();
        this._calendar.createCalendar(currentDate.getFullYear(), currentDate.getMonth());

        this._updateTitle();

        this._prevButton.addHandler('click', () => {
            this._calendar.prev();
            this._updateTitle();
        });
        this._nextButton.addHandler('click', () => {
            this._calendar.next();
            this._updateTitle();
        });
    }

    _updateTitle() {
        this._title.insertText(`${this._calendar.currentMonth} ${this._calendar.currentYear}`, true);
    }
}
const store = createStore(reducer);
store.subscribe((state) => console.log(state));

const app = document.querySelector('.app');

// let app = document.body.querySelector('.table-section');

class Choice extends Node {
    constructor() {
        super('div', {classList: 'table-section__table users'})
        this._table = new Table(['Christina', 'Nikita', 'Mark', 'Sofia'], 7);
        this._table.appendTo(this.element);

        this._button = new Button('button', 'Добавить');
        this._button.appendTo(this.element);
        this._button.addHandler('click', () => this._table.addNewRow(7));
    }
}


// let booking = new Booking();
// booking.start();

// booking.appendTo(document.querySelector('.app'));

class Route {
    constructor(pathname, view, props) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
    }

    leave() {
        if (this._block) {
            this._block.hide();
        }
    }

    match(pathname) {
        return pathname === this._pathname;
    }

    render() {
        if (!this._block) {
            this._block = new this._blockClass();
            this._block.appendTo(document.querySelector(this._props.rootQuery));
            return;
        }

        this._block.show();
    }
}


class Router {
    constructor(rootQuery) {
        // singleton
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = []; // Список страниц и соответстующих им отображаемых компонент
        this.history = window.history;
        this._currentRoute = null; // Текущая отражаемая страница (если так можно выразиться)
        this._rootQuery = rootQuery;

        Router.__instance = this;
    }

    // Регестрируем, какой блок отображается по какой ссылке
    // /calendar - new Booking
    // /table - new Table
    // и т. д.
    use(pathname, block) {
        // по сути - регистрация страницы
        const route = new Route(pathname, block, {rootQuery: this._rootQuery});

        this.routes.push(route);

        // for chaining
        return this;
    }

    start() {
        window.onpopstate = (event => {
            // Событие popstate отсылается объекту window каждый раз, когда активная
            // запись истории меняется с одной на другую для одного и того же документа.
            console.log(`onpopstate`);
            console.dir({event});

            this._onRoute(event.currentTarget.location.pathname);
        }).bind(this);

        this._onRoute(window.location.pathname);
    }

    _onRoute(pathname) {
        // Получаем текущую страницу+ее компоненту по pathname
        const route = this.getRoute(pathname);
        if (!route) {
            return;
        }

        console.log('_onRoute', this._currentRoute, this._rootQuery);

        // Обрабатываем что-то непонятное
        if (this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave();
        }

        // Меняем роутер
        this._currentRoute = route;
        route.render(route, pathname);
    }

    // Перейти на текущую страницу
    go(pathname) {
        this.history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }

    // Путешествие по истории вперед-назад...
    back() {
        this.history.back();
    }

    forward() {
        this.history.forward();
    }

    // Получить текущую страницу 
    getRoute(pathname) {
        return this.routes.find(route => route.match(pathname));
    }
}

const router = new Router('.table-section');

router
    .use('/calendar', Booking)
    .use('/table', Choice)
    .start();

window.router = router;

//Hahahhaha
let button1 = new Button('button', 'К таблице');
let button2 = new Button('button', 'К календарю');

button2.appendTo(app);
button1.appendTo(app);

button1.addHandler('click', () => window.router.go('/table'));
button2.addHandler('click', () => window.router.go('/calendar'));


// window.router.go('/');