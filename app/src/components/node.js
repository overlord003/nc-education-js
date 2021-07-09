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

    appendTo(parent) {
        parent.append(this.element);
    }

    replaceIn(parent) {
        parent.innerHTML = '';
        this.appendTo(parent);
    }
}