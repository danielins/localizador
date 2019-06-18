class GMap {

	constructor(lojas, ofertas, props){

		this.setDestination = props.setDestination;

		this.lojas = lojas;
		this.ofertas = ofertas;
		this.marcadores = {};

		this.INITIAL_CENTER = new google.maps.LatLng(-12.924874197441222, -52.589341558882325);

		this.CITY_ZOOM = 11;
		this.INITIAL_ZOOM = 5;
		this.MARKER_ZOOM = 18;

		this.OFFSETX = 350/2;

		this.INFOWINDOW_WIDTH = 300;

		this.STORE_FOUND = false;
		this.SEARCH_NEAREST_AFTER = false;

		this.iniciaMapa();

		this.buscaEnderecoCallback = this.buscaEnderecoCallback.bind(this);

	}

	iniciaMapa(){

		// Starts Map
		this.map = new google.maps.Map(document.querySelector('#map'), {
			center: this.INITIAL_CENTER,
			mapTypeControl: false,
			styles: [
				{
					"featureType": "all",
					"elementType": "labels",
					"stylers": [
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "poi.attraction",
					"elementType": "all",
					"stylers": [
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "poi.business",
					"elementType": "all",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "poi.government",
					"elementType": "all",
					"stylers": [
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "poi.school",
					"elementType": "all",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "poi.sports_complex",
					"elementType": "all",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				}
			],
			zoom: this.INITIAL_ZOOM
		});

		setTimeout(() => {
			if ( $(window).width() > 480 ){
				this.centralizaOffset(this.INITIAL_CENTER);
			} else {
				this.map.setCenter(this.INITIAL_CENTER);
			}
		}, 1000);

		this.geocoder = new google.maps.Geocoder();

		if ( this.lojas.length ){
			this.adicionaMarcadores();
			this.adicionaInfoWindow();
		}

	}

	adicionaMarcadores(){
		this.lojas.map(loja => this.adicionaMarcador(loja));
	}

	adicionaMarcador(loja){

		const that = this;

		let lat = parseFloat(loja.lat);
		let lng = parseFloat(loja.lng);
		let id = loja.id;

		if ( this.marcadores.hasOwnProperty(loja.id) ){
			lat = lat + 0.000020;
			lng = lng + 0.000020;
			id = `${loja.id}_${loja.tipo}`;
		}

		let novoMarcador = new google.maps.Marker({
			id,
			tipo: loja.tipo,
			animation: google.maps.Animation.DROP,
			map: this.map,
			title: loja.loja,
			position: { lat, lng },
			icon: this.iconeMarcadorPorTipo(loja.tipo)
		});

		novoMarcador.addListener('click', this.criaCallbackMarcador(loja, novoMarcador));

		this.marcadores[id] = novoMarcador;

	}

	criaCallbackMarcador(loja, marcador){
		const that = this;
		return function(){
			that.infoWindow.setContent(that.conteudoInfoWindow(loja));
			that.infoWindow.setOptions({maxWidth: that.INFOWINDOW_WIDTH});
			that.infoWindow.open(that.map, marcador);
			that.map.setZoom(that.MARKER_ZOOM);

			if ( $(window).width() > 480 ){
				that.map.setCenter(that.centralizaOffset(marcador.getPosition()));
			} else {
				that.map.setCenter(marcador.getPosition());
			}

			that.alternaAnimacao(marcador);
			that.setDestination(loja);
		}
	}

	disparaCliqueMarcador(marcadorId){
		if ( this.marcadores[marcadorId] ){
			new google.maps.event.trigger(this.marcadores[marcadorId], 'click');
			if ( $(window).width() < 480 ){
				$('html, body').animate({scrollTop: $('#map').offset().top}, 500);
			}
		}
	}

	buscaEndereco(address){
		const that = this;
		this.geocoder.geocode({ address }, this.buscaEnderecoCallback);
	}

	buscaMaisProximo(latlng){

		var closestDistance = null;
		var closestMarker = null;
		this.STORE_FOUND = false;

		for ( var id in this.marcadores ){

			let marcador = this.marcadores[id];
			let position = new google.maps.LatLng(marcador.getPosition().lat(), marcador.getPosition().lng());

			var distance = google.maps.geometry.spherical.computeDistanceBetween(latlng, position);

			if ( !isNaN(distance) ){
				if ( closestMarker === null || distance < closestDistance ){
					closestDistance = distance;
					closestMarker = marcador;
				}
			}

		}

		if ( Math.ceil(closestDistance/1000) < 600 ){
			this.disparaCliqueMarcador(closestMarker.id);
			this.STORE_FOUND = true;
		} else {
			alert('Sentimos muito. Nenhuma loja foi encontrada no radio de 600km de sua busca.');
		}

	}

	buscaEnderecoCallback(r){

		if ( !r[0] ){
			alert('Não foi possível pesquisar este local.');
			return false;
		}

		let lat = r[0].geometry.location.lat();
		let lng = r[0].geometry.location.lng();

		if ( r[0].types.indexOf('locality') > -1 ){
			this.map.setZoom(this.CITY_ZOOM);
		} else if ( r[0].types.indexOf('street_address') > -1 || r[0].types.indexOf('postal_code') > -1 ){
			this.map.setZoom(this.MARKER_ZOOM);
		}

		if ( $(window).width() > 480 ){
			this.centralizaOffset(new google.maps.LatLng(lat, lng));
			$('html, body').animate({scrollTop: $('#map').offset().top}, 500);
		} else {
			this.map.setCenter(new google.maps.LatLng(lat, lng));
		}

		if ( this.SEARCH_NEAREST_AFTER ){
			setTimeout(() => window.gmap.buscaMaisProximo(new google.maps.LatLng(lat, lng)), 100);
			this.SEARCH_NEAREST_AFTER = false;
		}

	}

	iconeMarcadorPorTipo(tipo){

		switch( tipo ){
			case 'express':
				return 'https://static.carrefour.com.br/imagens/localizador/_img/pin_express.png';
			break;
			case 'market':
			case 'bairro':
				return 'https://static.carrefour.com.br/imagens/localizador/_img/pin_market.png';
			break;
			case 'drogaria':
				return 'https://static.carrefour.com.br/imagens/localizador/_img/pin_drogaria.png';
			break;
			case 'posto':
				return 'https://static.carrefour.com.br/imagens/localizador/_img/pin_posto.png';
			break;
			default:
				return 'https://static.carrefour.com.br/imagens/localizador/_img/pin_hiper.png';
		}

	}

	alternaAnimacao(marcador){

		if ( this.currentBoucing ){
			marcador.setZIndex(9);
			this.currentBoucing.setAnimation(null);
		}

		marcador.setZIndex(99);
		marcador.setAnimation(google.maps.Animation.BOUNCE);
		this.currentBoucing = marcador;

	}

	adicionaInfoWindow(){

		this.infoWindow = new google.maps.InfoWindow();

	}

	centralizaOffset(latlng, offsetX = this.OFFSETX, offsetY = 0){

		var zoom = this.map.getZoom();
		var escala = Math.pow(2, zoom);

		var coordenadaGlobal = this.map.getProjection().fromLatLngToPoint(latlng);
		var pixelOffset = new google.maps.Point((offsetX/escala) || 0, (offsetY/escala) || 0);

		var novaCoordenadaGlobal = new google.maps.Point(
			coordenadaGlobal.x - pixelOffset.x,
			coordenadaGlobal.y + pixelOffset.y
		);

		var novoCentro = this.map.getProjection().fromPointToLatLng(novaCoordenadaGlobal);

		this.map.setCenter(novoCentro);
		this.map.setZoom(zoom);

	}

	conteudoInfoWindow(loja){

		return `
			<h3 class="info-window__title">${ loja.loja }</h3>
			<p class="info-window__text">
				${ loja.logradouro }, ${ loja.numero }${ loja.complemento ? ` - ${loja.complemento}` : '' }
			</p>
		`;

	}

	filtraMarcadores(filtros){

		for ( var id in this.marcadores ){
			let marcador = this.marcadores[id];
			marcador.setVisible(filtros.indexOf(marcador.tipo) >= 0 ? false : true);
		}

	}

	escondeTodosMarcadores(){
		for ( var id in this.marcadores ){
			let marcador = this.marcadores[id];
			marcador.setVisible(false);
		}
	}

	mostraTodosMarcadores(){
		for ( var id in this.marcadores ){
			let marcador = this.marcadores[id];
			marcador.setVisible(true);
		}
	}

	getLojaById(id, tipo){
		return this.lojas.filter(loja => id === loja.id);
	}

}