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
      <h2>Thông tin phương tiện</h2>
      <p class="mt-3">
        <span> Tên: </span>
        <span>
          {{ name }}
        </span>
      </p>
      <p class="mt-3">
        <span> Số đăng ký: </span>
        <span>
          {{ registrationNumber }}
        </span>
      </p>
      <p class="mt-3">
        <span> Tên chủ tàu: </span>
        <span>
          {{ vehicleOwner }}
        </span>
      </p>
      <p class="mt-3">
        <span> Trọng tải: </span>
        <span> {{ tonnage }} tấn </span>
      </p>
      <p class="mt-3">
        <span> Công suất: </span>
        <span>
          {{ wattage }}
        </span>
      </p>
      <p class="mt-3">
        <span> Năm sản xuất: </span>
        <span>
          {{ yearManufacture }}
        </span>
      </p>
      <p class="mt-3">
        <span> Loại phương tiện: </span>
        <span>
          {{ type }}
        </span>
      </p>
      <p class="mt-3">
        <span> Công ty: </span>
        <span>
          {{ company }}
        </span>
      </p>
      <p class="mt-3" style="align-items: center">
        <span> Hạn bảo hiểm: </span>
        <span>
          {{ insuranceDeadline }}
        </span>
        <img
          :src="imageInsurance"
          alt="imageInsurance"
          v-if="imageInsurance"
          class="img-thumb"
          @click="openFullSize(imageInsurance)"
        />
      </p>
      <p class="mt-3" style="align-items: center">
        <span> Hạn đăng kiểm: </span>
        <span>
          {{ registrationDeadline }}
        </span>
        <img
          :src="imageRegistration"
          alt="imageRegistration"
          v-if="imageRegistration"
          @click="openFullSize(imageRegistration)"
          class="img-thumb"
        />
      </p>
    </div>
    <div>
      <v-btn
        class="mt-8 button-action"
        color="green"
        variant="elevated"
        @click="regis"
      >
        Cập nhật phương tiện
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
import { getInfo, getUser, getVehicle } from "@/firebase";
import _ from "lodash";
import moment from "moment";
export default {
  props: {
    currentId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      registrationNumber: "",
      name: "",
      vehicleOwner: "",
      tonnage: "",
      wattage: "",
      yearManufacture: "",
      type: "",
      insuranceDeadline: "",
      imageRegistration: "",
      imageInsurance: "",
      registrationDeadline: "",
      company: "" as any,
      vehicle_id: "" as any,
      isLoadedData: false,
      isLoading: true,
      openImage: false,
      imagePopup: "",
    };
  },
  created() {
    // this.vehicle_id = this.$route.params.vehicleID;
    this.vehicle_id = this.currentId;
    this.getVehicle();
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
    async regis() {
      this.$router.push("/vehicle/update/" + this.vehicle_id);
    },
    async getVehicle(): Promise<void> {
      if (_.isEmpty(this.vehicle_id)) {
        this.$router.push("/vehicles");
      } else {
        const vehicleDetail = await getVehicle(this.vehicle_id);
        this.registrationNumber = vehicleDetail["registration-number"];
        this.name = vehicleDetail["name"];
        this.vehicleOwner = vehicleDetail["vehicle-owner"];
        this.tonnage = vehicleDetail["tonnage"];
        this.wattage = vehicleDetail["wattage"];
        this.yearManufacture = vehicleDetail["year-manufacture"];
        this.type = vehicleDetail["type"];
        this.imageInsurance = vehicleDetail["image-insurance"] ?? "";
        this.imageRegistration = vehicleDetail["image-registration"] ?? "";
        this.insuranceDeadline = moment(
          vehicleDetail["insurance-deadline"],
          "MM/DD/YYYY"
        ).format("DD/MM/YYYY");
        this.registrationDeadline = moment(
          vehicleDetail["registration-deadline"],
          "MM/DD/YYYY"
        ).format("DD/MM/YYYY");
        this.company = await this.getCompany(vehicleDetail["infos_id"]);
        setTimeout(() => {
          this.isLoadedData = true;
          this.isLoading = false;
        }, 500);
      }
    },
    async getCompany(infos_id) {
      const company = await getInfo(infos_id);
      return company ? company.company : "";
    },
    closePopup() {
      this.$emit("closePopup", this.currentId);
    },
  },
};
</script>
<style scoped>
.data-container {
  padding: 30px 50px;
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
@media screen and (max-width: 830px) {
  .data-container {
    padding: 0;
    margin: 2rem;
  }
}

.button-action {
}
.img-thumb {
  width: auto;
  margin-left: 10px;
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
</style>
