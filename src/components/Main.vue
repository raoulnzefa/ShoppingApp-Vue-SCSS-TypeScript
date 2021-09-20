<template>
    <main class="main">
        <section class="categories">
            <ul class="categories-list">
                <li class="categories-item"
                    :class="{active : selectedCategory === 'all'}"
                    @click="selectedCategory = 'all'"
                >
                    <div class="categories-item-name">All products</div>
                    <div class="categories-item-icon all"></div>
                </li>
                <li 
                    class="categories-item"
                    v-for="(category, i) in categories" :key="i"
                    :class="{active : selectedCategory === category}"
                    @click="selectCategory(category); resetPagination()"
                >
                    <div class="categories-item-name">{{category}}</div>
                    <div 
                        class="categories-item-icon"
                        :class="categoriesClasses[i]"
                    ></div>
                </li>
            </ul>
        </section>

        <section class="products">
            <div class="filters">

                <div class="display">
                    <div class="display-name">Results per page:</div>    
                    <select 
                        class="display-select" 
                        v-model="resultsPerPage"
                        @change="resetPagination()"
                    >
                        <option value="6">6</option>
                        <option value="12">12</option>
                        <option value="all">all</option>
                    </select> 
                    <div class="display-info">{{from}}-{{to}} of {{searchedProducts.length}} results</div>
                </div>

                <div class="sort">
                    <div class="sort-name">Sort by:</div>
                    <select 
                        class="sort-select"
                        v-model="sortingType"
                        @change="resetPagination"
                    >
                        <option value="priceToHigh">Price: Low to High</option>
                        <option value="priceToLow">Price: High to Low</option>
                    </select> 
                </div>

                <div class="view">
                    <button 
                        class="view-button view-button-list"
                        @click="viewType ='view-type-list'"
                        :class="{active : viewType === 'view-type-list'}"
                    ></button>
                    <button 
                        class="view-button view-button-grid"
                        @click="viewType ='view-type-grid'"
                        :class="{active : viewType === 'view-type-grid'}"
                    ></button>
                </div>

            </div>

            <div 
                class="cards" 
                :class="viewType"
                v-if="paginatedProducts.length > 0"
            >
                <Product 
                    v-for="(product, i) in paginatedProducts" :key="i"
                    :class="viewType"
                    @onAdd="addItemToCart"

                    :id="product.id"
                    :title="product.title"
                    :price="product.price"
                    :category="product.category"
                    :description="product.description"
                    :image="product.image"
                />
            </div>
            <div class="cards-no-cards" v-else>
                No products
            </div>

            <ul class="pages">
                <li 
                    class="page"
                    v-for="i in pages" :key="i"
                    @click="selectPage(i)"
                    :class="{active : selectedPage === i}"
                >{{i}}</li>
            </ul>

        </section>
    </main>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import Product from '@/components/Product.vue';
import IProduct from '@/types/IProduct.interface';

