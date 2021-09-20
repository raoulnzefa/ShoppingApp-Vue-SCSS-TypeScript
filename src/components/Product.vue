<template>
    <div class="card">
        <div class="card-pic">
            <img :src="image" :alt="title" class="card-img">
        </div>
        <div class="card-wrapper">
            <div class="card-category">{{category}}</div>
            <h2 class="card-title">{{title}}</h2>
            <div class="card-price">${{price}}</div>
            <p class="card-description">{{description}}</p>
            <button class="card-button" @click="$emit('onAdd', id)">Add to cart</button>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: ['id', 'title', 'price', 'category', 'description', 'image'],
})
</script>


<style lang="scss" scoped>
.card {
    padding: 16px;
    border-radius: 8px;
    display: flex;

    &:hover {
        box-shadow: 0px 0px 18px var(--shadow-light);
    }

    // If view-grid button is clicked
    &.view-type-grid {
        flex-direction: column;
    }
    
    // If view-list button is clicked
    &.view-type-list {
        flex-direction: row;
        padding: 32px;
        margin-bottom: 20px;
    }
    &.view-type-list .card-pic{
        padding: 16px;
        margin-right: 24px;
        height: auto;
        width: 200px;
        flex-shrink: 0;
    }
}
.card-wrapper {
    display: flex;
    flex-direction: column;
}
.card-pic {
    padding: 16px 0;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.card-img {
    max-width: 100%;
    max-height: 100%;
}
.card-category {
    color: var(--grey-dark);
    margin-bottom: 6px;
}
.card-price {
    margin: 12px 0;
    font-weight: 700;
    font-size: 28px;
}
.card-description {
    color: var(--grey-dark);
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 24px;
}
.card-button {
    margin-top: auto;
    padding: 4px 12px;
    align-self: start;

    border-radius: 4px;
    border: 2px solid var(--main-dark);
    background-color: #fff;
    cursor: pointer;

    font-weight: 700;
    font-size: 16px;
    color: var(--main-dark);

    &:hover {
        background-color: var(--main-light);
    }
    &:active {
        transform: scale(0.99);
    }
}


@media screen and (max-width: 768px) {
    .card-pic {
        height: 160px;
    }
    .card-category {
        font-size: 12px;
    }
    .card-title {
        font-size: 18px;
    }
    .card-price {
        font-size: 22px;
    }

    .card {
        // If view-list button is clicked
        &.view-type-list {
            padding: 16px;
            margin-bottom: 10px;
        }
        &.view-type-list .card-pic{
            padding: 16px;
            margin-right: 12px;
            width: 140px;
        }
    }
}


@media screen and (max-width: 567px) {
    .card {
        padding: 8px;

        // If view-list button is clicked
        &.view-type-list {
            padding: 8px;
            flex-direction: column;   
            margin-bottom: 0;         
        }
        &.view-type-list .card-pic{
            padding: 16px 0;
            margin-right: 0px;
            height: 160px;
            width: 100%;
            flex-shrink: 1;
        }
    }
    .card-button {
        align-self: center;
    }
}

</style>