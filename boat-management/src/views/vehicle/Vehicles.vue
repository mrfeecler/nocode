<template>
  <div class="data-container">
    <div class="mb-5 d-flex align-center title-area">
      <h2>Danh sách phương tiện</h2>

      <v-btn
        color="green ml-auto"
        size="large"
        variant="tonal"
        @click="createUser"
      >
        <v-icon class="white--text mr-2">mdi-plus</v-icon>
        Thêm Phương tiện giao thông
      </v-btn>
    </div>

    <v-table class="min-width-table increase-width-table">
      <thead>
        <tr>
          <th class="text-left" @click="sortBy('name')" style="cursor: pointer">
            <span style="display: inline-block">Tên phương tiện</span>
            <div v-if="currentSort === 'name'" style="display: inline-block">
              <v-icon icon="mdi-chevron-down" v-if="isSortASC"></v-icon>
              <v-icon icon="mdi-chevron-up" v-else></v-icon>
            </div>
            <span v-else> - </span>
          </th>
          <th class="text-left">Số đăng ký</th>
          <th
            class="text-left"
            @click="sortBy('vehicle-owner')"
            style="cursor: pointer"
          >
            Tên chủ tàu
            <div
              v-if="currentSort === 'vehicle-owner'"
              style="display: inline-block"
            >
              <v-icon icon="mdi-chevron-down" v-if="isSortASC"></v-icon>
              <v-icon icon="mdi-chevron-up" v-else></v-icon>
            </div>
            <span v-else> - </span>
          </th>
          <th
            class="text-left"
            @click="sortBy('tonnage')"
            style="cursor: pointer"
          >
            Trọng tải(tấn)
            <div v-if="currentSort === 'tonnage'" style="display: inline-block">
              <v-icon icon="mdi-chevron-down" v-if="isSortASC"></v-icon>
              <v-icon icon="mdi-chevron-up" v-else></v-icon>
            </div>
            <span v-else> - </span>
          </th>
          <th
            class="text-left"
            @click="sortBy('wattage')"
            style="cursor: pointer"
          >
            Công suất
            <div v-if="currentSort === 'wattage'" style="display: inline-block">
              <v-icon icon="mdi-chevron-down" v-if="isSortASC"></v-icon>
              <v-icon icon="mdi-chevron-up" v-else></v-icon>
            </div>
            <span v-else> - </span>
          </th>
          <th
            class="text-left"
            @click="sortBy('year-manufacture')"
            style="cursor: pointer"
          >
            Năm sản xuất
            <div
              v-if="currentSort === 'year-manufacture'"
              style="display: inline-block"
            >
              <v-icon icon="mdi-chevron-down" v-if="isSortASC"></v-icon>
              <v-icon icon="mdi-chevron-up" v-else></v-icon>
            </div>
            <span v-else> - </span>
          </th>
          <th class="text-left">Loại phương tiện</th>
          <th
            class="text-left"
            @click="sortBy('company')"
            style="cursor: pointer"
          >
            Công ty
            <div v-if="currentSort === 'company'" style="display: inline-block">
              <v-icon icon="mdi-chevron-down" v-if="isSortASC"></v-icon>
              <v-icon icon="mdi-chevron-up" v-else></v-icon>
            </div>
            <span v-else> - </span>
          </th>
          <th
            class="text-left"
            @click="sortBy('insurance-deadline')"
            style="cursor: pointer"
          >
            Hạn đăng kiểm
            <div
              v-if="currentSort === 'insurance-deadline'"
              style="display: inline-block"
            >
              <v-icon icon="mdi-chevron-down" v-if="isSortASC"></v-icon>
              <v-icon icon="mdi-chevron-up" v-else></v-icon>
            </div>
            <span v-else> - </span>
          </th>
          <th>Ảnh bảo hiểm</th>
          <th>Ảnh đăng kiểm</th>
        </tr>
      </thead>
      <tbody v-if="showVehicles.length > 0 && isReload">
        <tr
          v-for="(item, index) in showVehicles"
          :key="item['registration-number'] + index"
          @click="gotoDetail(item.id)"
          style="cursor: pointer"
        >
          <td>{{ item.name }}</td>
          <td>{{ item["registration-number"] }}</td>
          <td>{{ item["vehicle-owner"] }}</td>
          <td>{{ item.tonnage }}</td>
          <td>{{ item.wattage }}</td>
          <td>{{ item["year-manufacture"] }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.company }}</td>
          <td>{{ insurence(item["insurance-deadline"]) }}</td>
          <td>
            <img
              :src="item['image-insurance']"
              alt="image insurance"
              v-if="item['image-insurance']"
              class="img-thumb"
              @click.stop.prevent="openFullSize(item['image-insurance'])"
            />
            <span v-else>-</span>
          </td>
          <td>
            <img
              :src="item['image-registration']"
              alt="image registration"
              v-if="item['image-registration']"
              class="img-thumb"
              @click.stop.prevent="openFullSize(item['image-registration'])"
            />
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </v-table>
    <div class="text-center" v-if="pages > 1">
      <v-pagination v-model="page" :length="pages"></v-pagination>
    </div>
  </div>

  <v-dialog v-model="open" width="auto" persistent>
    <div style="overflow-y: auto; background: white">
      <vehicle-detail @closePopup="closePopup" :currentId="currentId" />
    </div>
  </v-dialog>
  <v-dialog v-model="openImage" width="auto">
    <div style="max-width: 500px; position: relative">
      <v-btn
        color="white"
        variant="elevated"
        @click="closeImagePopup"
        class="close-popup-button"
      >
        <v-icon icon="mdi mdi-close" />
      </v-btn>
      <img
        :src="imagePopup"
        alt="imagePopup"
        v-if="imagePopup"
        style="width: 100%; height: auto"
      />
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { getInfo, getInfos, getListVehicle, getUser } from "@/firebase";
import _ from "lodash";
import Vehicle from "./Vehicle.vue";
import moment from "moment";

