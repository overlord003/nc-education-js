let initialNames = window.localStorage.getItem('names');
let initialDates = window.localStorage.getItem('dates');

const initialState = {
	items: (initialNames === null || initialNames === '')  ? [] : initialNames.split(','),
	dates: (initialDates === null || initialDates === '') ? [] : initialDates.split(',')
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
				],
				dates: state.dates
			}
		}
		case 'RENAME_NAME': {
			return {
				...state,
				items: state
					.items
					.map(item => 
						item === payload.lastValue ? payload.newValue : item
					),
				dates: state.dates
			}
		}
		case 'REMOVE_NAME': {
			return {
				...state,
				items: state.items.filter((item) => item !== payload),
				dates: state.dates
			}
		}
		default:
			return state
	}
}

const createStore = (reducer) => {
	return {
		reducer,
		state: initialState,
		subscriptions: [],
		subscribe(subscription) {
			this.subscriptions.push(subscription)
		},
		dispatch(action) {
			this.state = this.reducer(this.state, action);
			
			window.localStorage.setItem('dates', this.state.dates);
			window.localStorage.setItem('names', this.state.items);

			//console.log(window.localStorage.dates);

			this.subscriptions.forEach((subscription) => subscription(this.state));
		},
		checkStore(checkedDate) {
			return (this.state) ? this.state.dates.includes(checkedDate) : false;
		},
		checkStoreNames(checkedName) {
			return (this.state) ? this.state.items.includes(checkedName) : false;
		}
	}
}