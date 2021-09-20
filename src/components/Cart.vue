<template>
    <div class="cart-wrapper">
        <div class="cart">
            <div class="a"></div>
            <h2 class="cart-title">Shopping cart</h2>

            <div v-if="userCartProducts && userCartProducts.length > 0">
                <ul class="cart-list">
                    <li 
                        class="cart-item"
                        v-for="(product, i) in userCartProducts" :key="i"
                    >
                        <div class="cart-item-info">
                            <img 
                                class="cart-item-img"
                                :src="product.image" 
                                :alt="product.title"
                            >
                            <div class="cart-item-description">
                                <p class="cart-item-category">{{product.category}}</p>
                                <h3 class="cart-item-name">{{product.title}}</h3>
                                <div class="cart-item-price">${{product.price}}</div>
                            </div>
                        </div>
                        <div class="cart-item-control">
                            <div class="cart-item-quantity">
                                <button 
                                    class="cart-item-minus cart-item-button"
                                    @click="removeOneItem([userCartProductsQuantity[i], product.id, cart.userId])"
                                ></button>
                                <span class="cart-item-amount">{{userCartProductsQuantity[i]}}</span>
                                <button 
                                    class="cart-item-plus cart-item-button"
                                    @click="addOneItem([userCartProductsQuantity[i], product.id, cart.userId])"
                                ></button>
                            </div>
                            <div class="cart-item-total">
                                ${{(userCartProductsQuantity[i] * +product.price).toFixed(2)}}
                            </div>
                            <button 
                                class="cart-item-delete"
                                @click="deleteItem(product.id)"
                            ></button>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else class="cart-empty">Cart is empty</div>

            <div class="cart-total">
                <span class="cart-total-name">Total:</span>
                <span class="cart-total-price">${{totalPrice}}</span>
            </div>

            <div class="cart-buttons-wrapper">
                <button 
                    class="cart-continue cart-button"
                    @click="cancel"
                >Continue shopping</button>
                <button 
                    class="cart-payment cart-button" 
                    disabled title="Not available now">
                Payment</button>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import IProduct from '@/Types/IProduct.interface'
import ICart from '@/Types/ICart.interface'

export default defineComponent({
    data() {
        return {
            
        }
    },
    computed: {
        cart(): ICart {
            return this.$store.getters.getCart
        },
        products(): IProduct[] {
            return this.$store.getters.getProducts
        },
        userCartProducts() {
            return this.$store.getters.getUserCartProducts
        },
        userCartProductsQuantity() {
            return this.$store.getters.getUserCartQuantity
        },
        totalPrice() {
            let sum = 0
            for(let i = 0; i < this.userCartProducts.length; i++) {
                sum += +this.userCartProducts[i].price * +this.userCartProductsQuantity[i]
            }
            return sum.toFixed(2)
        },
    },
    methods: {
        // CART ITEMS MANAGEMENT
        // Add another one item to cart
        addOneItem([quantity, id, user]: number[]) {
            this.$store.dispatch('patchOneItemToCart', [quantity + 1, id, user])
        },
        // Remove one item from cart
        removeOneItem([quantity, id, user]: number[]) {
            if(quantity > 1) {
                this.$store.dispatch('patchOneItemToCart', [quantity - 1, id, user])
            } 
        },
        // Delete item from cart
        deleteItem(id: number) {
            this.$store.dispatch('deleteItemFromCart', id)
        },

        // CART BUTTONS
        // Close the cart
        cancel() {
            this.$emit('onCanceled')
        },
    },
})
</script>


<style lang="scss" scoped>
.cart-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.2);

    display: block;

    &.shown {
        display: block;
    }
}

.cart {
    width: 920px;
    height: 80vh;
    padding: 26px 46px;

    position: absolute;
    top: 10vh;
    right: 50%;
    transform: translateX(50%);

    display: flex;
    flex-direction: column;
    
    border-radius: 8px;
    background-color: #fff;

    overflow-y: auto;
    z-index: 100;
}
.cart-empty {
    padding: 60px 0;
    font-weight: 700;
    font-size: 22px;
    text-align: center;
}
.cart-title {
    font-size: 28px;
    margin-bottom: 26px;
}


