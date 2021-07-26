let initialNames = window.localStorage.getItem('names');
let initialDates = window.localStorage.getItem('dates');

const initialState = {
	items: (initialNames === null || initialNames === '')  ? [] : initialNames.split(','),
	dates: (initialDates === null || initialDates === '') ? [] : initialDates.split(',')
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
		case 'ADD_NAME': {
			return {
				...state,
				items: [
					...state.items,
					payload
				],
				dates: state.dates
			}
		}
		case 'RENAME_NAME': {
			return {
				...state,
				items: state
					.items
					.map(item => 
						item === payload.lastValue ? payload.newValue : item
					),
				dates: state.dates
			}
		}
		case 'REMOVE_NAME': {
			return {
				...state,
				items: state.items.filter((item) => item !== payload),
				dates: state.dates
			}
		}
		case 'CLEAR': {
			return {
				...state,
				items: [],
				dates: []
			}
		}
		default:
			return state
	}
}

const createStore = (reducer) => {
	return {
		reducer,
		state: initialState,
		subscriptions: [],
		subscribe(subscription) {
			this.subscriptions.push(subscription)
		},
		dispatch(action) {
			this.state = this.reducer(this.state, action);
			
			window.localStorage.setItem('dates', this.state.dates);
			window.localStorage.setItem('names', this.state.items);

			//console.log(window.localStorage.dates);

			this.subscriptions.forEach((subscription) => subscription(this.state));
		},
		checkStore(checkedDate) {
			return (this.state) ? this.state.dates.includes(checkedDate) : false;
		},
		checkStoreNames(checkedName) {
			return (this.state) ? this.state.items.includes(checkedName) : false;
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

    appendIn(parent, replacement=false) {
        if (replacement) {
            parent.innerHTML = '';
        }
        parent.element.append(this.element);
    }

    appendTo(parent, replacement=false) {
        if (replacement) {
            parent.innerHTML = '';
        }
        parent.append(this.element);
    }

    removeChildren() {
        this.element.innerHTML = '';
    }

    insertText(text, replacement=false) {
        if (replacement) {
            this.element.innerHTML = '';
        }
        this.element.textContent = text;
    }

    insertHTML(html) {
        this.element.innerHTML = html;
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

    makeDragNDrop() {
        this.element.draggable = true;
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
class SimpleTable extends Node {
    constructor(classList, headers=[]) {
        super('table', {classList: classList});

        this._classList = classList;

        // Создаем заголовки таблицы
        this._header = new Node('tr', {classList: `${classList}__th ${classList}-th`});
        this._header.appendIn(this);
        headers.forEach(header =>
            new Node('th', {
                textContent: header,
                classList: `${classList}-th__td`
            })
            .appendTo(this._header.element)
        );

        this._rows = [];
    }

    // Создаем новую строчку таблицы
    createRow(values=[], columns=1) {
        let row = new Node('tr', {classList: `${this._classList}__tr ${this._classList}-tr`});
        row.appendIn(this);
        
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

        // this.count = sto;

        this.element.onclick = (event) => {
            let td = event.target.closest('td'); 

            if (!td) return; 
            if (!this.element.contains(td)) return; 

            if (td.classList.contains('_disabled')) {
                return;
            } else if (td.classList.contains('_booked')) {
                this.count -= 1;

                td.classList.remove('_booked');

                store.dispatch({
                    type: 'REMOVE_DATE',
                    payload: this.formatDate(new Date(this.currentYear, this.currentMonth - 1, +td.textContent))
                });
            } else {
                if (store.state.dates.length > 6) {
                    alert('Превышено допустимое количество забронированных дат!');
                } else {
                    // this.count += 1;
                    
                    td.classList.add('_booked');

                    store.dispatch({
                        type: 'ADD_DATE',
                        payload: this.formatDate(new Date(this.currentYear, this.currentMonth - 1, +td.textContent))
                    });
                }
            }
        };
    }

    createCalendar(year, month) {
        this.removeRows();

        console.log('...');

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
                        new Date(this.currentYear, this.currentMonth - 1, d.getDate())
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
            this.currentMonth = 12;
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


class CalendarBlock extends Node {
    constructor(parentClass) {
        super('div', {classList: `${parentClass}__calendar calendar`});
      
        // Навигационный блок с кнопками переключателями и заголовком текущего месяца
        this._header = new Node('header', {classList: 'calendar__header calendar-header'});
        this._header.appendIn(this);

        this._prevButton = new Button('calendar-header__button button', '<');
        this._nextButton = new Button('calendar-header__button button', '>');
        this._prevButton.addHandler('click', () => {
            this._calendar.prev();
            this._updateTitle();
        });
        this._nextButton.addHandler('click', () => {
            this._calendar.next();
            this._updateTitle();
        });

        this._title = new Node('h2', {classList: 'calendar-header__title'});
        
        this._prevButton.appendIn(this._header);
        this._title.appendIn(this._header);
        this._nextButton.appendIn(this._header);

        // Календарный блок
        this._calendar = new Calendar('calendar-table');
        this._calendar.addClass('calendar__calendar-table');
        this._calendar.appendIn(this);
    }

    // Активируем календарь...
    start() {
        let currentDate = new Date();
        this._calendar.createCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);

        this._updateTitle();
    }

    _updateTitle() {
        this._title.insertText(`${this._calendar.currentMonth} ${this._calendar.currentYear}`, true);
    }
}

class DatesBlock extends Node{
    constructor(parentClass) {
        super('div', {classList: `${parentClass}__dates dates`});

        this.title = new Node('h2', {
            classList: 'dates__title dates-title',
            textContent: 'Ваши бронирования'
        });
        this.title.appendIn(this);

        this.datesList = new Node('ul', {classList: 'dates__list dates-list'});
        this.datesList.appendIn(this);

        this.update(store.state.dates);
    }

    update(dates) {
        this.datesList.removeChildren();

        dates
            .forEach(date => {
                const item = new Node('li', {
                    classList: ' dates-list__item',
                    textContent: date
                });
                item.appendIn(this.datesList);
            });
    }
}
class Input extends Node {
    constructor(parentClass, type) {
        super('input', {
            classList: parentClass,
            attributes: {
                type: type,
                maxlength: 16
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
        super('form', {
            classList: 'edit-item__form form'
        });

        this._inputText = new Input('form__input input', 'text');
        this._inputText.appendTo(this.element);
        // this._inputText.addHandler('input', (event) => {
        //     if (this._inputText.value.length > 13) {
        //         alert('Превышено допустимое количество символов!');
        //         return false;
        //     }
        // });

        this._btnOk = new Button('form__button button edit-ok', '');
        this._btnOk.element.hidden = true;
        this._btnOk.appendTo(this.element);
        
        this._btnCancel = new Button('form__button button edit-cancel', 'x');
        this._btnCancel.appendTo(this.element);
    }

    appendTo(parent, replacement=false, focused=true) {
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
        
        this._userItem = new Node('div', {
            classList: 'table-row__user-item item user-item',
            textContent: name
        });
        this._userItem.appendTo(this.element);

        this._checkboxItems = new Array(columns).fill(null);
        this._checkboxItems
            .forEach(item => {
                item = new SelectionForm(false, {classList: 'item checkbox-item'});
                item.appendTo(this.element);
            }
        );

        // Drag n drop
        this.makeDragNDrop();
    }


    // Добавить потом проверку на то что индекс больше чем кол-во элементов
    deleteByIndex(index) {
        let element = this.element.firstElementChild.nextElementSibling;

        let i  = 0;
        while (i < index) {
            element = element.nextElementSibling;
            i += 1;
        }

        element.remove();
    }

    appendNewItem() {
        let item = new SelectionForm(false, {classList: 'item checkbox-item'});
        item.appendIn(this);
    }

    generateClick() {
        this._userItem.element.dispatchEvent(new Event('click', {bubbles: true}));
    }

    getBooleanArray() {
        let array = Array
            .from(this.element.querySelectorAll('.checkbox__input'))
            .map(item => {
                return item.checked;
            });
        console.log(array);
        return array;
    }
}
class Table extends Node {
    constructor(parentClass, names=[], dates) {
        if (typeof Table.instance === 'object') {
            return Table.instance;
        }

        super('div', {classList: `${parentClass}__table table`});

        this.dates = dates;

        // Создаем заголовок
        this.header = new Node('div', {
            classList: 'table__header table-header'
        });
        let item = new Node('div', {
            classList:  'table-header__item',
            textContent: 'Участники'
        });
        item.appendIn(this.header);
        dates.forEach(date => {
            let item = new Node('div', {
                classList:  'table-header__item',
                textContent: date 
            });
            item.appendIn(this.header);
        });
        this.header.appendIn(this);
        /* Созданиие заголовка закончено */

        // Создаем строчки c именами из localStorage
        this.rows = [];
        names.forEach(name => {
            let row = new TableRow(name, dates.length);
            row.appendTo(this.element);
            this.rows.push(row);

            // store.dispatch({
            //     type: 'ADD_NAME',
            //     payload: name    
            //  });
        });

        this._editingItem = null;     
        this.element.onclick = (event) => {
            let target = event.target.closest('.user-item, .edit-cancel');
            if (!this.element.contains(target)) return;
        
            if (target.classList.contains('edit-cancel')) {
                this._finishUserItemEdit();
            } else if (target.classList.contains('user-item')) { 
                if (this._editingItem) {
                    return;
                }
                this._makeItemEditable(target);
            }
        };

        // Drag n drop start
        const getNextElement = (cursorPosition, currentElement) => {
            const currentElementCoord = currentElement.getBoundingClientRect();
            const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
          
            const nextElement = (cursorPosition < currentElementCenter) ?
                currentElement :
                currentElement.nextElementSibling;
          
            return nextElement;
        };

        this.addHandler('dragstart', (event) => 
            event.target.classList.add('_selected')
        );

        this.addHandler('dragend', (event) => {
            event.target.classList.remove('_selected');
            if (event.target.classList.contains('_deleted')) {
                let userItem = event.target.querySelector('.user-item');
                store.dispatch({
                    type: 'REMOVE_NAME',
                    payload: userItem.innerHTML
                });
                event.target.remove();
            }
        });

        this.addHandler('dragover', (event) => {
            event.preventDefault();

            let activeElement = this.element.querySelector('._selected');
            activeElement.classList.remove('_deleted');
        
            let currentElement = event.target.closest('.table-row');
            
            let deletedZone = event.target.closest('.deleted-zone');
            
            if (currentElement) {
                if (activeElement === currentElement) return;

                const nextElement = getNextElement(event.clientY, currentElement);
                this.element.insertBefore(activeElement, nextElement);
            } else if (deletedZone) {
                activeElement.classList.add('_deleted');
            } 
        });

        // Зона для удаления элементов
        this.deletedZone = new Node('div', {
            classList: 'table__deleted-zone deleted-zone'
        });
        this.deletedZone.appendIn(this);

        // Drag n drop end

        Table.instance = this;
        return this;
    }

    _makeItemEditable(item) {
        this._editingItem = {
            item: item,
            data: item.innerHTML,
            form: new UserForm({
                classList: 'form'
            })
        };
    
        item.classList.add('edit-item');
        this._editingItem.form.appendTo(item, true);
        this._editingItem.form.name = this._editingItem.data;

        // Работа с формой
        this._editingItem.form.addHandler('submit', (event) => {
            event.preventDefault();
            
            const newValue = this._editingItem.form.name;
            if (!newValue) return;
            if (store.checkStoreNames(newValue)) {
                alert('Такое имя уже есть!');
                return;
            }

            this._editingItem.item.innerHTML = newValue;

            let lastValue = this._editingItem.data;
            store.dispatch({
                type: 'RENAME_NAME',
                payload: {lastValue, newValue}  
            });

            this._editingItem.item.classList.remove('edit-item');
            this._editingItem = null;
        });
    }
    
    _finishUserItemEdit() {
        if (!this._editingItem.data) return;
        this._editingItem.item.innerHTML = this._editingItem.data;   
        this._editingItem.item.classList.remove('edit-item');
        this._editingItem = null;
    }

    addNewRow() {
        if (this._editingItem) {
            alert('Вы не закончили редактировать текущего пользователя.');
            return;
        }

        let newRow = new TableRow('', this.dates.length);
        newRow.appendTo(this.element);
        newRow.generateClick();
        this.rows.push(newRow);

        store.dispatch({
           type: 'ADD_NAME',
           payload: ''    
        });
    }

    // Очень сложная логика да
    update(dates) {
        // Если дата была удалена
        if (dates.length < this.dates.length) {
            const index = this.dates.findIndex(
                item => !dates.includes(item)
            );
            this.rows.forEach(row => row.deleteByIndex(index));
            // Ту-ту!!!!
            let element = this.header.element.firstElementChild.nextElementSibling;
            let i  = 0;
            while (i < index) {
                element = element.nextElementSibling;
                i += 1;
            }
            element.remove();
        // Если дата была добавлена
        } else if (dates.length > this.dates.length) {
            const element = dates.find(
                item => !this.dates.includes(item)
            );
            console.log(element);
            this.rows.forEach(row => row.appendNewItem());
            let item = new Node('div', {
                classList:  'table-header__item',
                textContent: element
            });
            item.appendIn(this.header);
        }
        this.dates = dates.slice(0);
    }
}


class ResultList extends Node {
    constructor(parentClass, dates) {
        super('div', {classList: `${parentClass}__table table`});
    }
}
class Page extends Node {
    constructor(instruction='') {
        super('main', {classList: 'app__content content'});

        this.insertHTML(`
        <section class="content__section description-section">
            <h1 class="description-section__title">Выбор даты</h1>
            <p class="description-section__subtitle">${instruction}</p>
        </section>
        `);

        // Смена темы
        const buttonTheme = new Button('content__theme-button button _theme-toggle', '');
        buttonTheme.appendIn(this);
        buttonTheme.addHandler('click', (event) => {
            if(document.documentElement.hasAttribute("theme")){
                document.documentElement.removeAttribute("theme");
            }
            else{
                document.documentElement.setAttribute("theme", "light");
            }
        });
    }
}

class Section extends Node {
    constructor(parentClass, sectionClass) {
        super('section', {classList: `${parentClass}__section ${sectionClass}`});
    }
}

class StartPage extends Page {
    constructor() {
        super();

        this.section = new Section('content', 'start-section');
        this.section.appendIn(this);

        this.startButton = new Button('start-section__button button', 'Начать');
        this.startButton.appendIn(this.section)
        this.startButton.addHandler('click', (event) => {
            window.router.go('/calendar');
        });
    }
}

class CalendarPage extends Page {
    constructor() {
        super('Шаг 1. Выберите даты в календаре для встречи.');

        this.section = new Section('content', 'calendar-section');
        this.section.appendIn(this);

        this.datesBlock = new DatesBlock('calendar-section');
        this.datesBlock.appendIn(this.section);
        store.subscribe((state) => {
            this.datesBlock.update(state.dates);
        });

        this.prevButton = new Button('calendar-section__prev-button button _mini', 'Назад');
        this.prevButton.appendIn(this.section)
        this.prevButton.addHandler('click', (event) => {
            window.router.go('/');
        });

        this.calendarBlock = new CalendarBlock('calendar-section');
        this.calendarBlock.start();
        this.calendarBlock.appendIn(this.section);

        this.nextButton = new Button('calendar-section__next-button button _mini', 'Далее');
        this.nextButton.appendIn(this.section)
        this.nextButton.addHandler('click', (event) => {
            let dates = store.state ? store.state.dates : [];
            if (dates.length > 0) window.router.go('/users');
            else alert('Нужно выбрать как минимум одну дату.');
        });
    }
}

class UsersPage extends Page {
    constructor() {
        super('Шаг 2. Добавьте пользователей.');

        this.section = new Section('content', 'users-section');
        this.section.appendIn(this);

        this.prevButton = new Button('users-section__prev-button button _mini', 'Назад');
        this.prevButton.appendIn(this.section)
        this.prevButton.addHandler('click', (event) => {
            window.router.go('/calendar');
        });

        this.centerColumn = new Node('div', {
            classList: 'users-section__center-column center-column'
        });
        this.centerColumn.appendIn(this.section);


        let dates = store.state ? store.state.dates : [];
        let names = store.state ? store.state.items : [];    
        this._table = new Table('users-section', names, dates);
        this._table.appendIn(this.centerColumn);

        this.nextButton = new Button('users-section__next-button button _mini', 'Далее');
        this.nextButton.appendIn(this.section)
        this.nextButton.addHandler('click', (event) => {
            let tableRows = this._table.element.querySelectorAll('.table-row');

            let results = [];
            for (let row of tableRows) {
                let array = Array
                    .from(row.querySelectorAll('.checkbox__input'))
                    .map(item => {
                        return item.checked;
                    });
                // console.log(array);
                // return array;
                //results.push(row.getBooleanArray());
                results.push(array);
            }
            console.log(results);

            // ;)))
            let dates = [];
            for (let j = 0; j < results[0].length; j++) {
                let answer = true
                for (let i = 0; i < results.length; i++) {
                    answer = answer && results[i][j];
                }
                dates.push(answer);
            }

            let goodDates = store.state.dates.filter((date, index) => {
                if (dates[index]) return date;
            });

            console.log(goodDates);
            window.sessionStorage.setItem('goodDates', goodDates);

            if (goodDates.length > 0) {
                window.router.go('/results');

            }
        });

        store.subscribe((state) => {
            this._table.update(state.dates);
        });


        this.bottomRow = new Node('div', {
            classList: 'center-column__bottom-row bottom-row'
        });
        this.bottomRow.appendIn(this.centerColumn);

        this.addButton = new Button('bottom-row__button button _transparent', 'Добавить');
        this.addButton.appendIn(this.bottomRow)
        this.addButton.addHandler('click', (event) => {
            this._table.addNewRow();
        });
    }
}

class ResultsPage extends Page {
    constructor() {
        super('Шаг 3. Посмотрите результат.');

        this.section = new Section('content', 'result-section');
        this.section.appendIn(this);

        this.prevButton = new Button('result-section__prev-button button _mini', 'Назад');
        this.prevButton.appendIn(this.section)
        this.prevButton.addHandler('click', (event) => {
            window.router.go('/users');
        });
    
        this.goodDates = new Node('div', {
            classList: 'result-section__good-dates good-dates'
        });
        this.goodDates.appendIn(this.section);
        
        this.datesList = new Node('ul', {classList: 'good-dates__list good-dates-list'});
        this.datesList.appendIn(this.goodDates);

        let dates = window.sessionStorage.getItem('goodDates').split(',');
        window.sessionStorage.clear();
        
        dates
            .forEach(date => {
                const item = new Node('li', {
                    classList: ' good-dates-list__item',
                    textContent: date
                });
                item.appendIn(this.datesList);
        });
    }
        
    show() {
        super.show();

        this.datesList.insertHTML('');

        let dates = window.sessionStorage.getItem('goodDates').split(',');
        window.sessionStorage.clear();
        
        dates
            .forEach(date => {
                const item = new Node('li', {
                    classList: ' good-dates-list__item',
                    textContent: date
                });
                item.appendIn(this.datesList);
            });
    }    
}
const store = createStore(reducer);
store.subscribe((state) => console.log(state));

console.log(store.state);

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

const router = new Router('.app');

router
    .use('/', StartPage)
    .use('/calendar', CalendarPage)
    .use('/users', UsersPage)
    .use('/results',ResultsPage)
    .start();

window.router = router;

window.router.go('/');
// window.router.go('#/calendar');