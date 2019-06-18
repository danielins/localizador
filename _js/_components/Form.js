class FormClass extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			currentBusca: '',
			currentOrigem: '',
			currentDestino: '',
			comoChegar: false,
			isFilterOn: false,
			storeFound: false,
			lojas: []
		};

		this.formSubmitHandler = this.formSubmitHandler.bind(this);
		this.buscaChangeHandler = this.buscaChangeHandler.bind(this);
		this.partidaChangeHandler = this.partidaChangeHandler.bind(this);
		this.destinoChangeHandler = this.destinoChangeHandler.bind(this);
		this.toggleFilters = this.toggleFilters.bind(this);
		this.criaRota = this.criaRota.bind(this);
		this.directionCallback = this.directionCallback.bind(this);
		this.limpaBusca = this.limpaBusca.bind(this);
		this.submitPartida = this.submitPartida.bind(this);

		// setTimeout(() => {
		// 	this.directionService = new google.maps.DirectionsService();
		// 	this.directionsDisplay = new google.maps.DirectionsRenderer();
		// }, 1000);

	}

	listAllUf(lojas){
		let uf = [];
		lojas.map(loja => {
			var parsed = loja.uf.toUpperCase().trim();
			if ( uf.indexOf(parsed) === -1 ){
				uf.push(parsed);
			}
		});
		uf.splice(uf.indexOf('SP'), 1);
		return ['SP'].concat(uf.sort());
	}

	lojaChangeHandler(e){
		const currentLoja = e.target.value;
		this.setState({ currentLoja });
		// window.gmap.disparaCliqueMarcador(currentLoja);
	}

	buscaChangeHandler(e){
		const currentBusca = e.target.value;
		this.setState({ currentBusca });
	}

	partidaChangeHandler(e){
		const currentOrigem = e.target.value;
		$('#cmpPartida').removeClass('erro');
		this.setState({ currentOrigem });
	}

	destinoChangeHandler(e){
		const currentDestino = e.target.value;
		this.setState({ currentDestino });
	}

	formSubmitHandler(e){
		e.preventDefault();

		$('#cmpBusca').removeClass('erro');
		if ( !this.state.currentBusca.length ){
			$('#cmpBusca').addClass('erro');
			return false;
		}

		// window.gmap.SEARCH_NEAREST_AFTER = true;
		// window.gmap.buscaEndereco(`${ this.state.currentBusca }, Brasil`);
		// setTimeout(() => {
		// 	if ( window.gmap.STORE_FOUND ){
		// 		this.setState({ storeFound: true });
		// 	}
		// }, 500);
	}

	limpaBusca(){
		const currentDestino = '';
		// window.gmap.infoWindow.close();
		// window.gmap.mostraTodosMarcadores();
		// this.directionsDisplay.setMap(null);
		this.setState({ currentDestino, storeFound: false });
	}

	listAllStores(cidade){
		return this.props.lojas.filter(loja => loja.cidade.toUpperCase() === cidade);
	}

	toggleFilters(){
		this.setState({ isFilterOn: !this.state.isFilterOn });
	}

	filterContains(categoria){
		return this.state.filtros.indexOf(categoria) >= 0 ? true : false;
	}

	criaRota(){

		$('#cmpPartida').removeClass('erro');

		if ( this.state.currentOrigem.length < 1 ){
			$('#cmpPartida').addClass('erro');
			return false;
		}

		let request = {
			origin: this.state.currentOrigem,
			destination: this.state.currentDestino,
			travelMode: 'DRIVING'
		};

		// this.directionService.route(request, this.directionCallback);

	}

	submitPartida(e){
		if ( e.key === 'Enter' ){
			e.preventDefault();
			this.criaRota();
		}
	}

	directionCallback(result, status) {
		if (status == 'OK'){
			// window.gmap.escondeTodosMarcadores();
			// this.directionsDisplay.setMap( window.gmap.map );
			// this.directionsDisplay.setDirections(result);
		}
	}

	toggleFiltersUI(){
		$('.localizador__ui').toggleClass('isOpen');
	}

	componentWillReceiveProps(props){
		this.setState({ currentDestino: props.ui.loja })
	}

	render(){

		this.props.scrollToTop();

		this.props.uf = this.listAllUf(this.props.lojas);

		const loja = this.state.currentDestino;
		const { lojas, applyFilter } = this.props;

		return(
		<article class={`localizador__ui ${ this.props.isOffer ? 'localizador__ui--offer' : '' }`}>

				{
					!loja &&
					<MainHeader isOffer={ this.props.isOffer } />
				}

				<div class="filter-header">
					<button class="filter-header__button bt-theme--4" onClick={ this.toggleFiltersUI }>
						{
							'Selecionar região e tipo de loja'
						}
					</button>
				</div>

				<form class="localizador__form vertical" onSubmit={ this.formSubmitHandler }>

					{ !loja &&
						<div>
							<p class="localizador__ui__filter--header">
								<span>
									1. Escolha o Estado, Cidade e Bairro:
								</span>
							</p>
							<div class="localizador__form--double-select">
								<select
									id="cmpUf"
									name="cmpUf"
									onChange={ this.props.ufChangeHandler }
									value={ this.state.currentUf }>
									<option value="">Estado</option>
									{
										this.props.uf.map((uf) =>
											<option value={uf}>{uf}</option>
										)
									}
								</select>
								<select
									id="cmpCidade"
									name="cmpCidade"
									onChange={ this.props.cidadeChangeHandler }
									value={ this.state.currentCidade }>
									<option value="">Cidade</option>
									{
										this.props.cidades.map((cidade) =>
											<option value={cidade}>{cidade}</option>
										)
									}
								</select>
							</div>
							{
								(this.props.currentCidade && this.props.bairros.length > 1) &&
									<div>
										<select
											id="cmpBairro"
											name="cmpBairro"
											class="localizador__form--large-select mb0"
											onChange={ this.props.bairroChangeHandler }
											value={ this.state.currentBairro }>
											<option value="">Bairro</option>
											{
												this.props.bairros.map((bairro) =>
													<option value={bairro}>{bairro}</option>
												)
											}
										</select>
										{
											/*
										<select
											id="cmpLoja"
											name="cmpLoja"
											class="localizador__form--large-select"
											onChange={ this.lojaChangeHandler }
											value={ this.state.currentLoja }>
											<option value="">Loja</option>
											{
												this.state.lojas.map((loja) =>
													<option value={loja.id}>{loja.loja.toUpperCase()}</option>
												)
											}
										</select>
											*/
										}
									</div>
							}
							{
								/*
							<p class="localizador__form--divide">
								<span>ou</span>
							</p>
							<div>
								<input
									type="text"
									id="cmpBusca"
									name="cmpBusca"
									placeholder="Digite endereço ou CEP"
									onChange={ this.buscaChangeHandler }
									value={ this.state.currentBusca }
								/>
								<button
									type="submit"
									class="bt-btheme--2"
								>
									Pesquisar
								</button>
							</div>
								*/
							}
						</div>
					}

					{
						this.state.currentDestino &&
						<div>
							<button class="uppercase font-small mb10 bt-theme--1" onClick={ this.limpaBusca }>
								Voltar
							</button>
							<div>
								{
									this.state.storeFound &&
									<p class="info-window__text info-window__text--resultado">
										Loja mais próxima encontrada:
									</p>
								}
								<h3 class="info-window__title">{ loja.loja }</h3>
								<p class="info-window__text">
									{ loja.logradouro }, { loja.numero }{ loja.complemento ? ` - ${loja.complemento}` : '' }<br/>
									{ loja.bairro ? `${loja.bairro}, ` : ''}{loja.cidade} - {loja.uf}<br/>
									CEP: { loja.cep }<br/>
								</p>
								<p class="info-window__text--description">
									Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, dolor.
								</p>
								<div class="info-window__double-button">
									{
										<button class="bt-theme--1 info-window__button" type="button" onClick="">
											Ver ofertas
										</button>
									}
									<button class="bt-theme--2 info-window__button" type="button" onClick={ () => this.setState({ comoChegar: !this.state.comoChegar, currentOrigem: this.state.currentBusca.length ? this.state.currentBusca : '' }) }>
										Como Chegar
									</button>
								</div>
							</div>
							{
								this.state.comoChegar &&
									<div class="localizador__form--rota">
										<input
											type="text"
											id="cmpPartida"
											name="cmpPartida"
											placeholder="Seu ponto de partida"
											onChange={ this.partidaChangeHandler }
											onKeyPress={ this.submitPartida }
											value={ this.state.currentOrigem }
										/>
										<input
											type="text"
											id="cmpDestino"
											name="cmpDestino"
											placeholder="Seu destino"
											value={ `${this.state.currentDestino.logradouro}, ${this.state.currentDestino.numero} - ${this.state.currentDestino.cidade}` }
											readonly="readonly"
										/>
										<button
											type="button"
											class="bt-theme--3 bt-wide"
											onClick={ this.criaRota }>
											Ver rota
										</button>
									</div>
							}
						</div>
					}

				</form>
				{/*
				<button type="button" class="bt-filter bt-theme--3" onClick={ this.toggleFilters }>
					Tipos de Lojas
				</button>
				*/}
				<div class="localizador__ui__filter vertical">
					{
						/*this.state.isFilterOn*/ true &&
						<div>
							<p class="localizador__ui__filter--header">
								<span>
									2. Escolha um ou mais tipos de loja que deseja visualizar:
								</span>
							</p>
							{
								// !this.props.isOffer &&
								<div class="localizador__ui__filtros">
									<ul>
										{ this.props.categorias.map((categoria) =>
												<li class={`localizador__ui__filtro ${categoria}`}>
													<label for={`filtro_${categoria}`}>
														{ categoria.charAt(0).toUpperCase() + categoria.substr(1).toLowerCase() }
													</label>
													<span class="localizador__ui__checkbox">
														<input
															type="checkbox"
															checked={ this.props.filtros.indexOf(categoria) < 0 ? false : true }
															id={`filtro_${categoria}`}
															name={`filtro_${categoria}`}
															onChange={ () => this.props.filtrosChangeHandler(categoria) }
														/>
														<span class="localizador__ui__checkbox--check"></span>
													</span>
												</li>
										)}
									</ul>
								</div>
							}
						</div>
					}
				</div>
			</article>
		);

	}

}


