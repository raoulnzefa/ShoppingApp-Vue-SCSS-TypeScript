<template>
    <header class="header">
        <div class="header-container">

            <div class="header-item">
                <div class="logo">SHOP</div>
                <div class="logo logo2">SHOP</div>
            </div>

            <div class="header-item">
                <div 
                    class="search" 
                    :class="{shown : isSearchShown}"
                    @click="$event.stopPropagation()"
                >
                    <button class="search-button"></button>
                    <input 
                        type="search" 
                        class="search-input"
                        v-model="search"
                    >
                </div>
            </div>

            <div class="header-item">
                <button class="hidden-search" @click="showSearch($event)"></button>

                <button 
                    class="sign-in"
                    :class="{hidden : isUserAuthorized}"
                    @click="toSignIn"
                >
                    Sign in
                </button>
                <LogIn 
                    v-if="isLogInShown"
                    @onSigned="signInSuccessed"
                    @onCanceled="signInCanceled"
                />

                <div 
                    class="cart-icon"
                    :class="{shown : isUserAuthorized}"
                >
                    <button class="cart-icon-button" @click="toCart"></button>
                    <div class="cart-icon-counter">
                        <span v-if="userCartProducts">{{userCartProducts.length}}</span>
                    </div>
                </div>
                <Cart 
                    v-if="isCartShown"
                    @onCanceled="cartCanceled"
                />

                <div 
                    class="user"
                    :class="{shown : isUserAuthorized}"
                >
                    <div class="user-avatar">
                        <img src="../assets/icons/user-avatar.png" class="user-pic" alt="user avatar">
                    </div>
                    <button class="user-button" @click="showUserMenu($event)"></button>
                    <User 
                        v-if="isUserMenuShown"
                        @onLogOut="logOut"
                        @click="$event.stopPropagation()"
                    />
                </div>
            </div>
        </div>
        
    </header>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import Cart from '@/components/Cart.vue';
import User from '@/components/User.vue';
import LogIn from '@/components/LogIn.vue';

export default defineComponent({
    data() {
        return {
            isUserMenuShown: false,
            isCartShown: false,
            isSearchShown: false,
        }
    },
    computed: {
        // Search
        search: {
            get() {
                return this.$store.getters.getSearch
            },  
            set(value) {
                this.$store.commit('updateSearch', value)
            }
        },

        // Flags
        isUserAuthorized() {
            return this.$store.getters.isUserAuthorized
        },
        isLogInShown() {
            return this.$store.getters.isLogInShown
        },

        // Data from API
        currentUserId() {
            return this.$store.getters.getUser.id
        },
        userCartProducts() {
            return this.$store.getters.getUserCartProducts
        },
    },
    methods: {
        // SIGN IN BUTTON
        // Open sign-in modal when sign-in button is clicked
        toSignIn() {
            this.$store.commit('showLogIn')
        },
        // If sign-in was successful
        signInSuccessed() {
            this.$store.commit('hideLogIn')
            this.$store.commit('userAuthorized')
            this.$store.dispatch('getCart')

            // Stop waiting animation
            this.$store.commit('waitingCompleted')
        },
        // If sign-in was canceled
        signInCanceled() {
            this.$store.commit('hideLogIn')
            
            // Stop waiting animation
            this.$store.commit('waitingCompleted')
        },

        // USER MENU
        // Show/hide user menu
        showUserMenu(event: Event) {
            this.isUserMenuShown = !this.isUserMenuShown
            event.stopPropagation()
            document.body.addEventListener('click', () => {
                this.isUserMenuShown = false
            })
        },
        // Logout the user When logout button is clicked
        logOut() {
            this.$store.commit('userNotAuthorized')
        },

        // CART
        // Open the cart modal
        toCart() {
            this.isCartShown = true
        },
        // Close the cart modal
        cartCanceled() {
            this.isCartShown = false
        },

        // SEARCH ON SMALL SCREENS
        // Show search input
        showSearch(event: Event) {
            this.isSearchShown = !this.isSearchShown
            event.stopPropagation()
            document.body.addEventListener('click', () => {
                this.isSearchShown = false
            })
        },
    },
    mounted() {
        // Get default username and password from API
        this.$store.dispatch('getUser')
    },
    components: {
        Cart, User, LogIn
    },

})
</script>


