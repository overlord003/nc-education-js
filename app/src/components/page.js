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
            window.router.go('/calendar/');
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
            if (dates.length > 0) window.router.go('/users/');
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
            window.router.go('/calendar/');
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
            window.localStorage.setItem('goodDates', goodDates);

            window.router.go('/results/');
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
            window.router.go('/users/');
        });
    
        this.goodDates = new Node('div', {
            classList: 'result-section__good-dates good-dates'
        });
        this.goodDates.appendIn(this.section);
        
        this.datesList = new Node('ul', {classList: 'good-dates__list good-dates-list'});
        this.datesList.appendIn(this.goodDates);

        let dates = window.localStorage.getItem('goodDates');
        if (!dates) {
            new Node('li', {
                classList: 'good-dates-list__item',
                textContent: 'Нет возможных дат.'
            }).appendIn(this.datesList);
        } else {
            dates
                .split(',')
                .forEach(date => {
                    const item = new Node('li', {
                        classList: ' good-dates-list__item',
                        textContent: date
                    });
                    item.appendIn(this.datesList);
                });
        }
        window.localStorage.removeItem('goodDates');
    }
        
    show() {
        super.show();

        this.datesList.insertHTML('');

        let dates = window.localStorage.getItem('goodDates');
        if (!dates) {
            new Node('li', {
                classList: 'good-dates-list__item',
                textContent: 'Нет возможных дат.'
            }).appendIn(this.datesList);
        } else {
            dates
                .split(',')
                .forEach(date => {
                    const item = new Node('li', {
                        classList: ' good-dates-list__item',
                        textContent: date
                    });
                    item.appendIn(this.datesList);
                });
        }
        window.localStorage.removeItem('goodDates');
    }    
}