const initialState = {
	items: [],
	dates: []
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
				]
			}
		}
		case 'RENAME_NAME': {
			return {
				...state,
				items: state
					.items
					.map(item => 
						item === payload.lastValue ? payload.newValue : item
					)
			}
		}
		case 'REMOVE_NAME': {
			return {
				...state,
				items: state.items.filter((item) => item !== payload)
			}
		}
		default:
			return state
	}
}

const createStore = (reducer) => {
	return {
		reducer,
		state: undefined,
		subscriptions: [],
		subscribe(subscription) {
			this.subscriptions.push(subscription)
		},
		dispatch(action) {
			this.state = this.reducer(this.state, action)
			this.subscriptions.forEach((subscription) => subscription(this.state))
		},
		checkStore(checkedDate) {
			return (this.state) ? this.state.dates.includes(checkedDate) : false;
		}
	}
}