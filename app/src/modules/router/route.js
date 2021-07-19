export default class Route {
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
        // И тут
        return pathname === this._pathname;
    }

    render() {
        if (!this._block) {
            this._block = new this._blockClass();
            // Тут можно поправить
            this._block.appendTo(document.querySelector(this._props.rootQuery));
            return;
        }

        this._block.show();
    }
}