<style lang="scss" scoped>
.header {
    // border-bottom: 1px solid var(--grey-light);
    box-shadow: 0 0 38px var(--grey-light);
}
.header-container {
    max-width: 1024px;
    margin: 0 auto;
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
}

.header-item:first-child {
    position: relative;
}

.header-item:first-child {
    margin-right: auto;
}
.header-item:last-child {
    margin-left: auto;
    display: flex;
    align-items: center;
    column-gap: 16px;
}
.header-item:nth-child(2) {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
}

.logo {
    position: absolute;
    font-weight: 700;
    font-size: 32px;
    line-height: 32px;
    color: var(--logo);
    z-index: 2;
}
.logo2 {
    position: absolute;
    top: 3px;
    left: -3px;
    color: var(--red);
    opacity: 0.7;
    z-index: 1;
}

.search {
    position: relative;
}
.search-input {
    height: 32px;
    padding-right: 16px;
    padding-left: 36px;
    border-radius: 99px;
    border: 0;
    background: var(--grey-light);

    font-weight: 400;
    font-size: 16px;
    color: var(--dark);

    &:focus {
        outline: 0;
        box-shadow: inset 0 0 6px var(--shadow);
    }
}
.search-button {
    position: absolute;
    left: 4px;
    width: 32px;
    height: 100%;
    border: 0;
    background: url('../assets/icons/search.svg') no-repeat center / 16px;
    cursor: pointer;
}
.hidden-search {
    width: 18px;
    height: 100%;
    border: 0;
    background: url('../assets/icons/search.svg') no-repeat center / 16px;
    cursor: pointer;
    display: none;
}

.sign-in {
    padding: 4px 14px;
    border-radius: 4px;
    border: 1px solid var(--main-dark);
    background: #fff;
    cursor: pointer;
    
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    color: var(--main-dark);

    // If user is authorized
    &.hidden {
        display: none;
    }

    &:hover {
        background-color: var(--main-light);
    }
    &:active {
        transform: scale(0.99);
    }
}

.cart-icon {
    position: relative; 
    height: 100%;
    display: none;

    // If user is authorized
    &.shown {
        display: block;
    }
}
.cart-icon-button {
    width: 32px;
    height: 100%;
    border: 0;
    background: url('../assets/icons/cart.svg') no-repeat center bottom / 24px;
    cursor: pointer;
}
.cart-icon-counter {
    position: absolute;
    top: 0px;
    right: -3px;
    width: 18px;
    height: 18px;
    border-radius: 9px;
    background-color: var(--red);

    display: flex;
    align-items: center;
    justify-content: center;

    & span {
        font-size: 13px;
        color: #fff;
    }
}

.user {
    position: relative;
    display: flex;
    align-items: center;
    display: none;
  
    // If user is authorized
    &.shown {
        display: flex;
    }
}
.user-avatar {
    height: 32px;
    width: 32px;
    border-radius: 16px;
    overflow: hidden;
}
.user-pic {
    width: 100%;
    height: 100%;
}
.user-button {
    width: 22px;
    height: 16px;
    border: 0;
    background: url('../assets/icons/arrow-down.svg') no-repeat center / 14px;
    cursor: pointer;
}



@media screen and (max-width: 1024px) {
    .header-container {
        margin: 0 20px;
    }
}

@media screen and (max-width: 567px) {
    .header-container {
        margin: 0 10px;
    }
    .logo {
        font-size: 28px;
    }
    .sign-in {
        padding: 3px 10px;
        font-size: 14px;
    }
    .cart-icon-button {
        background-size: 22px;
    }
    .user-avatar {
        height: 28px;
        width: 28px;
        border-radius: 14px;
    }
    .user-button {
        background-size: 12px;
    }

    .search {
        top: 40px;
        padding: 12px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 0 18px var(--shadow);
        display: none;

        // If search button is clicked
        &.shown {
            display: block;
        }
    }

    .search-input {
        height: 28px;
        padding-left: 30px;
        border-radius: 8px;
        font-size: 14px;
    }
    .search-button {
        width: 28px;
        height: 28px;
        left: 12px;
        background-size: 14px;
    }
    .hidden-search {
        display: block;
    }
    
}
</style>