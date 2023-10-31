<template>
  <v-alert
    v-model="alert"
    close-text="Close Alert"
    class="alert-forgot"
    :color="alertColor"
    dark
    dismissible
  >
    <div class="d-flex align-center">
      <span>
        {{ messageAlert }}
      </span>
    </div>
  </v-alert>
  <div class="data-container" style="max-width: 768px; margin: auto">
    <h2 class="mb-5 mt-5">Thông tin người dùng</h2>
    <div class="grey lighten-4 nft-page create-qr-page contentsWrapStyle">
      <v-row>
        <v-col cols="12" class="pb-0">
          <h4>Email: {{email}}</h4>
        </v-col>
        <v-col cols="12" class="pb-0">
          <h4>Tên: {{name}}</h4>
        </v-col>
        <v-col cols="12" class="pb-0">
          <h4>Số điện thoại: {{phonenumber}}</h4>
        </v-col>
        <v-col cols="12" class="pb-0" v-if="currentRole === 'manager'">
          <h4>Vai trò người dùng: </h4>
          {{role}}
        </v-col>
      </v-row>

      <v-row v-if="currentRole !== 'enterprise' && role === 'enterprise'">
        <v-col cols="12">
          <h4>Công ty:</h4>
          {{company}}
        </v-col>
      </v-row>

      <div class="pt-5">
        <v-row>
          <v-col cols="6">
            <h4>Mật khẩu mới</h4>

            <v-text-field
              class="mt-3"
              variant="outlined"
              placeholder="Mật khẩu mới"
              type="password"
              v-model="newPassword"
              :rules="passwordRules"
            />
          </v-col>
          <v-col cols="6">
            <h4>Nhập lại mật khẩu</h4>

            <v-text-field
              class="mt-3"
              variant="outlined"
              placeholder="Nhập lại mật khẩu"
              type="password"
              :rules="confirmPasswordRules"
              v-model="newPasswordRepeat"
            />
          </v-col>
        </v-row>
      </div>
    </div>
    <v-btn
      block
      class="mb-8"
      color="green"
      size="large"
      variant="elevated"
      :disabled="disabled"
      @click="regis"
    >
      Thay đổi mật khẩu
    </v-btn>
  </div>
</template>

<script lang="ts">
import { getInfos, getUser, updateUser } from "@/firebase";
import _ from "lodash";
export default {
  data() {
    return {
      labelType: [
        { en: "manager", vi: "Ban quản lý" },
        { en: "authority", vi: "Cảng vụ" },
        { en: "border", vi: "Biên phòng" },
        { en: "accountant", vi: "Kế toán" },
        { en: "enterprise", vi: "Doanh nghiệp" },
      ],
      email: "",
      name: "",
      password: "",
      phonenumber: "",
      infos_id: "",
      company: "",
      role: "" as any,
      currentRole: "",
      companies: [] as any,
      user_id: "" as any,
      message: "",
      newPassword: "",
      newPasswordRepeat: "",
      colorAlert: "",
      messageAlert: "",
      alert: false,
      alertColor: "",
      disabled: true,
      passwordRules: [
        (value: any) =>
          (value && value.length >= 6) || "Mật khẩu ít nhất có 6 ký tự",
      ],
      confirmPasswordRules: [
        (value: any) =>
          value === this.newPassword || "Mật khẩu xác nhận không trùng khớp.",
      ],
      rules: {
        required: (value: any) => !!value || "Xin mời nhập trường yêu cầu.",
        counter: (value: any) =>
          value.length > 6 || "Xin mời nhập tối thiểu 6 ký tự",
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
    };
  },
  created() {
    this.currentRole = this.$store.state?.user?.data.role ?? "";
    this.user_id =
      this.$route.params.userID ?? this.$store.state?.user?.data?.id;
    this.getUser();
  },
  watch: {
    $route(to, from) {
      this.currentRole = this.$store.state?.user?.data?.role ?? "";
      this.user_id =
        this.$route.params.userID ?? this.$store.state?.user?.data?.id;
      this.getUser();
    },
    
    newPassword() {
      this.disabled = this.checkValidate();
    },
    newPasswordRepeat() {
      this.disabled = this.checkValidate();
    },
  },
  methods: {
    checkValidate() {
      return (
        this.newPassword !== this.newPasswordRepeat
      );
    },
    validate() {
      if (
        (this.newPassword || this.newPasswordRepeat) &&
        this.newPassword === this.newPasswordRepeat
      ) {
        this.password = this.newPassword;
      }
    },
    async regis() {
      await this.validate();
      const params = {
        email: this.email,
        name: this.name,
        password: this.password,
        phonenumber: this.phonenumber,
        infos_id: this.infos_id ?? "",
        role: this.role,
      };
      const actionUpdateUser = await updateUser(this.user_id, params);
      if (actionUpdateUser) {
        this.alertColor = "green";
        this.alert = true;
        this.messageAlert = "Bạn thay đổi mật khẩu thành công";
        setTimeout(() => {
          this.$router.push("/users");
        }, 2000);
      } else {
        this.alertColor = "red";

        this.alert = true;
        this.messageAlert =
          "Bạn thay đổi mật khẩu không thành công. Xin thử lại";
        setTimeout(() => {
          this.alert = false;
        }, 3000);
      }
    },
    async getUser(): Promise<void> {
      const userDetail = await getUser(this.user_id);
      this.email = userDetail.email;
      this.name = userDetail.name;
      this.password = userDetail.password;
      this.phonenumber = userDetail.phonenumber;
      this.infos_id = userDetail.infos_id;
      this.role = this.labelType.find(
        (label) => label.en === userDetail.role
      )?.en;
      this.getInfo();
    },
    async getInfo(): Promise<void> {
      this.companies = await getInfos();
      this.company = this.infos_id
        ? this.companies.find((company: any) => company.id === this.infos_id)
            .company
        : "";
    },
    closeAlert() {
      this.alert = false;
    },
  },
};
</script>
<style scoped>
.data-container {
  margin: 2rem;
  padding: 0px 10px 16px;
}
@media screen and (max-width: 830px) {
  .data-container {
    padding: 0;
    margin: 2rem;
  }
}
</style>