const FormClass_mapStateToProps = state => {
	var { bolsoes, lojas, ui, ofertas } = state;

	var categorias = [];
	lojas = lojas.map(loja => {
		if (categorias.indexOf(loja.tipo) === -1){
			categorias.push(loja.tipo);
		}
		loja.bolsoes = [];
		return loja;
	});

	// Coloca hiper sempre em primeiro
	if ( categorias.indexOf("hiper") >= 0 && categorias[0] !== "hiper"){
		let aux = categorias[0];
		let index = categorias.indexOf("hiper");
		categorias[0] = categorias[index];
		categorias[index] = aux;
	}

	// Coloca express sempre em segundo
	if ( categorias.indexOf("express") >= 0 && categorias[1] !== "express"){
		let aux = categorias[1];
		let index = categorias.indexOf("express");
		categorias[1] = categorias[index];
		categorias[index] = aux;
	}

	for ( var b in bolsoes ){

		bolsoes[b].lojas.map(lojaBolsao => {

			lojas.forEach(loja => {
				if ( loja.id === lojaBolsao.sigla ){
					loja.bolsoes.push( bolsoes[b].bolsao );
				}
			});

		});

	}

	return { bolsoes, lojas, ui, categorias, ofertas };
};

const Form = ReactRedux.connect(FormClass_mapStateToProps)(FormClass);