class OfferCardClass extends React.Component {

	constructor(props){
		super(props);
	}

	titleCase(string){
		return string.split(" ").map(word => word.substr(0,1).toUpperCase()+word.substr(1,word.length).toLowerCase()).join(" ");
	}

	_addDecimal(number){
		return number < 10 ? `0${number}` : `${number}`;
	}

	getFormattedDate(timestamp){
		return `${ this._addDecimal(new Date(timestamp).getDate()) }/${ this._addDecimal(new Date(timestamp).getMonth()+1) }`;
	}

	render(){

		const { loja, offer } = this.props;

		return (
			<div class={`store-card offer-card`}>
				<img class="offer-card--store" src={`https://static.carrefour.com.br/imagens/localizador/_img/logo_${ loja.tipo }.png`} />
				<figure class="offer-card--cover lazy-load--container">
					<a href={`https://www.carrefour.com.br/tabloide-digital?paginas=${offer.oferta.paginas}&bolsao=${offer.bolsao}&os=${offer.oferta.os}&width=${offer.oferta.size.width}&height=${offer.oferta.size.height}`} target="_blank">
						<img class="lazy-load" data-src={`https://static.carrefour.com.br/imagens/tabloide-digital/v1/_img/impressos/${offer.oferta.os}/01_${offer.bolsao}_${offer.oferta.os}.jpg`} />
					</a>
				</figure>
				<p class="offer-card--date">
					válido de <strong>{this.getFormattedDate(offer.oferta.inicio)}</strong> a <strong>{this.getFormattedDate(offer.oferta.final)}</strong>
				</p>
				<h3 class="store-card__title">
					{ loja.loja.replace('Carrefour', '').trim() } -
					<br />{ offer.oferta.nome }
				</h3>
				<p class="store-card__text">
					{ this.titleCase(loja.logradouro) }, { loja.numero }{ loja.complemento ? ` - ${loja.complemento}` : '' }<br/>
					{ loja.bairro ? `${loja.bairro} ` : ''}<br/>
					{loja.cidade} - {loja.uf}<br/>
					CEP: { loja.cep }<br/>
				</p>
			</div>
		);

	}

}

const OfferCardClass_mapStateToProps = state => {
	var { bolsoes, ofertas } = state;
	return { bolsoes, ofertas };
}

const OfferCard = ReactRedux.connect(OfferCardClass_mapStateToProps)(OfferCardClass);