var findStoreById = function(id, tipo = ['hiper']){
	return LISTA_LOJAS.filter(loja => loja.id === id && tipo.includes(loja.tipo));
}

var findStoreByUf = function(uf = [], tipo = []){
	return LISTA_LOJAS.filter(loja => uf.includes(loja.uf.toUpperCase()) && ( tipo.length ? ( tipo.includes(loja.tipo) ? true : false ) : true ) );
}

var findStoresByBolsao = function(id, tipo = ['hiper']){

	const bolsao = LISTA_BOLSOES[id];
	var lojas = [];

	if ( bolsao ){
		bolsao.lojas.map(loja => {
			lojas = lojas.concat( findStoreById(loja, tipo) );
		})
	}

	return lojas;

};

var _getTodayTimestamp = function(){
	return + new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
}

var findCurrentOffers = function(){
	return LISTA_OFERTAS.filter(oferta => oferta.final >= _getTodayTimestamp());
};

var findCurrentOS = function(){

	function onlyUnique(value, index, self) { 
		return self.indexOf(value) === index;
	}

	var arr = [], offers = findCurrentOffers();
	offers.forEach(offer => arr.push(parseInt(offer.os)));
	return arr.sort().reverse().filter(onlyUnique);
}

