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