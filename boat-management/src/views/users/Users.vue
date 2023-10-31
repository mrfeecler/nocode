<template>
  <div class="data-container">
    <div class="mb-5 d-flex align-center title-area">
      <h2>Danh sách người dùng</h2>
      <v-btn
        class="ml-auto"
        color="green"
        size="large"
        variant="tonal"
        @click="createUser"
      >
        <v-icon class="white--text mr-2">mdi-plus</v-icon>
        Thêm mới người dùng
      </v-btn>
    </div>

    <v-table>
      <thead>
        <tr>
          <th
            class="text-left"
            @click="sortBy('email')"
            style="cursor: pointer"
          >
            <span style="display: inline-block">Email</span>
            <div v-if="currentSort === 'email'" style="display: inline-block">
              <v-icon icon="mdi-chevron-down" v-if="isSortASC"></v-icon>
              <v-icon icon="mdi-chevron-up" v-else></v-icon>
            </div>
            <span v-else> - </span>
          </th>
          <th class="text-left">Tên</th>
          <th class="text-left">Số điện thoại</th>
          <th class="text-left">Công ty</th>
          <th class="text-left" @click="sortBy('role')" style="cursor: pointer">
            <span style="display: inline-block">Vai trò</span>
            <div v-if="currentSort === 'role'" style="display: inline-block">
              <v-icon icon="mdi-chevron-down" v-if="isSortASC"></v-icon>
              <v-icon icon="mdi-chevron-up" v-else></v-icon>
            </div>
            <span v-else> - </span>
          </th>
          <th class="text-left"></th>
        </tr>
      </thead>
      <tbody v-if="showUsers.length > 0 && isReload">
        <tr
          v-for="(item, index) in showUsers"
          :key="item.email + index"
          @click="gotoDetail(item.id)"
          style="cursor: pointer"
        >
          <td>
            <a
              :href="`mailto:${item.email}`"
              rel="noopener noreferrer"
              @click="(e) => e.stopPropagation()"
              >{{ item.email }}</a
            >
          </td>
          <td>{{ item.name }}</td>
          <td>
            <a
              :href="`tel:${item.phonenumber}`"
              rel="noopener noreferrer"
              @click="(e) => e.stopPropagation()"
              >{{ item.phonenumber }}</a
            >
          </td>
          <td>{{ item.company ? item.company : "" }}</td>
          <td>{{ labelType.find((label) => label.en === item.role)?.vi }}</td>
        </tr>
      </tbody>
    </v-table>
    <div class="text-center" v-if="pages > 1">
      <v-pagination v-model="page" :length="pages"></v-pagination>
    </div>
  </div>
  <v-dialog v-model="open" width="auto" persistent>
    <div style="overflow-y: scroll; background: white">
      <user-detail @closePopup="closePopup" :currentId="currentId" />
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { getInfo, getUsers } from "@/firebase";
import _ from "lodash";
import User from "./User.vue";

export default {
  components: {
    "user-detail": User,
  },
  data() {
    return {
      users: [] as any,
      showUsers: [] as any,
      isReload: true,
      isSortASC: true,
      currentSort: "",
      open: false,
      currentId: "",
      page: 1,
      pages: 1,
      labelType: [
        { en: "manager", vi: "Ban quản lý" },
        { en: "authority", vi: "Cảng vụ" },
        { en: "border", vi: "Biên phòng" },
        { en: "accountant", vi: "Kế toán" },
        { en: "enterprise", vi: "Doanh nghiệp" },
      ],
    };
  },
  created(): void {
    this.getUsers();
  },
  watch: {
    page(newVal) {
      if (this.users.length > 0) {
        this.isReload = false;
        this.$emit("handleLoading", true);

        this.showUsers = [...this.users].slice((newVal - 1) * 15, newVal * 15);
        setTimeout(() => {
          this.isReload = true;
          this.$emit("handleLoading", false);
        }, 500);
      }
    },
  },

  methods: {
    sortBy(field: string) {
      if (this.currentSort === field) {
        this.isSortASC = !this.isSortASC;
      } else {
        this.currentSort = field;
        this.isSortASC = true;
      }
      this.users = _.orderBy(
        [...this.users],
        [field],
        [this.isSortASC ? "asc" : "desc"]
      );
      if (this.users.length > 0) {
        this.showUsers = [...this.users].slice(
          (this.page - 1) * 15,
          this.page * 15
        );
      }
    },
    async getUsers() {
      this.$emit("handleLoading", true);
      const getDatas: any = await getUsers();
      this.users = [...getDatas];
      for (const user of getDatas) {
        if (user.infos_id) {
          const fetInfo = await getInfo(user.infos_id);
          user.company = fetInfo ? fetInfo.company : "";
        } else {
          user.company = "";
        }
      }
      this.sortBy("role");
      this.pages = this.users.length / 15;
      if (this.users.length % 15 > 0) {
        this.pages += 1;
      }
      if (this.users.length > 0) {
        this.showUsers = [...this.users].slice(
          (this.page - 1) * 15,
          this.page * 15
        );
      }
      this.$emit("handleLoading", false);
    },
    gotoDetail(id) {
      this.open = true;
      this.currentId = id;
      // this.$router.push("/user/" + id);
    },
    createUser() {
      this.$router.push("/user/register");
    },

    closePopup(currentId = "") {
      this.open = false;
      this.currentId = currentId;
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
@media screen and (max-width: 768px) {
  .title-area {
    flex-direction: column;
    align-items: flex-start !important;
  }
  .title-area button {
    margin-left: 0 !important;
    margin-top: 5px;
  }
}
</style>
