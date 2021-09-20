<template>
    <div class="user-menu">

        <div class="user-menu-caption">
            Signed in as :
        </div>
        <div class="user-menu-data">{{user.name.firstname + ' ' + user.name.lastname}}</div>

        <div class="user-menu-caption">
            Username:
        </div>
        <div class="user-menu-data">{{user.username}}</div>

        <div class="user-menu-caption">
            Email:
        </div>
        <div class="user-menu-data">{{user.email}}</div>

        <div class="user-menu-caption">
            Address:
        </div>
        <div class="user-menu-data">{{user.address.city + ', ' + user.address.street + ', ' + user.address.number}}</div>

        <button class="user-menu-out" @click="logOut">Sign out</button>

    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    computed: {
        // User data from API
        user() {
            return this.$store.getters.getUser
        },
    },
    methods: {
        logOut() {
            this.$store.commit('setSignInAnswer', {status: 'Log out'})
            this.$emit('onLogOut')
        }
    }
})
</script>


<style lang="scss" scoped>
    .user-menu {
        min-width: 260px;
        position: absolute;
        top: 50px;
        right: 0;
        padding: 26px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 0 14px var(--shadow-light);
        z-index: 99;

        &::after {
            content: '';
            position: absolute;
            right: 30px;
            top: -16px;
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 16px solid #fff;
        }
    }
    .user-menu-caption {
        padding: 6px 0;
        font-weight: 500;
        font-style: 16px;
    }
    .user-menu-data {
        padding: 6px 0;
        font-weight: 700;
        font-style: 16px;
        border-bottom: 1px solid var(--grey-light);
        margin-bottom: 12px;
    }
    .user-menu-out {
        margin-top: 12px;
        padding: 0;
        border: 0;
        background-color: #fff;
        cursor: pointer;

        font-weight: 500;
        font-size: 16px;
        color: var(--main-dark);

        &:hover {
            text-decoration: underline;
        }
    }
</style>