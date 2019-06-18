class MainHeaderClass extends React.Component {

	constructor(props){
		super(props);
	}

	render(){
		return (
			<div class="localizador__header vertical">
				<h1 class="localizador__header--title">
					{
						this.props.isOffer
						? 'Confira o folheto de ofertas da loja mais próxima.'
						: 'Encontre aqui o Carrefour mais próximo de você.'
					}
				</h1>
				{
					!this.props.isOffer &&
					<p class="localizador__header--subtitle">
						Ao localizar uma loja, você também pode conferir as ofertas disponíveis.
					</p>
				}
			</div>
		);
	}

}

const MainHeader = ReactRedux.connect()(MainHeaderClass);