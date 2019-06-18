/**
 * LOCALIZADOR DE LOJAS
 * Requer: React, ReactDOM, Redux, ReactRedux, jQuery, GoogleMaps
 * Compilado usando Prepos
 */

//@prepros-prepend _redux/_state/state.js
//@prepros-prepend _redux/_actions/index.js
//@prepros-prepend _redux/_reducers/index.js
//@prepros-prepend _components/Modal.js
//@prepros-prepend _components/StoreCard.js
//@prepros-prepend _components/OfferCard.js
//@prepros-prepend _components/StoreList.js
//@prepros-prepend _components/Form.js
//@prepros-prepend _components/Mapa.js
//@prepros-prepend _components/Header.js
//@prepros-prepend _components/App.js

const store = Redux.createStore(APP_REDUCER);

/**
 * Código de versão para acompanhamento
 * [DD][MM].[HH][MM]
 */
const version = 2911.1133;
/**
 * Ao compilar, setar false para compilar Localizador de Lojas
 * ou setar true para compilar Localizadr de Ofertas
 */
const isOffer = false;

setTimeout(() => ReactDOM.render(
	<ReactRedux.Provider store={ store }>
		<App isOffer={ isOffer } />
	</ReactRedux.Provider>,
	document.querySelector('#app')
), 100);