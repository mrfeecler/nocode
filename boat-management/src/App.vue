<template>
  <div>
    <v-layout row justify-center v-if="!isLogginUrl">
      <v-toolbar
        app
        dark
        color="blue-grey darken-1"
        class="hidden-xs-and-down header-area"
        v-if="roleUser"
      >
        <v-toolbar-title>
          <v-btn
            to="/list"
            style="
              display: flex;
              width: auto;
              height: auto;
              display: flex;
              justify-content: flex-start;
            "
            variant="text"
            class="bta-logo"
          >
            <img :src="`../logo_benthuynoidia.svg`" />
          </v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            v-for="item in nav"
            :key="item.icon"
            :to="item.url"
            :title="item.title"
            flat
          >
            <img :src="item.icon" />
            {{ item.text }}
          </v-btn>

          <div class="d-flex align-center pl-4 info-area">
            <img :src="`../update_profile.svg`" />
            <div>
              <p>{{ name }}</p>
              <p>{{ email }}</p>
              <p class="icon-area">
                <v-icon>mdi-chevron-down</v-icon>
              </p>
              <div class="sub-item">
                <v-btn
                  :to="`/info-user`"
                  title="Thông tin người dùng"
                  flat
                  class="pt-3 pb-3"
                >
                  Cập nhật thông tin</v-btn
                >
                <v-btn flat @click="logOutUser" :to="`/`" class="pt-3 pb-3">
                  Đăng xuất
                </v-btn>
              </div>
            </div>
          </div>
        </v-toolbar-items>
      </v-toolbar>
    </v-layout>
    <router-view />
  </div>
</template>

<script lang="ts">
interface NavType {
  icon: string;
  url: string;
  title: string;
  text: string;
  active: boolean;
}
import { getListVehicle } from "@/firebase";
export default {
  data() {
    return {
      dialog: false,
      vehicle: [] as any,
      isLogginUrl: this.$route.path === "/",
      email: "",
      name: "",
      nav: [] as NavType[],
      roleUser: "",
    };
  },
  created(): void {
    this.getVehicle();
    this.name = this.$store.state.user.data?.name;
    this.email = this.$store.state.user.data?.email;
  },
  watch: {
    $route(to, from) {
      console.log(this.$route.path);
      this.isLogginUrl = this.$route.path === "/";
      if (!(to.path === "/" || to.path === "/forgot")) {
        if (!this.$store.state.user.loggedIn) {
          this.$router.push("/");
        }
      }
      if (this.$store.state.user.data?.role) {
        this.roleUser = this.$store.state.user.data?.role;
        this.checkRoleUser(this.$store.state.user.data?.role);
        this.name = this.$store.state.user.data?.name;
        this.email = this.$store.state.user.data?.email;
      }
      if (
        this.roleUser !== "admin" &&
        (["/users"].includes(to.path) || to.path.includes("/user"))
      ) {
        this.$router.push("/list");
      }
      if (
        this.roleUser !== "manager" &&
        (["/vehicles"].includes(to.path) || to.path.includes("/vehicle"))
      ) {
        this.$router.push("/list");
      }
      if (this.roleUser !== "enterprise" && to.path === "/form") {
        this.$router.push("/list");
      }
    },
  },
  methods: {
    async getVehicle() {
      const list = await getListVehicle();
      this.vehicle = list;
    },
    logOutUser() {
      this.$store.dispatch("reset");
      this.$store.dispatch("logOut");
    },
    checkRoleUser(role: string) {
      this.nav = [
        {
          icon: "../lists.svg",
          text: "Danh sách",
          title: "Danh sách",
          url: "/list",
          active: true,
        },
      ];
      if (role === "manager") {
        this.nav.push({
          icon: "../ship.svg",
          text: "Quản lý phương tiện",
          title: "Quản lý phương tiện",
          url: "/vehicles",
          active: false,
        });
      }
      if (role === "admin") {
        this.nav.push({
          icon: "../all_users.svg",
          text: "Quản lý người dùng",
          title: "Quản lý người dùng",
          url: "/users",
          active: false,
        });
      }
    },
  },
};
</script>
<style>
table tbody tr:hover {
  background: #d0d0d0;
}
table tr:nth-child(even) {
  background: #f4f4f4;
}
.min-width-table table {
  min-width: 1600px;
}
table thead {
  background-color: #c7c7c794;
}
.v-toolbar-items img {
  max-width: 30px;
  max-height: 30px;
  margin-right: 4px;
}
.bta-logo span {
  background: none !important;
}
.bta-logo img {
  max-width: 150px;
}
.v-field.v-field--prepended {
  height: 40px;
}
div input.dp__input,
div.v-field__input,
input.v-field__input {
  padding-top: 8px;
  padding-bottom: 8px;
  min-height: 40px;
  height: 40px;
}
.sub-item {
  display: none;
}
.info-area {
  cursor: pointer;
  position: relative;
  z-index: 100;
  min-width: 200px;
  padding-right: 40px;
}
.info-area .icon-area {
  position: absolute;
  top: 50%;
  right: 5px;
  border-radius: 50%;
  transform: translateY(-50%);
}
.info-area:hover {
  background: #04b4ff;
}
.info-area:hover .icon-area {
  transform: rotate(180deg) translateY(50%);
}
.info-area:hover .sub-item > * {
  width: 100%;
  text-align: left;
  justify-content: flex-start;
  text-transform: unset;
  font-weight: 400;
}
.info-area:hover .sub-item > a.v-btn {
  border-bottom: 1px solid #686868;
  border-radius: 0;
}
.info-area:hover .sub-item > a.v-btn:last-child {
  border-bottom: 0;
}
.info-area:hover .sub-item .v-btn__overlay {
  background: white;
}
.info-area:hover .sub-item {
  display: flex;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  flex-direction: column;
  align-items: flex-start;
  color: black;
  border: 1px solid #686868;
  border-width: 0 0 1px 1px;
  width: 100%;
}
.info-area:hover .sub-item > *:hover {
  background-color: #686868;
  color: white;
}
.header-area.v-toolbar {
  overflow: unset;
}
.v-row {
  margin: 0 -12px !important;
}
</style>
