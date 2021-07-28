// Отслеживание размеров экрана - при изменении размеров
// вылезает окошко с размерами. Так же здесь использовался дебоунс

let sizeNotice = new Node('div', {
    classList: 'app__notice size-notice'
});
sizeNotice.appendTo(document.querySelector('.app')); 
sizeNotice.hide();


function debounce(f, t) {
    return function (args) {
        let previousCall = this.lastCall;
        this.lastCall = Date.now();
        if (previousCall && ((this.lastCall - previousCall) <= t)) {
            clearTimeout(this.lastCallTimer);
        }
        this.lastCallTimer = setTimeout(() => f(args), t);
    }
}

let showSize = event => {
    sizeNotice.insertText(`${document.documentElement.clientWidth}px x ${document.documentElement.clientHeight}px`, true);
    sizeNotice.show();

    setTimeout(() => sizeNotice.hide(), 1000);
};

let debouncedshowSize = debounce(showSize, 1001);

window.addEventListener('resize', debouncedshowSize);
