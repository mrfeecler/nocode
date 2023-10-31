<template>
  <v-alert
    v-model="alert"
    close-text="Close Alert"
    :color="colorAlert"
    class="alert-forgot"
    dark
    dismissible
  >
    <div class="d-flex align-center">
      <span>
        {{ messageAlert }}
      </span>
    </div>
  </v-alert>
  <div class="data-container">
    <h2 class="mb-5">Thêm Phương tiện giao thông</h2>
    <div class="grey lighten-4 nft-page create-qr-page contentsWrapStyle">
      <v-row>
        <v-col cols="12" md="6" class="pt-0 pb-0">
          <h4>Tên phương tiện <span style="color: red">*</span></h4>
          <v-text-field
            variant="outlined"
            v-model="vehicle.name"
            :rules="[rules.required]"
            required
          />
        </v-col>
        <v-col cols="12" md="6" class="pt-0 pb-0">
          <h4>Số đăng ký <span style="color: red">*</span></h4>
          <v-text-field
            variant="outlined"
            v-model="vehicle.registrationNumber"
            :rules="[rules.required]"
          />
        </v-col>
      </v-row>

      <v-row class="mt-0">
        <v-col cols="12" sm="6" class="pt-0 pb-0">
          <v-row class="mb-0">
            <v-col cols="12" md="4">
              <h4>Trọng tải (tấn) <span style="color: red">*</span></h4>

              <v-text-field
                variant="outlined"
                v-model="vehicle.tonnage"
                :rules="[rules.required, rules.isNumber]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <h4>Công suất <span style="color: red">*</span></h4>

              <v-text-field
                variant="outlined"
                v-model="vehicle.wattage"
                :rules="[rules.required, rules.isNumber]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <h4>
                Năm sản xuất
                <span style="color: red">*</span>
              </h4>
              <vue-date-picker
                v-model="vehicle.yearManufacture"
                locale="vi"
                format="yyyy"
                year-picker
                :max-date="new Date()"
                select-text="Chọn"
                cancel-text="Đóng"
                :year-range="[1900, new Date().getFullYear()]"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="6" class="pb-0">
          <h4>Chọn công ty <span style="color: red">*</span></h4>
          <v-select
            :items="companies"
            item-value="id"
            item-text="company"
            item-title="company"
            v-model="vehicle.infosId"
            variant="solo"
          />
        </v-col>
      </v-row>

      <v-row class="mt-0">
        <v-col cols="12" md="6" class="pt-0 pb-0">
          <v-row class="mt-0">
            <div class="beside-image-upload">
              <h4>Hạn bảo hiểm <span style="color: red">*</span></h4>

              <vue-date-picker
                v-model="vehicle.insuranceDeadline"
                locale="vi"
                format="dd-MM-yyyy"
                select-text="Chọn"
                cancel-text="Đóng"
                date-picker
                :day-names="[
                  'Thứ 2',
                  'Thứ 3',
                  'Thứ 4',
                  'Thứ 5',
                  'Thứ 6',
                  'Thứ 7',
                  'Chủ Nhật',
                ]"
              />
            </div>
            <div class="image-upload-area">
              <h4>Ảnh chụp bảo hiểm <span style="color: red">*</span></h4>
              <div class="image-upload-content">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    background: lightgray;
                    padding: 0 10px !important;
                    border-radius: 4px;
                    position: relative;
                    cursor: pointer;
                  "
                  @click="triggerClick('imageInsurance')"
                >
                  <v-icon style="color: #5f5c5c">mdi-camera</v-icon>
                  <v-file-input
                    @change="
                      previewImage('imageInsurance', 'urlImageInsurance')
                    "
                    v-model="imageInsurance"
                    accept="image/png, image/jpeg"
                    prepend-icon="mdi-camera"
                    style="display: none"
                    ref="imageInsurance"
                  />
                  <span class="ml-2"> Tải ảnh lên </span>
                </div>
                <div style="position: relative" v-if="urlImageInsurance">
                  <v-btn
                    color="white"
                    variant="elevated"
                    @click="clearImage('imageInsurance', 'urlImageInsurance')"
                    class="close-popup-button"
                    style="z-index: 9; right: -10px; top: -10px"
                  >
                    <v-icon icon="mdi mdi-close" />
                  </v-btn>
                  <v-img
                    :src="urlImageInsurance"
                    @click="openFullSize(urlImageInsurance)"
                    class="ml-3"
                  />
                </div>
              </div>
            </div>
          </v-row>
        </v-col>
        <v-col cols="12" md="6" class="pt-0 pb-0">
          <v-row class="mt-0">
            <div class="beside-image-upload">
              <h4>Hạn đăng kiểm <span style="color: red">*</span></h4>
              <date-picker
                v-model="vehicle.registrationDeadline"
                locale="vi"
                format="dd-MM-yyyy"
                select-text="Chọn"
                cancel-text="Đóng"
                :day-names="[
                  'Thứ 2',
                  'Thứ 3',
                  'Thứ 4',
                  'Thứ 5',
                  'Thứ 6',
                  'Thứ 7',
                  'Chủ Nhật',
                ]"
              />
            </div>
            <div class="image-upload-area">
              <h4>Ảnh chụp đăng kiểm <span style="color: red">*</span></h4>
              <div class="image-upload-content">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    background: lightgray;
                    padding: 0 10px !important;
                    border-radius: 4px;
                    position: relative;
                    cursor: pointer;
                  "
                  @click="triggerClick('imageRegistration')"
                >
                  <v-icon style="color: #5f5c5c">mdi-camera</v-icon>
                  <v-file-input
                    @change="
                      previewImage('imageRegistration', 'urlImageRegistration')
                    "
                    v-model="imageRegistration"
                    accept="image/png, image/jpeg"
                    prepend-icon="mdi-camera"
                    ref="imageRegistration"
                    style="display: none"
                  />
                  <span class="ml-2"> Tải ảnh lên </span>
                </div>
                <div style="position: relative" v-if="urlImageRegistration">
                  <v-btn
                    color="white"
                    variant="elevated"
                    @click="
                      clearImage('imageRegistration', 'urlImageRegistration')
                    "
                    class="close-popup-button"
                    style="z-index: 9; right: -10px; top: -10px"
                  >
                    <v-icon icon="mdi mdi-close" />
                  </v-btn>
                  <v-img
                    :src="urlImageRegistration"
                    @click="openFullSize(urlImageRegistration)"
                    class="ml-3"
                  />
                </div>
              </div>
            </div>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <h4>
            Loại phương tiện
            <span style="color: red">*</span>
          </h4>

          <v-text-field
            variant="outlined"
            v-model="vehicle.type"
            :rules="[rules.required]"
          />
        </v-col>
        <v-col cols="12" md="6">
          <h4>
            Tên chủ tàu
            <span style="color: red">*</span>
          </h4>
          <v-text-field
            variant="outlined"
            v-model="vehicle.vehicleOwner"
            :rules="[rules.required]"
          />
        </v-col>
      </v-row>
    </div>
    <div class="d-flex justify-center align-center">
      <v-btn
        class="mb-8 mt-5"
        width="150px"
        color="green"
        variant="elevated"
        :disabled="disabled"
        @click="regis"
      >
        Đăng ký
      </v-btn>
    </div>
    <v-dialog v-model="open" width="auto">
      <div style="max-width: 500px; position: relative">
        <v-btn
          color="white"
          variant="elevated"
          @click="closePopup"
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
  </div>
