<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-4" />
      Boat management
    </v-app-bar-title>
  </v-app-bar>
  <v-alert
    v-model="alert"
    close-text="Close Alert"
    color="deep-purple accent-4"
    class="alert-forgot"
    dark
    dismissible
  >
    <div class="d-flex align-center">
      <span>
        {{ message }}
      </span>
      <v-btn
        color="white"
        size="large"
        variant="elevated"
        class="ml-auto"
        @click="closeAlert()"
        >Đóng</v-btn
      >
    </div>
  </v-alert>
  <div class="container">
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="748"
      rounded="lg"
    >
      <h2 class="text-center">Quên mật khẩu</h2>

      <div class="text-subtitle-1 text-medium-emphasis">
        <span> Email đăng nhập </span>
        <v-text-field
          variant="outlined"
          placeholder="Email"
          v-model="email"
          class="mt-3"
          :rules="[rules.required, rules.email]"
        />
      </div>
      <div class="text-subtitle-1 text-medium-emphasis">
        <span> Số điện thoại </span>
        <v-text-field
          variant="outlined"
          placeholder="Số điện thoại"
          v-model="phonenumber"
          class="mt-3"
          :rules="[rules.required, rules.phonenumber]"
        />
      </div>
      <div class="text-subtitle-1 text-medium-emphasis">
        <span>Mật khẩu mới</span>
        <v-text-field
          variant="outlined"
          placeholder="Mật khẩu"
          v-model="password"
          type="password"
          :rules="[rules.required, rules.counter]"
        />
      </div>
      <div class="text-subtitle-1 text-medium-emphasis">
        <span>Nhập lại mật khẩu</span>
        <v-text-field
          variant="outlined"
          placeholder="Mật khẩu"
          v-model="newPassword"
          type="password"
          :rules="[rules.required, rules.counter]"
        />
      </div>
      <v-link class="mb-3 text-underline" @click="backToLogin()"
        >Quay lại màn hình đăng nhập</v-link
      >
      <v-btn
        block
        class="mb-8 mt-3"
        color="green"
        size="large"
        variant="elevated"
        @click="forgot()"
        :disabled="disable"
      >
        Cập nhật mật khẩu mới
      </v-btn>
    </v-card>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { forgotPassword } from "@/firebase";

export default {
  data: () => ({
    visible: false,
    email: "",
    password: "",
    newPassword: "",
    phonenumber: "",
    message: "",
    alert: false,
    disable: true,
    rules: {
      required: (value: any) => !!value || "Xin mời nhập trường yêu cầu.",
      counter: (value: any) =>
        value.length >= 6 || "Xin mời nhập tối thiểu 6 ký tự",
      email: (value: any) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Email không hợp lệ.";
      },
      phonenumber: (value: any) => {
        const pattern = /([\\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
        return pattern.test(value) || "Số điện thoại không hợp lệ.";
      },
    },
  }),
  watch: {
    email() {
      this.disable = !this.validate();
    },
    password() {
      this.disable = !this.validate();
    },
    newPassword() {
      this.disable = !this.validate();
    },
    phonenumber() {
      this.disable = !this.validate();
    },
  },
  methods: {
    async forgot() {
      if (this.validate()) {
        const isForgotOk = await forgotPassword(
          this.email,
          this.phonenumber,
          this.password
        );
        if (isForgotOk) {
          this.alert = true;
          this.message = "Bạn đã thay đổi mật khẩu thành công";
          setTimeout(() => {
            this.alert = false;
          }, 1000);
          setTimeout(() => {
            this.$router.push("/");
          }, 1000);
        } else {
          this.alert = true;
          this.message = "Bạn lấy lại mật khẩu không thành công. Xin thử lại";
          setTimeout(() => {
            this.alert = false;
          }, 3000);
        }
      }
    },
    closeAlert() {
      this.alert = false;
    },
    validate() {
      if (
        !_.isEmpty(this.email) &&
        !_.isEmpty(this.password) &&
        !_.isEmpty(this.newPassword) &&
        !_.isEmpty(this.phonenumber) &&
        this.newPassword === this.password
      ) {
        return true;
      }
      return false;
    },
    backToLogin() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 150px;
}
.text-underline {
  text-decoration: underline;
  cursor: pointer;
}
</style>
