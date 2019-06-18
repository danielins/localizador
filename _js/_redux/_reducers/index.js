const lojasReducer = function(state = INITIAL_LOJAS_STATE, action){
	return state;
}

const ofertasReducer = function(state = INITIAL_OFERTAS_STATE, action){
	return state;
}

const uiReducer = function(state = INITIAL_UI_STATE, action){
	switch ( action.type ){
		case 'SET_LOJA':
			return $.extend({}, state, {
				loja: action.loja
			});
		break;
		default:
			return state;
	}
}

const bolsoesReducer = function(state = INITIAL_BOLSOES_STATE, action){
	return state;
}

const APP_REDUCER = Redux.combineReducers({
	bolsoes: bolsoesReducer,
	lojas: lojasReducer,
	ofertas: ofertasReducer,
	ui: uiReducer
});