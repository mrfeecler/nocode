<template>
  <div class="data-container form-detail" v-if="isLoadedData">
    <div
      class="grey lighten-4 nft-page create-form-page contentsWrapStyle"
      style="position: relative"
    >
      <v-btn
        color="black"
        variant="elevated"
        @click="closePopup"
        style="
          height: 40px;
          width: 38px;
          position: absolute;
          right: 0;
          min-width: unset;
          top: 0;
        "
      >
        <v-icon icon="mdi mdi-close" />
      </v-btn>
      <div class="d-flex header-detail">
        <h2>Danh sách hành khách vận tải đường thủy nội địa</h2>
        <v-btn
          :color="businessData.backgroundColor"
          class="text-none text-subtitle-1 color-black ml-4"
          variant="tonal"
          width="130px"
          style="cursor: auto"
        >
          {{ businessData.typeConvert ?? "" }}
        </v-btn>
      </div>
      <div>
        <v-row class="mt-5">
          <v-col cols="12" md="3" class="pt-3">
            <v-row class="mt-0 name-area">
              <v-col cols="12" class="pt-0 pb-1 d-flex align-center">
                <h3>Tên phương tiện:</h3>
                <p class="ml-3">{{ businessData["meanName"] }}</p>
              </v-col>
              <v-col cols="12" class="pt-0 pb-1 d-flex align-center">
                <h3>Số đăng kí:</h3>
                <p class="ml-3">{{ businessData["meanNumber"] }}</p>
              </v-col>
              <v-col cols="12" class="pt-0 pb-1 d-flex align-center">
                <h3>Tên thuyền trưởng:</h3>
                <p class="ml-3">{{ businessData["captain"] }}</p>
              </v-col>
              <v-col cols="12" class="pt-0 pb-1 d-flex align-center">
                <h3>Tên chủ phương tiện:</h3>
                <p class="ml-3">{{ businessData["ownerName"] }}</p>
              </v-col>
            </v-row>
            <hr class="mt-5 mb-3" />
            <v-row>
              <v-col cols="12" class="mt-1"> <h3>Trọng tải đăng ký</h3></v-col>
              <v-col cols="12" class="mt-2 d-flex align-center pt-0 pb-1">
                <h4>Đơn vị (tấn):</h4>
                <p class="ml-3">{{ businessData["tonnage"] }}</p>
              </v-col>
              <v-col cols="12" class="mt-2 d-flex align-center pt-0 pb-1">
                <h4>Công suất (ghế):</h4>
                <p class="ml-3">{{ businessData["seats"] }}</p>
              </v-col>
            </v-row>
            <hr class="mt-5 mb-3" />
            <v-row>
              <v-col cols="12">
                <h4>Hướng dẫn viên</h4>
                <v-table class="table-customer mt-2">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên hướng dẫn viên</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template
                      v-for="(item, index) in businessData['guides']"
                      :key="item.name + index"
                    >
                      <tr v-if="item.name && item.name != ''">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                      </tr>
                    </template>
                  </tbody>
                </v-table>
              </v-col>
              <v-col cols="12">
                <h4>Nhân viên</h4>
                <v-table class="table-customer mt-2">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên nhân viên phục vụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template
                      v-for="(item, index) in businessData['shipEmployees']"
                      :key="item.name + index"
                    >
                      <tr v-if="item.name && item.name != ''">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                      </tr>
                    </template>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
            <hr class="mt-5" />
            <v-row class="mt-3">
              <v-col cols="12" class="pt-0">
                <h3 class="mb-5">Bến tàu</h3>
                <v-row mt="2">
                  <v-col cols="12" class="pt-0 pb-1 d-flex align-center">
                    <h4>Bến rời:</h4>
                    <span class="ml-3">{{ businessData["fromStation"] }}</span>
                  </v-col>
                  <v-col cols="12" class="pt-0 pb-1 d-flex align-center">
                    <h4>Bến đến:</h4>
                    <span class="ml-3">{{ businessData["toStation"] }}</span>
                  </v-col>
                  <v-col cols="12" class="pt-0 pb-1 d-flex align-center">
                    <h4>Thời gian rời bến:</h4>
                    <span class="ml-3">{{ businessData["time"] }}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="9" class="pt-3">
            <v-table class="min-width-table">
              <thead>
                <tr>
                  <th class="text-left">STT</th>
                  <th class="text-left">Họ và tên khách</th>
                  <th class="text-left">Năm sinh</th>
                  <th class="text-left">Giới tính</th>
                  <th class="text-left">Số CMND(hộ chiếu)</th>
                  <th class="text-left">Quốc tịch</th>
                  <th class="text-left">Nơi tạm trú</th>
                  <th class="text-left">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in businessData['customers']"
                  :key="index"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.birthYear }}</td>
                  <td>{{ item.gender }}</td>
                  <td>{{ item.cardId }}</td>
                  <td>{{ item.nation }}</td>
                  <td>{{ item.place }}</td>
                  <td>{{ item.note }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="pt-0"> </v-col>
        </v-row>
        <div class="d-flex flex-row mt-15 button-regis">
          <div>
            <v-btn
              class="mb-8 mt-5 close-button-bottom"
              color="black"
              variant="elevated"
              @click="closePopup"
              style="height: 40px; width: 60px"
            >
              Đóng
            </v-btn>
          </div>
          <div v-if="disabledAction && !isEnterprise" class="buttons-cta">
            <v-btn
              class="mb-8 mt-5 ml-5 button-cta"
              color="error"
              variant="elevated"
              @click="denie"
            >
              Từ chối
            </v-btn>
            <v-btn
              class="mb-8 mt-5 ml-5 button-cta"
              color="green"
              variant="elevated"
              :disabled="isDisableProcess"
              @click="accepted"
            >
              <span v-if="!isDisableProcess">
                {{ process }}
              </span>
              <span v-else>
                {{ labelType.find((e) => e.en === businessData["type"])?.vi }}
              </span>
            </v-btn>
          </div>
        </div>
      </div>
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
import { CustomerData, LABELTYPE } from "../../CommonFile";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import {
  getListVehicle,
  addBussinessData,
  getFormData,
  updateFormData,
} from "@/firebase";

export default {
  props: {
    currentId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      businessData: {} as any,
      vehicle: [] as any,
      typeofVehicle: { name: "" },
      idVehicle: "",
      formID: "" as any,
      isDisable: false,
      deniedFlag: false,
      isDisableProcess: true,
      disabledAction: false,
      isEnterprise: false,
      isLoadedData: false,
      isLoading: true,
      process: "Chấp nhận",
      created_at: "",
      userRole: this.$store.state?.user?.data?.role,
      roleSameChange: [
        { role: "manager", permission: "requesting" },
        { role: "authority", permission: "purchased" },
        { role: "accountant", permission: "processing" },
      ],
      labelType: LABELTYPE,
    };
  },
  created(): void {
    this.init();
  },
  methods: {
    init() {
      this.getVehicle();
      // this.formID = this.$route.params.formID;
      this.formID = this.currentId;
      this.getformDetail();
      this.isDisable = !_.isEmpty(this.formID);
      this.userRole = this.$store.state?.user?.data?.role;
      this.isEnterprise = this.userRole === "enterprise";
      switch (this.userRole) {
        case "manager":
          this.process = "Đang xử lý";
          break;
        case "accountant":
          this.process = "Đã thu tiền";
          break;
        default:
          this.process = "Chấp nhận";
          break;
      }
      process;
    },
    async getVehicle() {
      const list = await getListVehicle();
      this.vehicle = list.filter(
        (detailVehicle) =>
          detailVehicle.infos_id === this.$store.state.user?.data?.infos_id
      );
    },
    handleData() {
      const clientData = [
        ...(this.businessData["customers"] ?? []),
        ...(this.businessData["shipEmployees"] ?? []),
        ...(this.businessData["guides"] ?? []),
      ];
      const localCustomers = this.businessData["customers"]?.filter(
        (item) => item.nation === "Việt Nam"
      );
      const internationalCustomers = this.businessData["customers"]?.filter(
        (item) => item.nation === "Nước ngoài"
      );
      const now = new Date();
      const created_at = this.created_at
        ? this.created_at
        : `${("0" + now.getDate()).slice(-2)}/${(
            "0" +
            (now.getMonth() + 1)
          ).slice(
            -2
          )}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      const setAPIData = {
        ...this.businessData,
        clients: clientData.flat(1),
        totalShipMember: !isNaN(
          this.businessData["guides"]?.length +
            this.businessData["shipEmployees"]?.length +
            1
        )
          ? this.businessData["guides"]?.length +
            this.businessData["shipEmployees"]?.length +
            1
          : 0,
        localCustomerNumber: localCustomers?.length ?? 0,
        internationalCustomerNumber: internationalCustomers?.length ?? 0,
        created_at,
        idVehicle: this.idVehicle,
      };

      delete setAPIData["shipEmployees"];
      delete setAPIData["guides"];
      delete setAPIData["customers"];
      return setAPIData;
    },
    regisNewBusinessForm(): void {
      const setAPIData = this.handleData();
      const data = { ...setAPIData, type: "requesting" };
      try {
        addBussinessData(data);
        this.resetPopup();
      } catch (err) {
        console.log(err);
      }
    },
    onChangeCustomerData(value: CustomerData): void {
      if (!this.isDisable) {
        this.businessData["customers"] = value;
      }
    },
    onAddNewEmployee(): void {
      const newEmployee = {
        id: uuidv4(),
        name: "",
        type: "employee",
      };
      if (!Array.isArray(this.businessData["shipEmployees"])) {
        this.businessData["shipEmployees"] = [];
      }
      this.businessData["shipEmployees"].push(newEmployee);
    },
    onDeleteEmployee(id: string): void {
      this.businessData["shipEmployees"] = this.businessData[
        "shipEmployees"
      ].filter((item) => item.id !== id);
    },
    onAddNewGuide(): void {
      const newGuide = {
        id: uuidv4(),
        name: "",
        type: "guide",
      };
      if (!Array.isArray(this.businessData["guides"])) {
        this.businessData["guides"] = [];
      }
      this.businessData["guides"].push(newGuide);
    },
    onDeleteGuide(id: string): void {
      this.businessData["guides"] = this.businessData["guides"].filter(
        (item) => item.id !== id
      );
    },
    async getformDetail(): Promise<void> {
      if (this.formID && this.formID !== "") {
        this.businessData = await getFormData(this.formID);
        this.created_at = this.businessData["created_at"];
        this.businessData["customers"] = this.businessData["clients"].filter(
          (e) => e.type === "Customer"
        );
        this.businessData["shipEmployees"] = this.businessData[
          "clients"
        ].filter((e) => e.type === "employee");
        this.businessData["guides"] = this.businessData["clients"].filter(
          (e) => e.type === "guide"
        );
        this.idVehicle = this.businessData["idVehicle"];

        const theRole = this.roleSameChange.find(
          (e) => e.role === this.userRole
        );
        this.isDisableProcess =
          theRole?.permission !== this.businessData["type"];

        this.deniedFlag = this.businessData["type"] === "accept";
        this.disabledAction =
          this.businessData.type !== "reject" &&
          this.businessData.type !== "accept";
        this.businessData["typeConvert"] = this.labelType.find(
          (label) => label.en === this.businessData.type
        )?.vi;
        this.businessData["backgroundColor"] = this.labelType.find(
          (label) => label.en === this.businessData.type
        )?.backgroundColor;
        setTimeout(() => {
          this.isLoadedData = true;
          this.isLoading = false;
        }, 500);
      } else {
        this.closePopup();
      }
    },
    async accepted(): Promise<void> {
      let type = "requesting";
      switch (this.$store.state?.user?.data?.role) {
        case "manager":
          type = "processing";
          break;

        case "accountant":
          type = "purchased";
          break;

        case "authority":
          type = "accept";
          break;

        default:
          type = "requesting";
          break;
      }
      const setAPIData = this.handleData();
      const data = { ...setAPIData, type: type };
      await updateFormData(this.formID, data);
      this.resetPopup();
    },
    async denie(): Promise<void> {
      const type = "reject";
      const setAPIData = this.handleData();
      const data = { ...setAPIData, type: type };
      await updateFormData(this.formID, data);
      this.resetPopup();
    },
    checkDisabled(): boolean {
      return (
        this.businessData["customers"]?.length > 0 &&
        this.businessData["meanName"]
      );
    },
    closePopup() {
      this.$emit("closePopup", this.currentId);
    },
    resetPopup() {
      this.$emit("resetPopup", this.currentId);
    },
  },
  watch: {
    typeofVehicle(newVal): void {
      this.idVehicle = newVal.id;
      this.businessData["meanName"] = newVal.name;
      this.businessData["meanNumber"] = newVal["registration-number"];
      this.businessData["ownerName"] = newVal["vehicle-owner"];
      this.businessData["tonnage"] = newVal["tonnage"];
      this.businessData["seats"] = newVal["wattage"];
    },
    $route(to, from) {
      if (to.path === "/form") {
        this.businessData = {};
        this.vehicle = [];
        this.typeofVehicle = { name: "" };
        this.idVehicle = "";
        this.formID = "";
        this.isDisable = false;
        this.isLoadedData = false;
        this.isLoading = true;
      }
      this.init();
    },
  },
};
</script>

<style scoped>
.contentsWrapStyle {
  margin: "2rem";
  padding: "40px 56px";
}
.data-container.form-detail {
  padding-top: 20px;
}
h4,
h3 {
  min-width: 160px;
}
</style>

<style>
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

.create-form-page .v-input__slot {
  min-height: 45px !important;
}
.create-form-page .v-input__slot fieldset {
  background-color: white;
}
.create-form-page .aboutdate .ma-0 {
  margin-top: 4px !important;
}
.number-input {
  margin-top: 20px;
}
.button-regis {
  justify-content: space-between;
}
.table-customer {
  border: 1px solid #e3e1e1;
}
.button-cta {
  width: 180px;
  height: 60px !important;
}
.header-detail {
  min-width: 768px;
}
@media screen and (max-width: 830px) {
  .header-detail {
    min-width: unset;
    flex-direction: column;
    padding-right: 40px;
  }
  .header-detail .v-btn {
    margin-left: 0 !important;
  }
}
@media screen and (max-width: 768px) {
  .close-button-bottom {
    display: none;
  }
  .buttons-cta {
    width: 100%;
  }
  .buttons-cta .button-cta {
    width: 100%;
    margin: 0 0 10px 0 !important;
  }
  .name-area .v-col {
    flex-direction: column;
    align-items: flex-start !important;
    justify-content: flex-start;
  }
  .name-area .v-col p {
    margin-left: 0 !important;
  }
}
</style>
