// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/components/node.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Node = /*#__PURE__*/function () {
  function Node(tag, _ref) {
    var _this = this;

    var _ref$classList = _ref.classList,
        classList = _ref$classList === void 0 ? '' : _ref$classList,
        _ref$textContent = _ref.textContent,
        textContent = _ref$textContent === void 0 ? '' : _ref$textContent,
        _ref$attributes = _ref.attributes,
        attributes = _ref$attributes === void 0 ? {} : _ref$attributes;

    _classCallCheck(this, Node);

    this.element = document.createElement(tag);
    this.element.className = classList;
    this.element.textContent = textContent;
    Object.entries(attributes).forEach(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          key = _ref3[0],
          value = _ref3[1];

      return _this.element.setAttribute(key, value);
    });
  }

  _createClass(Node, [{
    key: "addHandler",
    value: function addHandler(event, callback) {
      this.element.addEventListener(event, callback);
    }
  }, {
    key: "removeHandler",
    value: function removeHandler(event, callback) {
      this.element.removeEventListener(event, callback);
    }
  }, {
    key: "addClass",
    value: function addClass(addedClass) {
      this.element.classList.add(addedClass);
    }
  }, {
    key: "removeClass",
    value: function removeClass(removedClass) {
      this.element.classList.remove(removedClass);
    }
  }, {
    key: "appendIn",
    value: function appendIn(parent) {
      var replacement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (replacement) {
        parent.innerHTML = '';
      }

      parent.element.append(this.element);
    }
  }, {
    key: "appendTo",
    value: function appendTo(parent) {
      var replacement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (replacement) {
        parent.innerHTML = '';
      }

      parent.append(this.element);
    }
  }, {
    key: "insertText",
    value: function insertText(text) {
      var replacement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (replacement) {
        this.element.innerHTML = '';
      }

      this.element.textContent = text;
    }
  }, {
    key: "insertHTML",
    value: function insertHTML(html) {
      this.element.innerHTML = html;
    }
  }, {
    key: "setFocus",
    value: function setFocus() {
      var focus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (focus) {
        this.element.focus();
      } else {
        this.element.blur();
      }
    }
  }, {
    key: "show",
    value: function show() {
      this.element.style.display = 'block';
    }
  }, {
    key: "hide",
    value: function hide() {
      this.element.style.display = 'none';
    }
  }]);

  return Node;
}();

exports.default = Node;
},{}],"src/components/button.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _node = _interopRequireDefault(require("./node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Button = /*#__PURE__*/function (_Node) {
  _inherits(Button, _Node);

  var _super = _createSuper(Button);

  function Button(classList, textContent) {
    _classCallCheck(this, Button);

    return _super.call(this, 'button', {
      classList: classList,
      textContent: textContent
    });
  }

  return Button;
}(_node.default);

exports.default = Button;
},{"./node":"src/components/node.js"}],"src/components/calendar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _node = _interopRequireDefault(require("./node"));

var _button = _interopRequireDefault(require("./button"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import initialState from '../store/store';
// import createStore from '../store/store';
// import reducer from '../store/store';
var initialState = {
  items: [],
  dates: []
};

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      payload = action.payload;

  switch (type) {
    case 'ADD_DATE':
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          items: state.items,
          dates: [].concat(_toConsumableArray(state.dates), [payload])
        });
      }

    case 'REMOVE_DATE':
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          items: state.items,
          dates: state.dates.filter(function (date) {
            return date !== payload;
          })
        });
      }

    case 'ADD':
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          items: [].concat(_toConsumableArray(state.items), [payload])
        });
      }

    case 'RENAME':
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          items: state.items.map(function (item) {
            return item === payload.lastValue ? payload.newValue : item;
          })
        });
      }

    case 'REMOVE':
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          items: state.items.filter(function (item) {
            return item !== payload;
          })
        });
      }

    default:
      return state;
  }
};

var createStore = function createStore(reducer) {
  return {
    reducer: reducer,
    state: undefined,
    subscriptions: [],
    subscribe: function subscribe(subscription) {
      this.subscriptions.push(subscription);
    },
    dispatch: function dispatch(action) {
      var _this = this;

      this.state = this.reducer(this.state, action);
      this.subscriptions.forEach(function (subscription) {
        return subscription(_this.state);
      });
    },
    checkStore: function checkStore(checkedDate) {
      return this.state ? this.state.dates.includes(checkedDate) : false;
    }
  };
};

