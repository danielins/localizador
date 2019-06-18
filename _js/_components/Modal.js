class Modal extends React.Component {

	constructor(props){
		super(props);
	}

	render(){

		const { visible, content } = this.props;

		if ( !visible ) { return null; }

		return (

			<div class="modal-localizador" style={{
				maxHeight: $(window).height()
			}}>
				<div class="modal-localizador__wrapper">
					<div class="modal-localizador__box">
						<div class="modal-localizador__box--inner">
							<button onClick={ this.props.closeModal } class="modal-localizador__close">
								X
							</button>
							<div class="modal-localizador__content">
								{ content }
							</div>
						</div>
					</div>
				</div>
			</div>

		)

	}

}