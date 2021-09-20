import { createStore } from 'vuex'
import IProduct from '@/types/IProduct.interface'
import IUser from '@/types/IUser.interface'
import ICart from '@/types/ICart.interface'

export default createStore({
    state: {
        // Search
        search: '',

        // Flags
        isLogInShown: false,
        isUserAuthorized: false,
        waiting: false,

        // Data from API
        products: [] as IProduct[],
        categories: [] as string[],
        user: {} as IUser,
        signInAnswer: {},
        cart: {} as ICart,
        userCartProducts: [] as IProduct[],
        userCartQuantity: [] as number[],
    },
    getters: {
        // Search
        getSearch(state) {
            return state.search
        },
        // Flags
        isLogInShown(state) {
            return state.isLogInShown
        },
        isUserAuthorized(state) {
            return state.isUserAuthorized
        },
        waiting(state) {
            return state.waiting
        },

        // Data
        getProducts(state): IProduct[] {
            return state.products
        },
        getCategories(state): string[] {
            return state.categories
        },
        getUser(state): IUser {
            return state.user
        },
        getSignInAnswer(state): Record<string, unknown> {
            return state.signInAnswer
        },
        getCart(state): ICart {
            return state.cart
        },
        getUserCartProducts(state): IProduct[] {
            if(state.cart.products !== undefined) {
                let arr = [] as IProduct[]
                for(const cartItem of state.cart.products) {
                    const arr2: IProduct[] = state.products.filter(productsItem => productsItem.id === cartItem.productId)
                    arr = arr.concat(arr2)
                }
                return arr
            } else {
                return state.userCartProducts
            }
        },
        getUserCartQuantity(state): number[] {
            if(state.cart.products !== undefined) {
                const arr = [] as number[]
                for(const cartItem of state.cart.products) {
                    state.products.forEach(productsItem => {
                        if(productsItem.id === cartItem.productId) arr.push(cartItem.quantity)
                    })
                }
                return arr
            } else {
                return state.userCartQuantity
            }
        },
    },
    mutations: {
        // Search mutation
        updateSearch(state, value) {
            state.search = value
        },

        // Flags mutations
        showLogIn(state) {
            state.isLogInShown = true
        },
        hideLogIn(state) {
            state.isLogInShown = false
        },
        userAuthorized(state) {
            state.isUserAuthorized = true
        },
        userNotAuthorized(state) {
            state.isUserAuthorized = false
        },
        waitingOn(state) {
            state.waiting = true
        },
        waitingCompleted(state) {
            state.waiting = false
        },

        // Data mutations
        setProducts(state, products) {
            state.products = products
        },
        setCategories(state, categories) {
            state.categories = categories
        },
        setUser(state, user) {
            state.user = user
        },
        setSignInAnswer(state, answer) {
            state.signInAnswer = answer
        },
        setCart(state, cart) {
            state.cart = cart
        },
        updateCart(state, updatedCart: ICart) {
            const a: any = state.cart.products.map(cartProduct => {
                if(cartProduct.productId === updatedCart.products[0].productId) {
                    return cartProduct = updatedCart.products[0]
                } else {
                    return cartProduct
                }
            })
            state.cart.products = a
        },
        deleteItemFromCart(state, id) {
            const index: number = state.cart.products.findIndex(cartProduct => {
               return cartProduct.productId === id
            })
            state.cart.products.splice(index, 1)
        },
        addItemToCart(state, id) {
            let flag = false
            state.cart.products.forEach(product => {
                product.productId === id ? flag = true : flag = false
            })
            if(!flag) {
                state.cart.products.push({
                    productId: id,
                    quantity: 1,
                })
            }
        },
    },
    actions: {
        // API GET methods
        getProducts({commit}) {
            fetch('https://fakestoreapi.com/products')
                .then(response => response.json())
                .then(products => commit('setProducts', products))
        },
        getCategories({commit}) {
            fetch('https://fakestoreapi.com/products/categories')
            .then(response => response.json())
            .then(categories => commit('setCategories', categories))
        },
        getUser({commit}) {
            fetch('https://fakestoreapi.com/users/1')
            .then(response => response.json())
            .then(user => commit('setUser', user))
        },
        getCart({commit}) {
            fetch('https://fakestoreapi.com/carts/1')
            .then(response => response.json())
            .then(cart => commit('setCart', cart))
        },
        
        // API POST methods
        postUserSignIn({commit}, [username, password]) {
            fetch('https://fakestoreapi.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })
            .then(response => response.json())
            .then(answer => commit('setSignInAnswer', answer))
        },

        // API UPDATE methods
        patchOneItemToCart({commit}, [quantity, id ,user]) {
            fetch('https://fakestoreapi.com/carts/1',{
                method:"PATCH",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body:JSON.stringify(
                    {
                        userId: user,
                        date: '2019-12-10',
                        products:[{
                            productId: id,
                            quantity: quantity
                        }]
                    }
                )
            })
                .then(response => response.json())
                .then(updatedCart => commit('updateCart', updatedCart))
        },
        deleteItemFromCart({commit}, id) {
            commit('deleteItemFromCart', id); 
        },
        addItemToCart({commit}, id) {
            commit('addItemToCart', id); 
        },
    }
})
