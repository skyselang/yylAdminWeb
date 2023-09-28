<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logoUrl" :src="logoUrl" class="sidebar-logo">
        <img v-else-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ systemName }} </h1>
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logoUrl" :src="logoUrl" class="sidebar-logo">
        <img v-else-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ systemName }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import logo from '@/assets/logo/logo.png'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      logo: logo
    }
  },
  computed: {
    ...mapGetters(['systemName', 'logoUrl'])
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: var(--theme, #2b2f3a);
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 2px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 156px;
      overflow: hidden;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
