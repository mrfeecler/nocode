<template>
  <div class="data-container" v-if="isLoadedData" style="position: relative">
    <p
      @click="closePopup"
      style="
        position: absolute;
        right: 0;
        min-width: unset;
        top: 0;
        width: 30px;
        height: 30px;
        font-size: 20px;
        cursor: pointer;
      "
    >
      <v-icon icon="mdi mdi-close" />
    </p>
    <div class="grey user-info">
      <h2>Thông tin người dùng</h2>
      <p class="mt-3">
        <span> Email: </span>
        <span>
          {{ email }}
        </span>
      </p>
      <p class="mt-3">
        <span> Tên: </span>
        <span>
          {{ name }}
        </span>
      </p>
      <p class="mt-3">
        <span> Số điện thoại: </span>
        <span>
          {{ phonenumber }}
        </span>
      </p>
      <p class="mt-3">
        <span> Vai trò người dùng: </span>
        <span>
          {{ labelType.find((label) => label.en === role)?.vi }}
        </span>
      </p>
      <p v-if="company && company != ''" class="mt-3">
        <span> Công ty: </span>
        <span>
          {{ company }}
        </span>
      </p>
    </div>
    <div>
      <v-btn
        class="mt-8 button-action"
        color="green"
        variant="elevated"
        @click="regis"
      >
        Cập nhật Người dùng
      </v-btn>
    </div>
  </div>
  <v-overlay
    v-model="isLoading"
    contained
    class="align-center justify-center"
    v-else
  >
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts">
import { getInfos, getUser } from "@/firebase";
import _ from "lodash";
export default {
  props: {
    currentId: {
      type: String,
      default: "",
    },
  },
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
      role: "",
      user_id: "" as any,
      isLoadedData: false,
      isLoading: true,
    };
  },
  created() {
    // this.user_id =
    // this.$route.params.userID ?? this.$store.state?.user?.data.id;
    this.user_id = this.currentId;
    this.getUser();
    this.getInfo();
  },
  methods: {
    async regis() {
      this.$router.push("/user/update/" + this.user_id);
    },
    async getUser(): Promise<void> {
      const userDetail = await getUser(this.user_id);
      this.email = userDetail.email;
      this.name = userDetail.name;
      this.password = userDetail.password;
      this.phonenumber = userDetail.phonenumber;
      this.infos_id = userDetail.infos_id;
      this.role = userDetail.role;
      setTimeout(() => {
        this.isLoadedData = true;
        this.isLoading = false;
      }, 500);
    },
    async getInfo(): Promise<void> {
      const companies = await getInfos();
      const company = companies.find(
        (company: any) => company.id === this.infos_id
      );
      this.company = company ? company.company : "";
    },

    closePopup() {
      this.$emit("closePopup", this.currentId);
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

p span:first-child {
  width: 140px;
}
p {
  display: flex;
}
.data-container {
  display: flex;
  flex-direction: column;
}
.button-action {
}
</style>
