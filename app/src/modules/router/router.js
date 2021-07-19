import Route from './route';

export default class Router {
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