export default {
  components: {
    "vehicle-detail": Vehicle,
  },
  data() {
    return {
      vehicles: [] as any,
      showVehicles: [] as any,
      isReload: true,
      isSortASC: true,
      open: false,
      currentId: "",
      currentSort: "",
      openImage: false,
      imagePopup: "",
      companies: [] as any,
      page: 1,
      pages: 1,
    };
  },
  created(): void {
    this.getVehicles();
  },
  watch: {
    page(newVal) {
      if (this.vehicles.length > 0) {
        this.isReload = false;
        this.$emit("handleLoading", true);
        this.showVehicles = [...this.vehicles].slice(
          (newVal - 1) * 15,
          newVal * 15
        );
        setTimeout(() => {
          this.isReload = true;
          this.$emit("handleLoading", false);
        }, 500);
      }
    },
  },

  methods: {
    closeImagePopup() {
      this.openImage = false;
      this.imagePopup = "";
    },
    openFullSize(url) {
      this.openImage = true;
      this.imagePopup = url;
    },
    insurence(date): string {
      return moment(date, "MM/DD/YYYY").format("DD/MM/YYYY");
    },
    sortBy(field: string) {
      this.isReload = false;
      this.$emit("handleLoading", true);
      if (this.currentSort === field) {
        this.isSortASC = !this.isSortASC;
      } else {
        this.currentSort = field;
        this.isSortASC = true;
      }
      this.vehicles = _.orderBy(
        [...this.vehicles],
        [field],
        [this.isSortASC ? "asc" : "desc"]
      );
      if (this.vehicles.length > 0) {
        this.showVehicles = [...this.vehicles].slice(
          (this.page - 1) * 15,
          this.page * 15
        );
      }
      setTimeout(() => {
        this.isReload = true;
        this.$emit("handleLoading", false);
      }, 500);
    },
    async getCompanies() {
      this.companies = await getInfos();
    },
    async getVehicles() {
      this.$emit("handleLoading", true);
      const getDatas: any = await getListVehicle();
      await this.getCompanies();
      for (const vehicle of getDatas) {
        vehicle.company = this.companies.find(
          (company) => company.id === vehicle["infos_id"]
        ).company;
      }
      this.vehicles = [...getDatas];

      this.sortBy("name");
      this.pages = this.vehicles.length / 15;
      if (this.vehicles.length % 15 > 0) {
        this.pages += 1;
      }
      if (this.vehicles.length > 0) {
        this.showVehicles = [...this.vehicles].slice(
          (this.page - 1) * 15,
          this.page * 15
        );
      }

      this.$emit("handleLoading", false);
    },
    async getCompany(userId) {
      const user: any = await getUser(userId);
      if (user) {
        const company = user.infos_id ? await getInfo(user.infos_id) : "";
        return user.infos_id ? company.company : "";
      }
      return "";
    },
    gotoDetail(id) {
      this.open = true;
      this.currentId = id;
      // this.$router.push("/vehicle/" + id);
    },
    createUser() {
      this.$router.push("/vehicle/register");
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
.img-thumb {
  width: auto;
  margin-left: auto;
  max-width: 70px;
  margin-bottom: auto;
  object-fit: unset;
  height: auto;
  max-height: 40px;
  cursor: pointer;
}
.close-popup-button {
  height: 20px !important;
  width: 20px;
  border-radius: 50%;
  padding: 0;
  position: absolute;
  right: 0;
  min-width: unset;
  top: 0;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
}
.increase-width-table table {
  min-width: 1800px;
}
</style>