var SimpleTable = /*#__PURE__*/function (_Node) {
  _inherits(SimpleTable, _Node);

  var _super = _createSuper(SimpleTable);

  function SimpleTable(classList) {
    var _this2;

    var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, SimpleTable);

    _this2 = _super.call(this, 'table', {
      classList: classList
    });
    _this2._classList = classList; // Создаем заголовки таблицы

    _this2._header = new _node.default('tr', {
      classList: "".concat(classList, "__th")
    });

    _this2._header.appendIn(_assertThisInitialized(_this2));

    headers.forEach(function (header) {
      return new _node.default('th', {
        textContent: header
      }).appendTo(_this2._header.element);
    });
    _this2._rows = [];
    return _this2;
  } // Создаем новую строчку таблицы


  _createClass(SimpleTable, [{
    key: "createRow",
    value: function createRow() {
      var _this3 = this;

      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var columns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var row = new _node.default('tr', {
        classList: "".concat(this._classList, "__tr ").concat(this._classList, "-tr")
      });
      row.appendIn(this);

      if (values.length < columns) {
        values = [].concat(_toConsumableArray(values), _toConsumableArray(new Array(columns - values.length).fill({
          text: '',
          modificator: '_disabled'
        })));
      }

      values.forEach(function (value) {
        new _node.default('td', {
          textContent: value.text,
          classList: "".concat(_this3._classList, "-tr__td ").concat(value.modificator)
        }).appendTo(row.element);
      });

      this._rows.push(row);
    }
  }, {
    key: "removeRows",
    value: function removeRows() {
      this._rows.forEach(function (row) {
        return row.element.remove();
      });
    }
  }]);

  return SimpleTable;
}(_node.default);

