<template>
  <div class="login-page" style="background-image: url(../sea-dock.jpeg)">
    <!-- <v-app-bar flat>
      <v-app-bar-title>
        <v-icon icon="mdi-circle-slice-4" />
        Quản lý bến tàu
      </v-app-bar-title>
    </v-app-bar> -->
    <v-alert
      v-model="alertOut"
      close-text="Close Alert"
      :color="alertColor"
      class="alert-forgot"
      dark
      dismissible
    >
      <div class="d-flex align-center">
        <span>
          {{ messageOut }}
        </span>
      </div>
    </v-alert>
    <v-container class="pa-0">
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <v-alert
          v-model="alertError"
          close-text="Close Alert"
          :color="alertColor"
          dark
          dismissible
        >
          <div class="d-flex align-center">
            <span>
              {{ message }}
            </span>
          </div>
        </v-alert>
        <div class="text-subtitle-1 text-medium-emphasis">Email đăng nhập</div>
        <v-text-field
          variant="outlined"
          placeholder="Email"
          v-model="email"
          @keyup.enter="login()"
        />
        <div class="text-subtitle-1 text-medium-emphasis">Mật khẩu</div>
        <v-text-field
          variant="outlined"
          placeholder="Mật khẩu"
          v-model="password"
          type="password"
          @keyup.enter="login()"
        />
        <v-link class="mb-3 text-underline" @click="openPopup()"
          >Quên mật khẩu</v-link
        >
        <v-btn
          block
          class="mb-8 mt-3"
          color="green"
          size="large"
          variant="elevated"
          @click="login()"
          :disabled="disable"
        >
          Đăng nhập
        </v-btn>
      </v-card>
    </v-container>
  </div>
  <v-dialog v-model="open" width="auto">
    <v-card>
      <v-card-text
        class="d-flex flex-column justify-center align-center flex-wrap"
      >
        <h3>
          Liên lạc với ban quản lý qua số điện thoại sau để thay đổi mật khẩu
        </h3>
        <a :href="'tel:' + contactNumber" class="contact-number">
          <v-icon size="large" color="green-darken-2" icon="mdi-phone"></v-icon>

          {{ contactNumber }}
        </a>
      </v-card-text>
      <div class="d-flex justify-center align-center">
        <v-btn
          class="mb-8 mt-3"
          color="green"
          variant="elevated"
          @click="open = false"
        >
          Đóng
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { getUsers } from "@/firebase";

export default {
  data: () => ({
    visible: false,
    email: "",
    password: "",
    disable: true,
    message: "",
    messageOut: "Bạn vừa mới đăng xuất thành công.",
    alertColor: "",
    alertError: false,
    alertOut: false,
    open: false,
    contactNumber: "",
  }),
  watch: {
    password() {
      this.validateLogin();
    },
    email() {
      this.validateLogin();
    },
  },
  created(): void {
    this.getUsers();
    if (this.$store.state.user.justLogOut) {
      this.alertColor = "green";
      this.alertOut = true;
      setTimeout(() => {
        this.alertOut = false;
        this.$store.dispatch("reset");
      }, 2000);
    }
  },

  methods: {
    async login() {
      this.$emit("handleLoading", true);
      const loginVal = { email: this.email.trim(), password: this.password };
      console.log(loginVal)
      const loggedIn = await this.$store.dispatch("logIn", loginVal);
      if (loggedIn) {
        this.alertColor = "green";
        this.alertOut = true;
        this.messageOut =
          "Bạn đăng nhập thành công xin đợi giây lát để chuyển trang";
        setTimeout(() => {
          if (this.$store.state.user.loggedIn) {
            this.$router.push("list");
            this.$emit("handleLoading", false);
          }
          this.alertOut = false;
        }, 1000);
      } else {
        this.alertError = true;
        this.alertColor = "red";
        this.message = "Email/password chưa đúng xin mời thử lại";
        this.$emit("handleLoading", false);
      }
    },
    async getUsers() {
      this.$emit("handleLoading", true);
      const dataUser = await getUsers();
      const pattern = /([\\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
      const manageUser = dataUser.filter(
        (item) => item.role === "manager" && pattern.test(item.phonenumber)
      );
      this.contactNumber =
        manageUser?.length > 0 ? manageUser[0].phonenumber : "09013599921";
      this.$emit("handleLoading", false);
    },
    validateLogin() {
      this.disable = this.email === "" || this.password === "";
    },
    openPopup() {
      this.open = true;
    },
    closeAlert() {
      this.alertError = false;
    },
    closeAlertOut() {
      this.alertOut = false;
    },
  },
};
</script>

<style scoped>
.text-underline {
  text-decoration: underline;
  cursor: pointer;
}
.contact-number {
  font-size: 20px;
  font-weight: 700;
  color: green;
  text-decoration: none;
  margin-top: 15px;
}
.alert-forgot {
  position: fixed;
  top: 0;
  z-index: 99999;
  width: auto;
  right: 0;
}
.login-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: bottom center;
  background-repeat: no-repeat;
}
</style>
