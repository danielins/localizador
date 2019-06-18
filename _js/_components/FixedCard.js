class FixedCardClass extends React.Component {

   constructor(props){
      super(props);
   }

   render(){
      return (
         <a href='https://www.carrefour.com.br/maes' target='_blank'>
            <div class={`store-card offer-card`} style={ this.props.theme }>
               WOOP
            </div>
         </a>
      );
   }

}

const FixedCard = ReactRedux.connect(null)(FixedCardClass);