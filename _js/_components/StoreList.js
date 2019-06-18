class StoreListClass extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			lojas: props.lojas
		}

	}

	componentDidMount(){

		const that = this;
		let { lojas } = this.props;

		if ( navigator.geolocation ) {

			let success = pos => {

				// Objeto com as coordenadas do usuario
				const startingPoint = {
					lat: pos.coords.latitude,
					lng: pos.coords.longitude
				};

				// Algoritmo para calcular distancia entre coordenada do usuario e coordenada da loja
				let calculateDistance = function(store){

					var radlat1 = Math.PI * startingPoint.lat/180;
					var radlat2 = Math.PI * store.lat/180;
					var radlon1 = Math.PI * startingPoint.lng/180;
					var radlon2 = Math.PI * store.lng/180;

					var theta = startingPoint.lng-store.lng;

					var radtheta = Math.PI * theta/180;

					var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					dist = Math.acos(dist);
					dist = dist * 180/Math.PI;
					dist = dist * 60 * 1.1515;
					dist = dist * 1.609344;

					return dist;

				}

				// Adiciona distancia no objeto de lojas
				for (let i = 0; i < lojas.length; i++){
					lojas[i].distancia = calculateDistance(lojas[i]);
				}

				// Ordena lojas pela distancia
				lojas.sort((a, b) => a.distancia - b.distancia);

				this.setState({ lojas });

			};

			navigator.geolocation.getCurrentPosition(success, console.warn('geolocation disabled'));

		}

		$(window).scroll(function(){

			$('img.lazy-load').each(function(){
				if ( that.isScrolledIntoView($(this)) ){

					var img = new Image();
					img.onload = () => {
						$(this).attr('src', $(this).attr('data-src'));
						$(this).css('opacity', '1');
					}
					img.src = $(this).attr('data-src');
				}
			});

		});

		setTimeout(() => $(window).trigger('scroll'), 100);

	}

	isScrolledIntoView(elem) {
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();
		var elemTop = $(elem).offset().top;
		var elemBottom = elemTop + ($(elem).height()/2);
		return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}


	getTodayTimestamp(){
		return + new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
	}

	fixedTimestamp(timestamp){
		let date = new Date(timestamp);
		date.setDate(date.getDate()-1);
		return + new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}


	isValidOffer(offer){
		const today = this.getTodayTimestamp();
		if ( today >= this.fixedTimestamp(offer.inicio) && today <= offer.final ){
			return true;
		}
		return false;
	}


	hasOffers(store){

		var offerFound = false;
		const { ofertas, bolsoes } = this.props;
		var offersToShow = [];

		if ( ofertas.length === 0 ){ return offerFound; }

		ofertas.map(oferta => {
			if ( !this.isValidOffer(oferta) ) { return false; }
			oferta.bolsoes.map(bolsao => {
				if ( bolsoes[bolsao] && oferta.bolsoes.indexOf(bolsao) >= 0 && bolsoes[bolsao].lojas.indexOf(store.id) >= 0 && oferta.tipo.includes(store.tipo) ) {
					offersToShow.push({bolsao: bolsoes[bolsao].bolsao, oferta});
					offerFound = true;
				}
			});
		});

		this.props.offersToShow = offersToShow;

		if ( offerFound ){
			return offersToShow;
		} else {
			return [];
		}

	}


	render(){

		const that = this;
		const { lojas } = this.state;
		const filterStores = this.props.applyFilter;

		var offerCount = 0;
		if ( this.props.isOffer ){
			lojas.filter(filterStores).map(loja => offerCount += this.hasOffers(loja).length);
		}
		const storeCount = lojas.filter(filterStores).length;

		const counter = this.props.isOffer ? offerCount : storeCount;

		setTimeout(() => $(window).trigger('scroll'), 100);

		return(

			<section class="store-list">
				
				<h2 class="store-list__count txt-center">
					{
						<div>
							<strong>{ counter ? counter : '' }</strong>
							{
								counter ?
									( this.props.isOffer
									  ? (counter === 1 ? ' folheto encontrado' : ` folhetos encontrados`)
									  : (counter === 1 ? ' loja encontrada' : ` lojas encontradas`)
									)
								:
								this.props.isOffer ? `Nenhum folheto encontrado.` : `Nenhuma loja encontrada.`
							}
						</div>
					}
				</h2>
				
				{
					storeCount &&
					<div>
						{
							this.props.isOffer
							? lojas.filter(filterStores).map(function(loja){
								var offers = that.hasOffers(loja);
								
								if ( offers.length ){
									return (
										<span>
										{ offers.map(function(offer){
												return (
													<OfferCard loja={ loja } offer={ offer }/>
												);
											})
										}
										</span>
									);
								}
							})
							: lojas.filter(filterStores).map(loja => <StoreCard openModal={ this.props.openModal } loja={ loja } />)
						}

					</div>
				}
			</section>

		);

	}

}

const StoreList_mapStateToProps = state => {

	var { lojas, bolsoes, ofertas } = state;

	return { bolsoes, ofertas, lojas: lojas.map(loja => Object.assign(loja, {distancia: null})) };

}


const StoreList = ReactRedux.connect(StoreList_mapStateToProps)(StoreListClass);