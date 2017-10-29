//Accessing json file
    let products;

    let productsJSON = new XMLHttpRequest();
    productsJSON.overrideMimeType("application/json");
    productsJSON.open("GET", "products.json", true);

    productsJSON.onload = function() {
            let products = JSON.parse(this.responseText);
            script(products)
    };
    productsJSON.send();

//Gallery

function script (products) {
    let productName = document.querySelector('.product-name');
    let productImg = document.querySelector('.product-image');
    let productPrice = document.querySelector('#price');
    let productId = document.querySelector('.product-id');
    let productNumber = document.querySelector('.product-number');
    let nextItem = document.querySelector('.fa-chevron-right');
    let prevItem = document.querySelector('.fa-chevron-left');
    let currentItem = 0;


//Show sizes of current item
let sizesContainer = document.querySelector('#sizes');

      class size {
            constructor(item){

                let size = document.createElement('div');
                size.className = 'size';
                sizesContainer.appendChild(size);

                let sizeEU = document.createElement('span');
                sizeEU.className = 'eu-size';
                size.appendChild(sizeEU);
                sizeEU.innerHTML = item;
            }
        }


//Clear items
function reset () {
   for (let i = 0; i < products.length; i++){
       productName.innerHTML = '';
       productImg.src = '';
       productPrice.innerHTML = '';
       productId.innerHTML = '';
       productNumber.innerHTML = ''; 
       sizesContainer.innerHTML = ''; 
   }
}

//Init slider
function startSlide () {
   productName.innerHTML = products[currentItem].product_title;
   productImg.src = products[currentItem].product_image;
   productPrice.innerHTML = products[currentItem].product_price;
   productId.innerHTML = products[currentItem].product_id;
   productNumber.innerHTML = products[currentItem].product_number;
    
    products[currentItem].product_sizes.forEach(function(item){
      new size(item);
    })
}

startSlide();


//Show prev
function slideLeft () {
    reset();
    
    productName.innerHTML = products[currentItem - 1].product_title;
    productImg.src = products[currentItem - 1].product_image;
    productPrice.innerHTML = products[currentItem - 1].product_price;
    productId.innerHTML = products[currentItem - 1].product_id;
    productNumber.innerHTML = products[currentItem - 1].product_number;
    
    products[currentItem - 1].product_sizes.forEach(function(item){
      new size(item);
    })
    
    chooseSize(document.querySelectorAll('.eu-size'));
    currentItem--;
}

prevItem.addEventListener('click', () =>{
    if(currentItem === 0){
        currentItem = products.length;
    }
    slideLeft();
    localStorage.removeItem('size');
})


//Show next
function slideRight () {
    reset();
    
    productName.innerHTML = products[currentItem + 1].product_title;
    productImg.src = products[currentItem + 1].product_image;
    productPrice.innerHTML = products[currentItem + 1].product_price;
    productId.innerHTML = products[currentItem + 1].product_id;
    productNumber.innerHTML = products[currentItem + 1].product_number;
    
    products[currentItem + 1].product_sizes.forEach(function(item){
      new size(item);
    })
    
    chooseSize(document.querySelectorAll('.eu-size'));
    currentItem++;
}

nextItem.addEventListener('click', () =>{
    if(currentItem === products.length - 1){
        currentItem = -1;
    }
    slideRight();
    localStorage.removeItem('size');
})

//Choosing a size


let sizes = document.querySelectorAll('.eu-size');
let sizeToCart;

function chooseSize(sizes) {
  for (let i = 0; i < sizes.length; i++) {
    sizes[i].addEventListener("click", function(e) {
      let current = this;
      for (let i = 0; i < sizes.length; i++) {
        if (current != sizes[i]) {
          sizes[i].classList.remove('active');
        } else if (current.classList.contains('active') === true) {
          current.classList.remove('active');
        } else {
          current.classList.add('active')
            
          sizeToCart = current.innerHTML;  
            localStorage.setItem('size', sizeToCart)
        }
      }
      e.preventDefault();
      
        
    });
  };   
    
}

chooseSize(document.querySelectorAll('.eu-size'));


//Add items to cart
let cartBtn = document.getElementById('add-to-cart');
let openModalBtn = document.getElementById('order');

function addToStorage () {
    localStorage.setItem(products[currentItem].product_id, JSON.stringify(products[currentItem]));
    openModalBtn.innerHTML = `Koszyk (${localStorage.length - 1})`;
    
}



function addToCart () {
    let cart = [];

    let keys = Object.keys(localStorage)
    let i = keys.length;
    
    while (i--){
        if (keys[i] != 'size'){
            cart.push(JSON.parse(localStorage.getItem(keys[i])))
        }
    }
    
    return cart;
    
}


cartBtn.addEventListener('click', () => {
    if(localStorage.getItem('size') === null){
        alert('Wybierz rozmiar')
    }
    else{
        addToStorage();
        buttonAppear();
    }
    
});


function buttonAppear () {
        $('#order').fadeIn('slow');
}



//Modal

class Modal {
    constructor () {
        this.modalContainer = document.createElement('div');
        this.modalContainer.className = 'modal'
        document.body.appendChild(this.modalContainer);
        
        const contentContainer = document.createElement('div');
        contentContainer.className = 'container';
        this.modalContainer.appendChild(contentContainer)
        
        const cartTitle = document.createElement('h1');
        cartTitle.className = 'cart-title';
        cartTitle.innerHTML = 'Podsumowanie';
        contentContainer.appendChild(cartTitle);
        
        const payContainer = document.createElement('div');
        payContainer.className = 'pay-container';
        this.modalContainer.appendChild(payContainer);
        
        const totalPrice = document.createElement('div');
        totalPrice.className = 'total-price';
        payContainer.appendChild(totalPrice);
        
        const checkoutBtn = document.createElement('button');
        checkoutBtn.className = 'checkout-btn';
        checkoutBtn.innerHTML = "Zapłać"
        payContainer.appendChild(checkoutBtn);
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'close-btn';
        contentContainer.appendChild(closeBtn);
        closeBtn.addEventListener('click', this.close.bind(this))
        
        openModalBtn.addEventListener('click', this.addToList.bind(this))

    }
    
    

    countPrice () {
        let allPrices = document.querySelectorAll('.item-price h2');
        let prices = [];
        allPrices.forEach((div) => {
            prices.push(div.innerHTML);
        })
        
        let sum = 0;
        
        prices.forEach((price) => {
           price = parseFloat(price)
            sum+=price;
        })
        
        return sum.toFixed(2);;
    }
    
    open(){
        this.modalContainer.classList.add('open');
    }

    close(){
        this.modalContainer.classList.remove('open');
    }     
    
    
    //Show chosen items in modal
    addToList () {
        let contentContainer = document.querySelector('.container');
        let cart = addToCart();
        let itemsInCart = document.querySelectorAll('.item-container');
        let inCartIds = [];
        itemsInCart.forEach(function(item){
            inCartIds.push(item.id)
        });
        
        let sizeInCart = localStorage.getItem('size')
        
        for (let i = 0; i < cart.length; i++){
                if (itemsInCart.length === 0){

                        let itemInCart = document.createElement('div');
                            itemInCart.className = 'item-container';
                            itemInCart.id = cart[i].product_id;
                            itemInCart.innerHTML = `<div class="item-thumbnail">
                                            <img src="${cart[i].product_image}" class="item-thumbnail">
                                        </div>
                                        <div class="item-title">
                                            <h2>${cart[i].product_title}</h2> 
                                        </div>
                                        <div class="item-size">
                                            <h2>${sizeInCart}</h2> 
                                        </div>
                                        <div class="item-price">
                                            <h2>${cart[i].product_price}</h2> 
                                        </div>
                                        <div class="delete-item"><h2>&times;</h2></div>        
                                        `;

                            contentContainer.appendChild(itemInCart);
                        }
                
                
                else if($.inArray(cart[i].product_id, inCartIds) === -1){
                            let itemInCart = document.createElement('div');
                            itemInCart.className = 'item-container';
                            itemInCart.id = cart[i].product_id;
                            itemInCart.innerHTML = `<div class="item-thumbnail">
                                            <img src="${cart[i].product_image}" class="item-thumbnail">
                                        </div>
                                        <div class="item-title">
                                            <h2>${cart[i].product_title}</h2> 
                                        </div>
                                        <div class="item-size">
                                            <h2>${sizeInCart}</h2> 
                                        </div>
                                        <div class="item-price">
                                            <h2>${cart[i].product_price}</h2> 
                                        </div>
                                        <div class="delete-item"><h2>&times;</h2></div>
                                        `;

                            contentContainer.appendChild(itemInCart);

                }
        }
    }
    
}


let modal = new Modal();

openModalBtn.addEventListener('click', () => {
    modal.open();
    let totalPrice = document.querySelector('.total-price')
    totalPrice.innerHTML = `Razem do zapłaty: ${modal.countPrice()} PLN`
    
     let itemToDelete = document.querySelector('.item-container')
     let deleteBtn = document.querySelectorAll('.delete-item')

     function deleteItem(){
        this.parentNode.remove(); 
        totalPrice.innerHTML = `Razem do zapłaty: ${modal.countPrice()} PLN`;
        
        let idToDelete = this.parentNode.id;
        localStorage.removeItem(idToDelete);
        openModalBtn.innerHTML = `Koszyk (${localStorage.length - 1})`;
    }
    
    deleteBtn.forEach((element) => {
        element.addEventListener('click', deleteItem, false);
    })
})
   


localStorage.clear();



}



