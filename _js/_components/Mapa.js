class MapClass extends React.Component {

	constructor(props){
		super(props);
		this.map = props.map;
	}

	componentWillReceiveProps(props){
		$('.localizador, .localizador__mapa, .mapa').height(props.height);
	}

	componentDidMount(){

		let { lojas, ofertas, height } = this.props;

		window.gmap = new GMap(lojas, ofertas, this.props);

	}

	render(){

		const { lojas } =  this.props;

		const that = this;

		return (
			<div class="localizador__mapa">
				<div id="map" class="mapa"></div>
			</div>
		);

	}

}

const MapClass_mapStateToProps = state => {
	const { lojas } = state;
	return { lojas, ofertas: {} }
};

const Mapa = ReactRedux.connect(MapClass_mapStateToProps)(MapClass);