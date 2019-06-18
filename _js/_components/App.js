class AppClass extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			currentUf: '',
			currentCidade: '',
			currentBairro: '',
			currentLoja: '',
			height: 600,
			cidades: [],
			bairros: [],
			filtros: ['hiper'],
			modalVisible: false,
			modalContent: ''
		}

		this.setHeight = this.setHeight.bind(this);
		this.setDestination = this.setDestination.bind(this);
		this.ufChangeHandler = this.ufChangeHandler.bind(this);
		this.cidadeChangeHandler = this.cidadeChangeHandler.bind(this);
		this.bairroChangeHandler = this.bairroChangeHandler.bind(this);
		this.lojaChangeHandler = this.lojaChangeHandler.bind(this);
		this.filtrosChangeHandler = this.filtrosChangeHandler.bind(this);
		this.applyFilter = this.applyFilter.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.openModal = this.openModal.bind(this);

	}

	componentDidMount(){
		const that = this;
		this.setHeight();

		$(window).resize(e => {
			this.setHeight();
			$(window).trigger('scroll');
		});

		$(window).scroll(() => {
			$('.localizador__ui').removeClass('isOpen');
			this.toggleFixedHeader();
			this.toggleScrollButton();
		});

		$(window).trigger('scroll');

	}

	setHeight(){
		let height = $(window).height();
		if ( $(window).width() < 768 ){
			height = 'auto';
		}
		this.setState({ height });
	}

	setDestination(loja){
		this.props.setLoja(loja);
	}

	shouldFixTop(){

		var toFix = false;

		const SCROLL_TOP = $(window).scrollTop();
		const WIDTH = $(window).width();

		if ( WIDTH >= 1100 && SCROLL_TOP > 170 ){
			toFix = true;
		} else if ( WIDTH >= 660 && SCROLL_TOP > 140 ){
			toFix = true;
		} else if ( WIDTH < 660 && SCROLL_TOP > 110 ) {
			toFix = true;
		}

		return toFix;

	}

	toggleFixedHeader(){

		if ( this.shouldFixTop() ){
			$('#app .localizador').addClass('topFixed');
		} else {
			$('#app .localizador').removeClass('topFixed');
		}

	}

	toggleScrollButton(){

		if ( this.checkScroll() ){
			$('.localizador__scroll-top').fadeIn('fast');
		} else {
			$('.localizador__scroll-top').fadeOut('fast');
		}

	}

	checkScroll(){

		var toFadeButton = false;

		if ( $(window).width() <= 680 ){
			if ( $(window).scrollTop() >= 215 ) {
				toFadeButton = true;
			}
		} else {
			if ( $(window).scrollTop() >= $(window).height() ) {
				toFadeButton = true;
			}
		}

		return toFadeButton;

	}

	ufChangeHandler(e){
		const currentCidade = '';
		const currentUf = e.target.value;
		const cidades = this.listAllCities(currentUf);
		this.setState({ currentUf, currentCidade, cidades });

		// const currentLoja = '';
		// const currentDestino = '';
		// const currentUf = e.target.value;
		// this.setState({ currentUf, currentCidade, currentLoja, currentDestino, cidades });
	}

	cidadeChangeHandler(e){
		const currentCidade = e.target.value;
		const bairros = this.listAllDistricts(currentCidade);
		this.setState({ currentCidade, bairros });

		// const currentLoja = '';
		// const currentDestino = '';
		// const lojas = this.listAllStores(currentCidade);
		// this.setState({ currentCidade, currentLoja, currentDestino, lojas });
		// window.gmap.buscaEndereco(`${currentCidade}, ${this.state.currentUf}, Brasil`, false);
	}


	bairroChangeHandler(e){
		const currentBairro = e.target.value;
		this.setState({ currentBairro });
	}


	lojaChangeHandler(e){
		const currentLoja = e.target.value;
		this.setState({ currentLoja });
	}

	filtrosChangeHandler(filter){

		let filtros = [].concat(this.state.filtros);
		let index = filtros.indexOf(filter);

		if ( index === -1 ){
			filtros.push(filter);
		} else {
			filtros.splice(index, 1);
		}

		this.setState({ filtros });

		// window.gmap.filtraMarcadores( filtros );

	}


	listAllCities(uf){
		let cidades = [];
		this.props.lojas.map(loja => {

			if ( !loja.uf || !loja.cidade ){ return false; }

			if ( loja.uf.toUpperCase().trim() !== uf ){ return false; }

			var parsed = loja.cidade.toUpperCase().trim();

			if ( cidades.indexOf(parsed) === -1 ){
				cidades.push(parsed);
			}

		});
		if ( uf === 'SP' ){
			cidades.splice(cidades.indexOf('SÃO PAULO'), 1);
			return ['SÃO PAULO'].concat(cidades.sort());
		}
		return cidades.sort();
	}


	listAllDistricts(cidade){
		let bairros = [];
		this.props.lojas.map(loja => {

			if ( !loja.uf || !loja.cidade || !loja.bairro ){ return false; }

			if ( loja.cidade.toUpperCase().trim() !== cidade ){ return false; }

			var parsed = loja.bairro.toUpperCase().trim();

			if ( bairros.indexOf(parsed) === -1 ){
				bairros.push(parsed);
			}

		});

		return bairros.sort();

	}

	applyFilter(loja){

		const filters = this.state;

		if ( filters.currentUf && filters.currentUf.toUpperCase() !== loja.uf.toUpperCase() ){
			return false;
		}

		if ( filters.currentCidade && filters.currentCidade.toUpperCase() !== loja.cidade.toUpperCase() ){
			return false;
		}

		if ( filters.currentBairro && filters.currentBairro.toUpperCase() !== loja.bairro.toUpperCase() ){
			return false;
		}

		if ( filters.filtros.indexOf(loja.tipo) === -1 ){
			return false;
		}

		return true;
	}

	scrollToTop(){
		$('html, body').animate({
			scrollTop: 0
		}, 500);
	}


	/**
	 * MODAL
	 */

	openModal(modalContent){
		this.setState({ modalVisible: true, modalContent });
	}

	closeModal(){
		this.setState({ modalVisible: false, modalContent: '' });
	}


	render(){

		const {
			currentUf,
			currentCidade,
			currentBairro,
			cidades,
			bairros,
			filtros } = this.state;

		return (
			<div class="localizador">
				<Form
					cidades={ cidades }
					bairros={ bairros }
					filtros={ filtros }
					currentCidade={ currentCidade }
					currentBairro={ currentBairro }
					ufChangeHandler={ this.ufChangeHandler }
					cidadeChangeHandler={ this.cidadeChangeHandler }
					bairroChangeHandler={ this.bairroChangeHandler }
					filtrosChangeHandler={ this.filtrosChangeHandler }
					applyFilter={ this.applyFilter }
					scrollToTop={ this.scrollToTop }
					isOffer={ this.props.isOffer }
				/>
				{/* <Mapa setDestination={ this.setDestination } height={this.state.height} />  */}
				<StoreList
					applyFilter={ this.applyFilter }
					filters={ { currentUf, currentCidade, currentBairro, filtros } }
					openModal={ this.openModal }
					isOffer={ this.props.isOffer }
				/>
				<Modal
					visible={ this.state.modalVisible }
					content={ this.state.modalContent }
					closeModal={ this.closeModal }
				/>
				<button class="localizador__scroll-top" onClick={ this.scrollToTop } type="button">Voltar para o topo</button>
			</div>
		);

	}

}

const AppClass_mapStateToProps = state => {
	const { ui, lojas } = state;
	return { ui, map: {}, lojas }
};

const AppClass_mapDispatchToProps = dispatch => {
	return {
		setLoja: (data) => dispatch(setLoja(data))
	}
};

const App = ReactRedux.connect(AppClass_mapStateToProps, AppClass_mapDispatchToProps)(AppClass);