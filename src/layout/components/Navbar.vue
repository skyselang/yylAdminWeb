<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <span style="display:inline-block;float:left;margin-right:10px;color:#409eff" title="个人中心">
          <router-link :to="userCenter">
            {{ nickname }}
          </router-link>
        </span>

        <search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <size-select id="size-select" class="right-menu-item hover-effect" />
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar v-if="avatar" shape="circle" fit="contain" :size="48" :src="avatar" />
          <el-avatar v-else icon="el-icon-user-solid" :size="48" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" style="text-align:center">
          <router-link :to="userCenter">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>控制台</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <span style="display:inline-block;float:right;margin-right:10px;color:#409eff">
        <el-button v-if="checkPermission(['admin/admin.Setting/cacheClear'])" v-loading="loading" icon="el-icon-delete" circle title="清除缓存" @click="clearCache" />
      </span>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { cacheClear } from '@/api/admin/setting'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import {} from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
      loading: false,
      userCenter: '/system/user-center'
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'device', 'nickname', 'avatar'])
  },
  methods: {
    checkPermission,
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push('/login')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 清除缓存
    clearCache() {
      this.loading = true
      cacheClear().then(res => {
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 0px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 0px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
