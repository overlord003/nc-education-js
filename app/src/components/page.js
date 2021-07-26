class Page extends Node {
    constructor(instruction='') {
        super('main', {classList: 'app__content content'});

        this.insertHTML(`
        <section class="content__section description-section">
            <h1 class="description-section__title">Выбор даты</h1>
            <p class="description-section__subtitle">${instruction}</p>
        </section>
        `);
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
            alert('Посмотрите сами на табличку и проанализируйте!');
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