.cart-item {
    margin-bottom: 26px;
    border-bottom: 1px solid var(--grey-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.cart-item-info {
    display: flex;
    align-items: center;
}
.cart-item-control {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.cart-item-img {
    padding: 16px;
    padding-left: 0;
    max-width: 64px;
}
.cart-item-description {
    margin-right: auto;
}
.cart-item-category {
    color: var(--grey-dark);
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 4px;
}
.cart-item-name {
    font-size: 16px;
    margin-bottom: 8px;
}
.cart-item-price {
    font-weight: 500;
    font-size: 18px;
}

.cart-item-quantity {
    width: 75px;
    margin: 0 38px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
}
.cart-item-button {
    width: 24px;
    height: 24px;
    border: 0;
    background-color: #aaa;
    cursor: pointer;
    background: no-repeat center / 16px;
}
.cart-item-minus {
    background-image: url('../assets/icons/minus.png');
}
.cart-item-plus {
    background-image: url('../assets/icons/add.svg');
}
.cart-item-amount {
    padding: 0 8px;
    font-weight: 700;
    font-size: 18px;
}

.cart-item-total {
    width: 67px;
    font-weight: 700;
    font-size: 18px;
    margin-right: 38px;
    flex-shrink: 0;
}
.cart-item-delete {
    width: 20px;
    height: 20px;
    border: 0;
    background-color: var(--grey-dark);
    cursor: pointer;
    background: url('../assets/icons/delete.svg') no-repeat center / 20px;
}
.cart-total {
    margin-top: auto;

    display: flex;
    justify-content: flex-end;
    align-items: center;

    font-weight: 700;
    font-size: 20px;
}
.cart-total-name {
    margin-right: 28px;
}
.cart-total-price {
    font-size: 24px;
}

.cart-buttons-wrapper {
    margin: 48px 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.cart-continue {
    padding-left: 20px;
    border: 0;
    background: url('../assets/icons/arrow-left.png') no-repeat left center  / 14px;
    cursor: pointer;

    font-weight: 700;
    font-size: 16px;
    line-height: 100%;
    color: var(--grey-dark);

    &:hover {
        text-decoration: underline;
    }
}
.cart-payment {
    padding: 4px 42px;
    border-radius: 4px;
    border: 2px solid var(--main-dark);
    background-color: #fff;
    cursor: not-allowed;

    font-weight: 700;
    font-size: 20px;
    color: var(--main-dark);

    &:hover {
        background-color: var(--main-light);
    }
    &:active {
        transform: scale(0.99);
    }
}

@media screen and (max-width: 1024px) {
    .cart {
        width: 720px;
    }
    .cart-item-quantity {
        margin: 0 22px;
    }
    .cart-item-total {
        margin-right: 22px;
    }
}
@media screen and (max-width: 768px) {
    .cart {
        width: 550px;
    }
}
@media screen and (max-width: 576px) {
    .cart {
        padding: 16px 16px;
        width: 90vw;
    }
    .cart-item {
        flex-direction: column
    }
    .cart-item-info {
        align-self: start;
    }
    .cart-item-control {
        align-self: stretch;
        margin: 12px 0;
        justify-content: center;
        gap: 24px;
    }
    .cart-title {
        font-size: 22px;
    }
    .cart-cart-title {
        font-size: 12px;
    }
    .cart-item-name {
        font-size: 14px;
    }
    .cart-item-price {
        font-size: 14px;
    }
    .cart-item-amount,
    .cart-item-total {
        font-size: 14px;
    }
    .cart-item-button {
        background-size: 13px;
    }
    .cart-item-delete {
        background-size: 18px;
        order: 3;
    }
    .cart-item-quantity {
        width: 67px;
        margin: 0 12px;
        order: 2;
    }
    .cart-item-total {
        width: 55px;
        margin-right: 12px;
        order: 1;
    }
    .cart-buttons-wrapper {
        margin: 18px 0 12px;
        gap: 10px;
    }
    .cart-continue {
        padding-left: 16px;
        font-size: 14px;
        background-size: 14px;
    }
    .cart-payment {
        padding: 2px 22px;
        font-size: 16px;
    }
}
</style>