var Calendar = /*#__PURE__*/function (_SimpleTable) {
  _inherits(Calendar, _SimpleTable);

  var _super2 = _createSuper(Calendar);

  function Calendar() {
    var _this4;

    var classList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var store = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, Calendar);

    _this4 = _super2.call(this, classList, ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']);
    _this4.currentYear = 2021;
    _this4.currentMonth = 7;
    _this4.store = store;

    _this4.element.onclick = function (event) {
      var td = event.target.closest('td');
      if (!td) return;
      if (!_this4.element.contains(td)) return;

      if (td.classList.contains('_disabled')) {
        return;
      } else if (td.classList.contains('_booked')) {
        td.classList.remove('_booked');

        _this4.store.dispatch({
          type: 'REMOVE_DATE',
          payload: _this4.formatDate(new Date(_this4.currentYear, _this4.currentMonth, +td.textContent))
        });
      } else {
        td.classList.add('_booked');

        _this4.store.dispatch({
          type: 'ADD_DATE',
          payload: _this4.formatDate(new Date(_this4.currentYear, _this4.currentMonth, +td.textContent))
        });
      }
    };

    return _this4;
  }

  _createClass(Calendar, [{
    key: "createCalendar",
    value: function createCalendar(year, month) {
      this.removeRows();
      this.currentYear = year;
      this.currentMonth = month;
      var mon = month - 1;
      var d = new Date(year, mon);
      var values = [];

      for (var i = 0; i < this._getDay(d); i++) {
        values.push({
          text: '',
          modificator: '_disabled'
        });
      }

      while (d.getMonth() == mon) {
        values.push({
          text: d.getDate(),
          modificator: this.store.checkStore(this.formatDate(new Date(this.currentYear, this.currentMonth, d.getDate()))) ? '_booked' : ''
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
  }, {
    key: "next",
    value: function next() {
      this.currentMonth += 1;

      if (this.currentMonth === 13) {
        this.currentMonth = 1;
        this.currentYear += 1;
      }

      this.createCalendar(this.currentYear, this.currentMonth);
    }
  }, {
    key: "prev",
    value: function prev() {
      this.currentMonth -= 1;

      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear -= 1;
      }

      this.createCalendar(this.currentYear, this.currentMonth);
    }
  }, {
    key: "formatDate",
    value: function formatDate(date) {
      var dd = date.getDate();
      if (dd < 10) dd = '0' + dd;
      var mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      var yy = date.getFullYear() % 100;
      if (yy < 10) yy = '0' + yy;
      return dd + '.' + mm + '.' + yy;
    }
  }, {
    key: "_getDay",
    value: function _getDay(date) {
      var day = date.getDay();
      return day === 0 ? 6 : day - 1;
    }
  }]);

  return Calendar;
}(SimpleTable);

var CalendarBlock = /*#__PURE__*/function (_Node2) {
  _inherits(CalendarBlock, _Node2);

  var _super3 = _createSuper(CalendarBlock);

  function CalendarBlock() {
    var _this5;

    _classCallCheck(this, CalendarBlock);

    var store = createStore(reducer); //this.store.subscribe((state) => console.log(state));

    _this5 = _super3.call(this, 'div', {
      classList: 'content__calendar calendar'
    }); // Навигационный блок с кнопками переключателями и заголовком текущего месяца

    _this5._header = new _node.default('header', {
      classList: 'calendar__header calendar-header'
    });

    _this5._header.appendIn(_assertThisInitialized(_this5));

    _this5._prevButton = new _button.default('calendar-header__button', 'Пред.');
    _this5._nextButton = new _button.default('calendar-header__button', 'След.');
    _this5._title = new _node.default('h2', {
      classList: 'calendar-header__title'
    });

    _this5._prevButton.appendIn(_this5._header);

    _this5._title.appendIn(_this5._header);

    _this5._nextButton.appendIn(_this5._header); // Календарный блок


    _this5._calendar = new Calendar('calendar-table', store);

    _this5._calendar.addClass('calendar__calendar-table');

    _this5._calendar.appendIn(_assertThisInitialized(_this5));

    return _this5;
  } // Активируем календарь - вешаем обработчики, наполняем его смыслом...


  _createClass(CalendarBlock, [{
    key: "start",
    value: function start() {
      var _this6 = this;

      var currentDate = new Date();

      this._calendar.createCalendar(currentDate.getFullYear(), currentDate.getMonth());

      this._updateTitle();

      this._prevButton.addHandler('click', function () {
        _this6._calendar.prev();

        _this6._updateTitle();
      });

      this._nextButton.addHandler('click', function () {
        _this6._calendar.next();

        _this6._updateTitle();
      });
    }
  }, {
    key: "_updateTitle",
    value: function _updateTitle() {
      this._title.insertText("".concat(this._calendar.currentMonth, " ").concat(this._calendar.currentYear), true);
    }
  }]);

  return CalendarBlock;
}(_node.default);

exports.default = CalendarBlock;
},{"./node":"src/components/node.js","./button":"src/components/button.js"}],"src/components/page.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _node = _interopRequireDefault(require("./node"));

var _calendar = _interopRequireDefault(require("./calendar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Page = /*#__PURE__*/function (_Node) {
  _inherits(Page, _Node);

  var _super = _createSuper(Page);

  function Page() {
    _classCallCheck(this, Page);

    return _super.call(this, 'main', {
      classList: 'app__content content'
    });
  }

  return Page;
}(_node.default);

var CalendarPage = /*#__PURE__*/function (_Page) {
  _inherits(CalendarPage, _Page);

  var _super2 = _createSuper(CalendarPage);

  function CalendarPage() {
    var _this;

    _classCallCheck(this, CalendarPage);

    _this = _super2.call(this);
    _this.booking = new _calendar.default();

    _this.booking.start(); // this.buttonNext = new Button('button', 'Далее');
    // this.buttonNext.addHandler('click', () => window.router.go('/users'));


    _this.booking.appendIn(_assertThisInitialized(_this)); // this.buttonNext.appendIn(this);


    return _this;
  }

  return CalendarPage;
}(Page); // class UsersPage extends Page {
//     constructor() {
//         super('Шаг 2. Управляйте людьми.');
//         this._wrapper = new Node('div', {});
//         let dates = store.state ? store.state.dates : [];
//         this._table = new Table(dates, ['Christina', 'Nikita', 'Mark', 'Sofia'], dates.length);
//         this._table.appendIn(this._wrapper);
//         this._button = new Button('button', 'Добавить');
//         this._button.appendIn(this._wrapper);
//         this._button.addHandler('click', () => this._table.addNewRow(dates.length));
//         this.buttonPrev = new Button('button', 'Назад');
//         this.buttonPrev.addHandler('click', () => window.router.go('/'));
//         this._wrapper.appendIn(this);
//         this.buttonPrev.appendIn(this);
//     }
// }


exports.default = CalendarPage;
},{"./node":"src/components/node.js","./calendar":"src/components/calendar.js"}],"src/modules/router/route.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Route = /*#__PURE__*/function () {
  function Route(pathname, view, props) {
    _classCallCheck(this, Route);

    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  _createClass(Route, [{
    key: "leave",
    value: function leave() {
      if (this._block) {
        this._block.hide();
      }
    }
  }, {
    key: "match",
    value: function match(pathname) {
      // И тут
      return pathname === this._pathname;
    }
  }, {
    key: "render",
    value: function render() {
      if (!this._block) {
        this._block = new this._blockClass(); // Тут можно поправить

        this._block.appendTo(document.querySelector(this._props.rootQuery));

        return;
      }

      this._block.show();
    }
  }]);

  return Route;
}();