</template>

<script lang="ts">
import { addVehicle, getInfos } from "@/firebase";
import _ from "lodash";
import Datepicker from "@vuepic/vue-datepicker";
import { convertBlobToBase64 } from "@/CommonFile";
export default {
  components: {
    "date-picker": Datepicker,
  },
  data() {
    return {
      dialog: false,
      colorAlert: "",
      nav: [
        {
          icon: "Regis Form",
          text: "Form",
          title: "Back to Form page",
          active: true,
        },
        {
          icon: "List",
          text: "List",
          title: "List",
          active: false,
        },
      ],
      messageAlert: "",
      alert: false,
      vehicle: {
        registrationNumber: "",
        insuranceDeadline: "",
        name: "",
        registrationDeadline: "",
        tonnage: "",
        type: "",
        vehicleOwner: "",
        wattage: "",
        yearManufacture: "",
        infosId: "",
      },
      companies: [] as any,
      disabled: true,
      urlImageInsurance: "",
      urlImageRegistration: "",
      imageRegistration: "" as any,
      imageInsurance: "" as any,
      open: false,
      imagePopup: "",
      rules: {
        required: (value: any) => !!value || "Xin mời nhập trường yêu cầu.",
        isNumber: (value: any) =>
          /^\d+$/.test(value) || "Xin mời nhập đúng định dạng",
      },
    };
  },
  created() {
    this.getCompanies();
  },
  watch: {
    vehicle: {
      handler(newVal) {
        this.disabled = this.validate();
      },
      deep: true,
    },
    imageInsurance() {
      this.disabled = this.validate();
    },
    imageRegistration() {
      this.disabled = this.validate();
    },
  },
  methods: {
    clearImage(image: string, elemName: string) {
      this[image] = [];
      this[elemName] = "";
    },
    triggerClick(elemName: string) {
      const elem: any = this.$refs[elemName];
      elem.click();
    },
    closePopup() {
      this.open = false;
      this.imagePopup = "";
    },
    openFullSize(url) {
      this.open = true;
      this.imagePopup = url;
    },
    async previewImage(image, url) {
      this[url] = URL.createObjectURL(this[image][0]);
    },
    validate() {
      return (
        _.isEmpty(this.vehicle["registrationNumber"]) ||
        _.isEmpty(this.vehicle["insuranceDeadline"].toString()) ||
        _.isEmpty(this.vehicle["name"]) ||
        _.isEmpty(this.vehicle["registrationDeadline"].toString()) ||
        _.isEmpty(this.vehicle["tonnage"]) ||
        _.isEmpty(this.vehicle["type"]) ||
        _.isEmpty(this.vehicle["vehicleOwner"]) ||
        _.isEmpty(this.vehicle["wattage"]) ||
        this.rules.isNumber(this.vehicle["wattage"]) !== true ||
        this.rules.isNumber(this.vehicle["tonnage"]) !== true ||
        _.isEmpty(this.vehicle["yearManufacture"].toString()) ||
        _.isEmpty(this.imageInsurance[0]?.name) ||
        _.isEmpty(this.imageRegistration[0]?.name) ||
        _.isEmpty(this.vehicle["infosId"])
      );
    },
    async regis() {
      const params = {
        "registration-number": this.vehicle["registrationNumber"],
        name: this.vehicle["name"],
        tonnage: this.vehicle["tonnage"],
        type: this.vehicle["type"],
        "vehicle-owner": this.vehicle["vehicleOwner"],
        wattage: this.vehicle["wattage"],
        "year-manufacture": this.vehicle["yearManufacture"],
        infos_id: this.vehicle["infosId"],
      };
      if (this.imageInsurance[0]) {
        params["image-insurance"] = await convertBlobToBase64(
          this.imageInsurance[0]
        );
      }
      if (this.imageRegistration[0]) {
        params["image-registration"] = await convertBlobToBase64(
          this.imageRegistration[0]
        );
      }
      if (this.vehicle["registrationDeadline"]) {
        const now = new Date(this.vehicle["registrationDeadline"]);
        params["registration-deadline"] = `${("0" + (now.getMonth() + 1)).slice(
          -2
        )}/${("0" + now.getDate()).slice(-2)}/${now.getFullYear()}`;
      }
      if (this.vehicle["insuranceDeadline"]) {
        const now = new Date(this.vehicle["insuranceDeadline"]);
        params["insurance-deadline"] = `${("0" + (now.getMonth() + 1)).slice(
          -2
        )}/${("0" + now.getDate()).slice(-2)}/${now.getFullYear()}`;
      }
      const actionAddVehicle = await addVehicle(params);
      if (actionAddVehicle) {
        this.colorAlert = "green";
        this.alert = true;
        this.messageAlert = "Bạn tạo phương tiện thành công";
        setTimeout(() => {
          this.$router.push("/vehicles");
        }, 2000);
      } else {
        this.colorAlert = "red";

        this.alert = true;
        this.messageAlert = "Bạn tạo phương tiện không thành công. Xin thử lại";
        setTimeout(() => {
          this.alert = false;
        }, 3000);
      }
    },
    async getCompanies() {
      this.companies = await getInfos();
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
<style>
input.dp__pointer {
  height: 60px;
}
button.dp__action_select {
  color: white;
  height: 30px;
}
.dp__action_cancel {
  height: 30px;
}
.dp__calendar_header_item {
  width: auto;
}
</style>
<style>
.image-upload-area img {
  width: auto;
  margin-left: auto;
  max-width: 70px;
  object-fit: unset;
  height: auto;
  max-height: 40px;
  cursor: pointer;
}
.image-upload-area {
  display: flex;
  flex-direction: column;
  width: 50%;
  padding: 0 12px;
}
.image-upload-content {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.image-upload-content > div {
  padding-top: 6px;
  display: flex;
  width: auto;
  flex: unset;
  height: 40px;
  align-items: center;
  padding: 0 !important;
}
.image-upload-area .v-input__control {
  display: none;
}
.beside-image-upload {
  width: 50%;
  padding: 0 12px;
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