export default defineComponent({
    data() {
        return {
            // Categories filters
            selectedCategory: 'all',

            // Sorting
            sortingType: 'priceToHigh',

            // Pagination
            resultsPerPage: '6',
            selectedPage: 1,

            // Product cards view
            viewType: 'view-type-grid',
        }
    },
    watch: {
        // Reset pagination when searching
        search() {
            this.resetPagination()
        }
    },
    computed: {
        // Search
        search() {
            return this.$store.getters.getSearch
        },

        // Flags
        isUserAuthorized() {
            return this.$store.getters.isUserAuthorized
        },

        // PRODUCTS
        // Get all products from API
        products(): IProduct[] {
            return this.$store.getters.getProducts
        },
        // Get product according to the category filter
        filteredProducts(): IProduct[] {
            if(this.selectedCategory !== 'all') {
                return this.products.filter(product => product.category === this.selectedCategory)
            } else {
                return this.products
            }
        },
        // Sort products according to the selected sorting type
        sortedProducts(): IProduct[] {
            if(this.sortingType === 'priceToHigh') {
                return [...this.filteredProducts].sort((a, b) => {
                    return +a.price - +b.price
                }) 
            } else
            if(this.sortingType === 'priceToLow') {
                return [...this.filteredProducts].sort((a, b) => {
                    return +b.price - +a.price
                }) 
            } else {
                return this.filteredProducts
            }
        },
        // Get products according to the seach input
        searchedProducts(): IProduct[] {
            if(this.search !== '') {
                return this.sortedProducts.filter(product => {
                    return product.title.toLowerCase().includes(this.search.toLowerCase())
                })
            } else {
                return this.sortedProducts
            }
        },
        // Get products according to the selected page and quantity per page
        paginatedProducts(): IProduct[] {
            if(this.resultsPerPage !== 'all') {
                return this.searchedProducts.slice(this.from - 1, this.to) 
            } else {
                return this.searchedProducts
            }  
        },
        

        // CATEGORIES
        // Get categories from API
        categories(): string[] {
            return this.$store.getters.getCategories
        },
        // Create appropriate classes from categories 
        categoriesClasses(): string[] {
            return this.categories.map((category: string): string => {
                if (category === "men's clothing") return 'male-clothes'
                if (category === "women's clothing") return 'female-clothes'
                else return category
            })
        },
 
        // PAGINATION
        // Calculate the number of pages
        pages(): number {
            if(this.resultsPerPage !== 'all') {
                return Math.ceil(this.searchedProducts.length/+this.resultsPerPage)
            } else {
                return 1
            }  
        },
        from: {
            get(): number {
                if(this.resultsPerPage !== 'all') {
                    return +this.resultsPerPage * (this.selectedPage - 1) + 1
                } else {
                    return 1
                }
            },
            set(value): number {
                return value
            }
        },
        to: {
            get(): number {

                if(this.resultsPerPage !== 'all') {
                    if(+this.resultsPerPage * this.selectedPage > this.searchedProducts.length) {
                        return this.searchedProducts.length
                    } else {
                        return +this.resultsPerPage * this.selectedPage
                    }
                } else {
                    return this.searchedProducts.length
                }
            },
            set(value): number {
                return value
            }
        },
    },
    methods: {
        // Categories
        selectCategory(category: string) {
            this.selectedCategory = category
        },

        // Pagination
        selectPage(i: number) {
            this.selectedPage = i
        },
        resetPagination() {
            this.selectedPage = 1
            this.from = 1
            this.to = 6
            if(this.to > this.searchedProducts.length) this.to = this.searchedProducts.length 
        },

        // Cart
        addItemToCart(id: number) {
            // If user is already authorized 
            if(this.isUserAuthorized === true) {
                this.$store.dispatch('addItemToCart', id)
            } else {
            // If user is not authorized yet
                this.$store.commit('showLogIn')
            }
        }
    },
    mounted() {
        // Get products from API
        this.$store.dispatch('getProducts')
        // Get categories from API
        this.$store.dispatch('getCategories')
    },
    components: {
        Product
    },

})
</script>


<style lang="scss" scoped>
.main {
    max-width: 1024px;
    margin: 0 auto;
    margin-bottom: 40px;
}

// Categories section
.categories {
    padding: 30px 0 20px;
    padding-bottom: 35px;
}

.categories-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
}
.categories-item {
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
        background-color: var(--main-light);
    }

    &.active {
        background-color: var(--main-light);
        box-shadow: inset 0px 0px 4px var(--shadow);
    }
}
.categories-item-name {
    margin-right: 8px;
    font-weight: 500;
    font-size: 16px;
    color: var(--grey-dark);
}
.categories-item-icon {
    width: 24px;
    height: 24px;
    background: no-repeat center / 24px;

    &.all {
        background-image: url('../assets/icons/all-products.svg')
    }
    &.male-clothes {
        background-image: url('../assets/icons/male-clothes.svg')
    }
    &.female-clothes {
        background-image: url('../assets/icons/female-clothes.svg')
    }
    &.electronics {
        background-image: url('../assets/icons/electronics.svg')
    }
    &.jewelery {
        background-image: url('../assets/icons/jewelry.svg')
    }
}