exports.default = Route;
},{}],"src/modules/router/router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _route = _interopRequireDefault(require("./route"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Router = /*#__PURE__*/function () {
  function Router(rootQuery) {
    _classCallCheck(this, Router);

    // singleton
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = []; // Список страниц и соответстующих им отображаемых компонент

    this.history = window.history;
    this._currentRoute = null; // Текущая отражаемая страница (если так можно выразиться)

    this._rootQuery = rootQuery;
    Router.__instance = this;
  } // Регестрируем, какой блок отображается по какой ссылке
  // /calendar - new Booking
  // /table - new Table
  // и т. д.


  _createClass(Router, [{
    key: "use",
    value: function use(pathname, block) {
      // по сути - регистрация страницы
      var route = new _route.default(pathname, block, {
        rootQuery: this._rootQuery
      });
      this.routes.push(route); // for chaining

      return this;
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      window.onpopstate = function (event) {
        // Событие popstate отсылается объекту window каждый раз, когда активная
        // запись истории меняется с одной на другую для одного и того же документа.
        console.log("onpopstate");
        console.dir({
          event: event
        });

        _this._onRoute(event.currentTarget.location.pathname);
      }.bind(this);

      this._onRoute(window.location.pathname);
    }
  }, {
    key: "_onRoute",
    value: function _onRoute(pathname) {
      // Получаем текущую страницу+ее компоненту по pathname
      var route = this.getRoute(pathname);

      if (!route) {
        return;
      }

      console.log('_onRoute', this._currentRoute, this._rootQuery); // Обрабатываем что-то непонятное

      if (this._currentRoute && this._currentRoute !== route) {
        this._currentRoute.leave();
      } // Меняем роутер


      this._currentRoute = route;
      route.render(route, pathname);
    } // Перейти на текущую страницу

  }, {
    key: "go",
    value: function go(pathname) {
      this.history.pushState({}, '', pathname);

      this._onRoute(pathname);
    } // Путешествие по истории вперед-назад...

  }, {
    key: "back",
    value: function back() {
      this.history.back();
    }
  }, {
    key: "forward",
    value: function forward() {
      this.history.forward();
    } // Получить текущую страницу 

  }, {
    key: "getRoute",
    value: function getRoute(pathname) {
      return this.routes.find(function (route) {
        return route.match(pathname);
      });
    }
  }]);

  return Router;
}();

exports.default = Router;
},{"./route":"src/modules/router/route.js"}],"src/modules/router/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Router", {
  enumerable: true,
  get: function () {
    return _router.default;
  }
});
Object.defineProperty(exports, "Route", {
  enumerable: true,
  get: function () {
    return _route.default;
  }
});

var _router = _interopRequireDefault(require("./router"));

var _route = _interopRequireDefault(require("./route"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./router":"src/modules/router/router.js","./route":"src/modules/router/route.js"}],"src/main.js":[function(require,module,exports) {
"use strict";

var _page = _interopRequireDefault(require("./components/page"));

var _router = require("./modules/router");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _router.Router('.app');
router.use('/', _page.default) //.use('/users', UsersPage)
// .use('/', UsersPage)
.start();
window.router = router;
window.router.go('/');
},{"./components/page":"src/components/page.js","./modules/router":"src/modules/router/index.js"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "35311" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/main.js"], null)
//# sourceMappingURL=/main.1e43358e.js.map