import axios from 'axios';
// import Noty from 'noty';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

const updateCart = (pizza) =>{
    // ajx call axios library
    axios.post('/update-cart', pizza).then(res =>{
      cartCounter.innerHTML = res.data.totalQty;
      
      
      
    });
};

addToCart.forEach((btn)=>{

    btn.addEventListener('click', (e)=>{
        
      //   new Noty({
      //     type: 'success',
      //     layout: 'topRight',
      //     text: 'Some notification text'
      // }).show();

        let pizza=JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
    });
});