// Products section
.products {
    padding: 16px;
    box-shadow: -1px 1px 4px var(--shadow-dark);
    border-radius: 8px;
}


// Filters
.filters {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    font-weight: 500;
    font-size: 14px;
    color: var(--dark);
}

// Pagination
.display {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-right: auto;
}
.display-name {
    margin-right: 12px;
}
.display-select {
    padding: 2px 0px 2px 4px;
    border: 1px solid var(--grey-dark);
    border-radius: 6px;
    margin-right: 24px;

    font-weight: 500;
    font-size: 13px;
    color: var(--dark);
}
.display-info {
    font-weight: 700;
}

// Sorting
.sort {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    margin-right: 24px;
}
.sort-name {
    margin-right: 12px;
}
.sort-select {
    padding: 2px 4px;
    border: 1px solid var(--grey-dark);
    border-radius: 6px;

    font-weight: 500;
    font-size: 13px;
    color: var(--dark);
}

// Product cards view
.view-button {
    width: 42px;
    height: 36px;
    border: 0;
    border-radius: 4px;
    background:no-repeat center / 24px;
    cursor: pointer;

    &:hover {
        background-color: var(--main-light);
    }

    &.active {
        background-color: var(--main-light);
        box-shadow: inset 0px 0px 4px var(--shadow);
    }
}
.view-button-list {
    background-image: url('../assets/icons/view-list.svg');
    
}
.view-button-grid {
    background-image: url('../assets/icons/view-grid.svg');
}


// Cards
.cards {
    padding: 16px;
    display: grid;
    column-gap: 36px;

    // If view-grid button is clicked
    &.view-type-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    // If view-list button is clicked
    &.view-type-list {
        grid-template-columns: repeat(1, 1fr);
    }

}
.cards-no-cards {
    padding: 120px 0;
    font-weight: 700;
    font-size: 22px;
    text-align: center;
}

// Pages
.pages {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 8px;
}
.page {
    padding: 6px 8px;
    border-radius: 3px;
    box-shadow: inset 0px 0px 4px var(--shadow);
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;

    &:hover, &.active {
        background-color: var(--main-light);
    }
}



@media screen and (max-width: 1024px) {
    .main {
        margin: 0 20px;
    }
}


@media screen and (max-width: 920px) {
    .cards {
        gap: 24px;
        padding: 16px 0;

        // If view-grid button is clicked
        &.view-type-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        // If view-list button is clicked
        &.view-type-list {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}

@media screen and (max-width: 768px) {
    .sort-name {
        margin-bottom: 4px;
    }
    .view {
        max-width: 45px;
    }
}

@media screen and (max-width: 567px) {
    .main {
        margin: 0;
    }
    .products {
        padding: 16px 12px;
    }
    .cards {

        // If view-grid button is clicked
        &.view-type-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
        }
        // If view-list button is clicked
        &.view-type-list {
            grid-template-columns: repeat(1, 1fr);
        }        
    }

    .categories {
        padding: 15px 10px 10px;
    }
    .categories-list {
        gap: 5px;
    }
    .categories-item{
        padding: 2px 8px;
    }
    .categories-item-name {
        font-size: 12px;
        margin-right: 4px;
    }
    .categories-item-icon {
        background-size: 18px;
    }

    .filters {
        align-items: start;
        gap: 8px;
    }
    .display-name {
        font-size: 12px;
        margin-bottom: 4px;
    }
    .display-info {
        font-size: 12px;
    }
    .display-select {
        padding: 0;
        font-size: 12px;
    }
    .sort-name {
        font-size: 12px;
    }
    .sort-select {
        padding: 0;
        font-size: 12px;
    }
    .view {
        opacity: 0;
        position: absolute;
        right: -1000px;
        display: none;
    }

}

</style>