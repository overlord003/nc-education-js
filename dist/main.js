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
		case 'ADD_NAME': {
			return {
				...state,
				items: [
					...state.items,
					payload
				]
			}
		}
		case 'RENAME_NAME': {
			return {
				...state,
				items: state
					.items
					.map(item => 
						item === payload.lastValue ? payload.newValue : item
					)
			}
		}
		case 'REMOVE_NAME': {
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

        this.count = 0;

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
                    payload: this.formatDate(new Date(this.currentYear, this.currentMonth, +td.textContent))
                });
            } else {
                if (this.count > 5) {
                    alert('Превышено допустимое количество забронированных дат!');
                } else {
                    this.count += 1;
                    
                    td.classList.add('_booked');

                    store.dispatch({
                        type: 'ADD_DATE',
                        payload: this.formatDate(new Date(this.currentYear, this.currentMonth, +td.textContent))
                    });
                }
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

        this._prevButton = new Button('calendar-header__button', 'Пред.');
        this._nextButton = new Button('calendar-header__button', 'След.');
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

        // Создаем строчки
        this.rows = [];
        names.forEach(name => {
            let row = new TableRow(name, dates.length);
            row.appendTo(this.element);
            this.rows.push(row);

            store.dispatch({
                type: 'ADD_NAME',
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
            event.target.classList.add('selected')
        );

        this.addHandler('dragend', (event) =>
            event.target.classList.remove('selected')
        );

        this.addHandler('dragover', (event) => {
            event.preventDefault();

            let activeElement = this.element.querySelector('.selected');
            let currentElement = event.target.closest('.table-row');
            
            if (!currentElement) return;
            if (activeElement === currentElement) return;

            const nextElement = getNextElement(event.clientY, currentElement);
            this.element.insertBefore(activeElement, nextElement);
        });
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
    }
    
    _finishUserItemEdit(isOk=false) {
        if (isOk) {
            let newValue = this._editingItem.form.name;
            if (newValue) {
                this._editingItem.item.innerHTML = newValue;

                let lastValue = this._editingItem.data;
                store.dispatch({
                    type: 'RENAME_NAME',
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

    addNewRow() {
        if (this._editingItem) {
            alert('Попытался сломать? Фиг тебе! Сначала закончи с предыдущим пользователем.');
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
class Page extends Node {
    constructor(instruction='Создавайте таблицы и решайте, когда встретиться в друзьями!') {
        super('main', {classList: 'app__content content'});

        this.insertHTML(`
        <header class="content__description description">
            <h1 class="description__title">Выбор даты</h1>
            <p class="description__subtitle">${instruction}</p>
            <svg class="description__img" id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><g><circle cx="256" cy="256" fill="#ff5876" r="248"/><path d="m256 486c-133.952 0-243.081-106.205-247.82-239-.107 2.988-.18 5.986-.18 9 0 136.967 111.033 248 248 248s248-111.033 248-248c0-3.014-.073-6.012-.18-9-4.739 132.795-113.868 239-247.82 239z" fill="#e6485d"/><circle cx="256" cy="256" fill="#e4eef9" r="206.942"/><path d="m256 444.942c-111.274 0-202.022-87.828-206.736-197.942-.128 2.985-.207 5.983-.207 9 0 114.291 92.651 206.942 206.942 206.942s206.943-92.651 206.943-206.942c0-3.017-.079-6.015-.207-9-4.713 110.114-95.461 197.942-206.735 197.942z" fill="#d5e0f2"/><path d="m331.17 183.393c-5.899-5.818-15.396-5.752-21.213.146l-47.109 47.761c10.522 2.911 18.324 12.359 18.76 23.701l49.707-50.395c5.818-5.898 5.753-15.396-.145-21.213z" fill="#405b6c"/><path d="m230.367 256c0-11.14 7.109-20.617 17.036-24.151l-92.462-82.397c-6.186-5.512-15.667-4.966-21.178 1.219s-4.966 15.667 1.219 21.178l95.407 85.021c-.01-.289-.022-.578-.022-.87z" fill="#405b6c"/><circle cx="256" cy="256" fill="#ff5876" r="25.633"/><path d="m216.381 244.387 14.008 12.483c-.01-.29-.022-.578-.022-.87 0-11.14 7.109-20.617 17.036-24.151l-12.635-11.26c-8.792 5.283-15.446 13.747-18.387 23.798z" fill="#2d4456"/><path d="m274.758 219.224-11.91 12.075c10.522 2.911 18.324 12.359 18.76 23.701l13.128-13.31c-3.606-9.76-10.801-17.775-19.978-22.466z" fill="#2d4456"/><path d="m256 263.634c-10.989 0-20.36-6.917-24.005-16.634-1.051 2.801-1.629 5.832-1.629 9 0 14.157 11.477 25.634 25.633 25.634 14.157 0 25.634-11.477 25.634-25.634 0-3.168-.578-6.199-1.629-9-3.644 9.716-13.015 16.634-24.004 16.634z" fill="#e6485d"/></g><g><g><path d="m437.02 74.98c-48.353-48.351-112.639-74.98-181.02-74.98s-132.667 26.629-181.02 74.98c-48.352 48.353-74.98 112.64-74.98 181.02 0 65.664 24.828 128.099 69.909 175.802 2.851 3.017 7.608 3.15 10.623.3 3.017-2.851 3.151-7.607.3-10.623-42.434-44.902-65.803-103.67-65.803-165.479 0-64.366 25.065-124.879 70.578-170.392 45.514-45.514 106.027-70.579 170.393-70.579s124.879 25.065 170.392 70.579c45.513 45.513 70.578 106.026 70.578 170.392s-25.066 124.879-70.578 170.392c-45.513 45.514-106.026 70.579-170.392 70.579-56.111 0-110.745-19.706-153.838-55.487-3.193-2.651-7.93-2.212-10.582.981-2.651 3.193-2.211 7.931.981 10.582 45.785 38.016 103.828 58.953 163.439 58.953 68.381 0 132.667-26.629 181.02-74.98 48.352-48.353 74.98-112.64 74.98-181.02s-26.628-132.667-74.98-181.02z"/><path d="m402.975 109.552c2.833-3.033 2.67-7.789-.363-10.621-39.909-37.269-91.977-57.793-146.612-57.793-57.391 0-111.348 22.349-151.93 62.932s-62.932 94.538-62.932 151.93 22.349 111.348 62.932 151.931 94.539 62.931 151.93 62.931 111.348-22.349 151.931-62.931 62.931-94.539 62.931-151.931c0-49.329-16.259-95.72-47.02-134.156-2.594-3.241-7.323-3.766-10.563-1.172-3.24 2.593-3.764 7.322-1.171 10.562 28.605 35.743 43.724 78.886 43.724 124.766 0 110.188-89.645 199.833-199.833 199.833s-199.832-89.645-199.832-199.833 89.645-199.833 199.833-199.833c50.813 0 99.238 19.088 136.354 53.748 3.035 2.835 7.791 2.67 10.621-.363z"/><path d="m263.515 98.649v-23.277c0-4.15-3.364-7.515-7.515-7.515s-7.515 3.365-7.515 7.515v23.276c0 4.15 3.364 7.515 7.515 7.515s7.515-3.364 7.515-7.514z"/><path d="m248.485 413.351v23.276c0 4.15 3.364 7.515 7.515 7.515s7.515-3.365 7.515-7.515v-23.276c0-4.15-3.364-7.515-7.515-7.515s-7.515 3.365-7.515 7.515z"/><path d="m436.627 263.515c4.151 0 7.515-3.365 7.515-7.515s-3.364-7.515-7.515-7.515h-23.276c-4.151 0-7.515 3.364-7.515 7.515s3.364 7.515 7.515 7.515z"/><path d="m75.373 248.485c-4.151 0-7.515 3.364-7.515 7.515s3.364 7.515 7.515 7.515h23.276c4.151 0 7.515-3.365 7.515-7.515s-3.364-7.515-7.515-7.515z"/><path d="m357.588 351.146c3.161 2.659 7.908 2.269 10.588-.921 2.669-3.178 2.256-7.918-.921-10.587l-81.672-68.603c2-3.919 3.245-8.283 3.539-12.904l47.69-48.35c8.687-8.451 8.585-23.551-.219-31.882-8.432-8.714-23.553-8.576-31.882.219l-44.363 44.977c-3.606-.495-7.485-.355-11.013.378l-89.594-79.841c-8.887-8.252-23.953-7.381-31.831 1.833-8.269 9.28-7.447 23.559 1.833 31.829l43.357 38.636c3.1 2.762 7.847 2.488 10.611-.61 2.761-3.098 2.487-7.849-.611-10.61l-43.355-38.635c-3.094-2.757-3.368-7.517-.611-10.61 2.624-3.072 7.653-3.36 10.61-.611l84.956 75.708c-3.875 3.25-6.996 7.368-9.068 12.05l-20.094-17.906c-3.098-2.762-7.849-2.488-10.61.611-2.761 3.098-2.487 7.849.611 10.61l27.576 24.573c2.204 16.183 16.106 28.698 32.885 28.698 7.467 0 14.364-2.479 19.916-6.655zm-42.175-162.473c2.777-2.934 7.809-2.968 10.627-.072 2.936 2.777 2.969 7.81.072 10.627l-40.747 41.311c-2.385-4.51-5.777-8.407-9.876-11.39zm-59.413 85.496c-10.019 0-18.169-8.151-18.169-18.169s8.151-18.169 18.169-18.169c10.019 0 18.169 8.151 18.169 18.169s-8.15 18.169-18.169 18.169z"/></g></g></g></svg>
        </header>
        `);
    }
}

class Section extends Node {
    constructor(parentClass, sectionClass) {
        super('section', {classList: `${parentClass}__${sectionClass} ${sectionClass}`});
    }
}

class StartPage extends Page {
    constructor() {
        super('Нажмите на кнопку "Начать".');

        this.section = new Section('content', 'start-section');
        this.section.appendIn(this);

        this.startButton = new Button('start-section__button', 'Начать');
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

        this.calendarBlock = new CalendarBlock('calendar-section');
        this.calendarBlock.start();
        this.calendarBlock.appendIn(this.section);

        this.datesBlock = new DatesBlock('calendar-section');
        this.datesBlock.appendIn(this.section);

        store.subscribe((state) => {
            this.datesBlock.update(state.dates);
        });

        this.prevButton = new Button('calendar-section__prev-button', 'Назад');
        this.prevButton.appendIn(this.section)
        this.prevButton.addHandler('click', (event) => {
            window.router.go('/');
        });

        this.nextButton = new Button('calendar-section__next-button', 'Далее');
        this.nextButton.appendIn(this.section)
        this.nextButton.addHandler('click', (event) => {
            let dates = store.state ? store.state.dates : [];
            if (dates.length > 0) window.router.go('/users');
            else alert('Выберите хоть какие-то даты.');
        });
    }
}

class UsersPage extends Page {
    constructor() {
        super('Шаг 2. Добавьте пользователей.');

        this.section = new Section('content', 'users-section');
        this.section.appendIn(this);

        let dates = store.state ? store.state.dates : [];
        let names = ['Christina', 'Nikita', 'Mark', 'Sofia'];
        this._table = new Table('users-section', names, dates);
        this._table.appendIn(this.section);

        this.prevButton = new Button('users-section__prev-button', 'Назад');
        this.prevButton.appendIn(this.section)
        this.prevButton.addHandler('click', (event) => {
            window.router.go('/calendar');
        });

        this.nextButton = new Button('users-section__next-button', 'Далее');
        this.nextButton.appendIn(this.section)
        this.nextButton.addHandler('click', (event) => {
            alert('Посмотрите сами на табличку и проанализируйте!');
        });

        store.subscribe((state) => {
            this._table.update(state.dates);
        });

        this.addButton = new Button('users-section__add-button', 'Добавить');
        this.addButton.appendIn(this.section)
        this.addButton.addHandler('click', (event) => {
            this._table.addNewRow();
        });
    }
}
const store = createStore(reducer);
store.subscribe((state) => console.log(state));

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

const router = new Router('.app');

router
    .use('/', StartPage)
    .use('/calendar', CalendarPage)
    .use('/users', UsersPage)
    .start();

window.router = router;

window.router.go('/');