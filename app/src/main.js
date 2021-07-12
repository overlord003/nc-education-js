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