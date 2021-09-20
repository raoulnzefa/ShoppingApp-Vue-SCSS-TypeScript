<template>
    <Header />
    <Main />
    <div class="waiting" v-if="waiting">
      <div class="waiting-item-1">
        <div class="waiting-item-2"></div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/Header.vue';
import Main from '@/components/Main.vue';

// TypeScript vuex store fix
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
declare module '@vue/runtime-core' {
  interface State {
    count: number
  }
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

export default defineComponent({
    name: 'App',
    components: {
        Header, Main
    },
    computed: {
      waiting() {
        return this.$store.getters.waiting
      }
    }
});
</script>

<style lang="scss">
  @import url('./assets/scss/base.scss');
  @import url('./assets/scss/fonts.scss');
  @import url('./assets/scss/variables.scss');

  .waiting {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.2);

    .waiting-item-1 {
      position: absolute;
      left: 45%;
      top: 20%;
      background-color: var(--main-dark);
      opacity: 1;
      width: 120px;
      height: 120px;
      border-radius: 60px;
      z-index: 999;
      animation: 1s linear infinite rotate_animation;
    }
    .waiting-item-2 {
      background-color: #fff;
      width: 30px;
      height: 30px;
      border-radius: 15px;
    }
  }

  @keyframes rotate_animation {
    0% {
      transform: rotate(0) scale(0.95);
    }
    50% {
      transform: rotate(180deg) scale(1.05);
    }
    100% {
      transform: rotate(360deg) scale(0.95);
    }

  }
</style>
