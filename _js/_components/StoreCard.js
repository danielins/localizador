class StoreCardClass extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			showingOffers: false
		}
	}

	getStoreDescription(tipo){
		switch(tipo){
			case 'market':
				return "Mercearia seca e molhada; açougue; bebidas; rotisseria; padaria; verduras, frutas e legumes; higiene e limpeza.";
				break;
			case 'express':
				return "Mercearia; bebidas; snacks; pães; frutas, verduras e legumes; itens prontos para o consumo; produtos de higiene.";
				break;
			case 'bairro':
				return "Mercearia completa; açougue; feira; bebidas; perfumaria; padaria; itens de higiene, limpeza e pet care. ";
				break;
			case 'posto':
				return "Combustíveis diversos; fluídos e óleos lubrificantes; produtos para cuidar do seu carro ou moto.";
				break;
			case 'drogaria':
				return "Medicamentos diversos; genéricos; cosméticos; descontos para cadastrados nos programas dos laboratórios.";
				break;
			case 'hiper':
			default:
				return "Mercearia completa; açougue; feira; padaria; bebidas; perfumaria; moda; eletro; itens para casa, carro e pet.";
				break;
		}
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
		if ( today >= offer.inicio && today <= offer.final ){
			return true;
		}
		return false;
	}

	titleCase(string){
		return string.split(" ").map(word => word.substr(0,1).toUpperCase()+word.substr(1,word.length).toLowerCase()).join(" ");
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

	getOfferUrl(offer){
		return `https://www.carrefour.com.br/tabloide-digital?paginas=${offer.oferta.paginas}&bolsao=${offer.bolsao}&os=${offer.oferta.os}&width=${offer.oferta.size.width}&height=${offer.oferta.size.height}`
	}

	createModalContent(){
		return (
			<div>
				<p class="txt-center">Escolha qual folheto deseja visualizar:</p>
				<ul class="offer__list">
					{ this.props.offersToShow.map(offer => (<li class="offer__item"><a class="bt bt-wide bt-theme--1" href={ this.getOfferUrl(offer) } target="_blank">{ offer.oferta.nome }</a></li>)) }
				</ul>
			</div>
		)
	}

	render(){

		const { loja } = this.props;
		const offersToShow = this.hasOffers(loja);

		return (
			<div class={`store-card ${ loja.tipo }`}>
				<div>
					<h3 class="store-card__title">
						{ loja.loja.replace('Carrefour', '').trim() }
					</h3>
					<p class="store-card__text">
						{ this.titleCase(loja.logradouro) }, { loja.numero }{ loja.complemento ? ` - ${loja.complemento}` : '' }<br/>
						{ loja.bairro ? `${loja.bairro} ` : ''}<br/>
						{loja.cidade} - {loja.uf}<br/>
						CEP: { loja.cep }<br/>
					</p>
					<div class="store-card__bt-container">
						{ offersToShow.length ?
							( offersToShow.length > 1
								? <button class="bt bt-theme--4" onClick={ () => this.props.openModal( this.createModalContent() ) }>
										Ver folhetos de ofertas
									</button>
								: <a href={ this.getOfferUrl(offersToShow[0]) } target="_blank" class="bt bt-theme--4">
									Ver folheto de ofertas
									</a>
							)
							: ''
						}
						<a class="bt bt-theme--5 mb0" href={`https://maps.google.com/?q=${ loja.logradouro }, ${ loja.numero }`} target="_blank">
							Ver mapa
						</a>
					</div>
					{ this.state.showingOffers &&
						<ul class="offer__list">
							{ this.props.offersToShow.map(offer => (<li class="offer__item"><a class="offer__link" href={ this.getOfferUrl(offer) } target="_blank">{ offer.oferta.nome }</a></li>)) }
						</ul>
					}
					<p class="store-card__text store-card__text--description">
						{ this.getStoreDescription(loja.tipo) }
					</p>
				</div>
			</div>
		);

	}

}

const StoreCardClass_mapStateToProps = state => {
	var { bolsoes, ofertas } = state;
	return { bolsoes, ofertas, offersToShow: [] };
}

const StoreCard = ReactRedux.connect(StoreCardClass_mapStateToProps)(StoreCardClass);