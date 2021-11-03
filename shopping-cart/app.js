// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItem = document.querySelector('.cart-items');
const cartTotals = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productDOM = document.querySelector('.products-center');

// cart
let cart = [];
// button DOM
let buttonDOM = [];
//  getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map((item) => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
            })
            return products;
        }
        catch (err) {
            console.error(err);
        }
    }
}
// UI
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach((item) => {
            result += `
                 <article class="product">
                <div class="img-container">
                    <img src=${item.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${item.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to bag
                    </button>
                </div>
                <h3>${item.title}</h3>
                <h4>$${item.price}</h4>
            </article>
            `
        })
        productDOM.innerHTML = result;
    }
    getBagButton() {
        let buttons = [...document.querySelectorAll('.bag-btn')]
        buttonDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = 'In Cart';
                button.disabled = true;
            }
            button.addEventListener('click', (event) => {
                event.target.innerText = 'In Cart';
                event.target.disabled = true;
                // get product from products
                let cartItem = { ...Storage.getProducts(id), amount: 1 };
                // add product to the cart
                cart = [...cart, cartItem];
                // save cart in local storage
                Storage.saveCart(cart);
                //set cart values
                this.setCartValue(cart);
                //display cart items
                this.addCartItems(cartItem);
                // show the cart item
                this.showCart();
            })
        })
    }
    setCartValue(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.forEach(item => {
            // console.log(item)
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotals.innerText = parseFloat(tempTotal.toFixed(2));
        cartItem.innerText = itemsTotal;
    }
    addCartItems(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<img src=${item.image} alt="product">
        <div>
            <h4>${item.title}</h4>
            <h5>${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
           <i class="fa fa-chevron-up" aria-hidden="true" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fa fa-chevron-down" data-id=${item.id}></i>
        </div>`
        cartContent.appendChild(div);
    }
    showCart() {
        // console.log('show');
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValue(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.closeShow);
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItems(item));
    }
    closeShow() {
        // console.log('close');
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    cartLogic() {
        clearCartBtn.addEventListener('click', () => { this.clearCart() })
        cartContent.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;

                cartContent.removeChild(removeItem.parentElement.parentElement)
                this.removeItem(id);
            } else if (event.target.classList.contains('fa-chevron-up')) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValue(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if (event.target.classList.contains("fa-chevron-down")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValue(cart);
                    lowerAmount.preElementSibling.innerText = tempItem.amount;
                }
                else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        })
    }
    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.closeShow();
    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValue(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = ` <i class="fa fa-shopping-cart" aria-hidden="true"></i>add to cart`
    }
    getSingleButton(id) {
        return buttonDOM.find(button => button.dataset.id === id);
    }
}

//local storage
class Storage {
    static saveProduct(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProducts(id) {
        let proudcuts = JSON.parse(localStorage.getItem("products"));
        return proudcuts.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();
    // set up app
    ui.setupAPP();
    // get all products
    products.getProducts().then(product => {
        ui.displayProducts(product);
        Storage.saveProduct(product);
    })
        .then(() => {
            ui.getBagButton();
            ui.cartLogic();
        });
})