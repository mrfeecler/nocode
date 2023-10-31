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
  <div class="data-container">
    <div class="mb-5 d-flex align-center title-area">
      <h2>Danh sách đã đăng ký hành khách vận tải đường thuỷ nội địa</h2>

      <v-btn
        class="ml-auto"
        color="green"
        size="large"
        variant="tonal"
        @click="createForm"
        v-if="isShowAddForm"
      >
        <v-icon class="white--text mr-2">mdi-plus</v-icon>
        Tạo mới danh sách
      </v-btn>
    </div>

    <div class="d-flex action-form" style="justify-content: space-between">
      <v-combobox
        v-model="filterType"
        :items="labelType"
        item-value="en"
        item-title="vi"
        label="Lọc trạng thái"
        multiple
        chips
        variant="outlined"
        class="filter-box"
      />
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm kiếm thuyền trưởng, số đăng ký, phương tiện,…"
        variant="outlined"
        hide-details
        class="search-box"
      />
    </div>

    <v-table class="min-width-table mt-3">
      <thead>
        <tr>
          <th class="text-left" style="cursor: pointer">
            <span style="display: inline-block"> Trạng thái </span>
          </th>
          <th class="text-left" style="cursor: pointer">
            <span style="display: inline-block"> Thời gian tạo </span>
          </th>
          <th class="text-left">Thuyền trưởng</th>
          <th class="text-left">Số đăng ký</th>
          <th class="text-left">Phương tiện</th>
          <th class="text-left">Bến rời</th>
          <th class="text-left">Bến đến</th>
          <th class="text-left">Thời gian rời bến</th>
          <th class="text-left" colspan="2">Công ty</th>
        </tr>
      </thead>
      <tbody v-if="showListBussinessData.length > 0 && isReload">
        <tr
          v-for="(item, index) in showListBussinessData"
          :key="item.created_at + index"
          @click="gotoDetail(item.id)"
          style="cursor: pointer"
        >
          <td>
            <v-btn
              :color="item.backgroundColor"
              class="text-none text-subtitle-1 color-black"
              variant="tonal"
              width="130px"
            >
              {{ item.typeConvert ?? "" }}
            </v-btn>
          </td>
          <td>{{ item.time_created }}</td>
          <td>{{ item.captain }}</td>
          <td><div v-html="item.vehicle['registration-number'] ?? ''" /></td>
          <td><div v-html="item.vehicle['type'] ?? ''" /></td>
          <td>{{ item.toStation }}</td>
          <td>{{ item.fromStation }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.company ?? "" }}</td>
          <td>
            <div class="d-flex">
              <v-btn
                @click.stop="onGenPDF(item.id)"
                class="pa-0"
                style="min-width: 36px; background-color: #11ba06; color: white"
              >
                <v-icon icon="mdi-eye-outline" /><v-tooltip
                  activator="parent"
                  location="end"
                  >Xem trước</v-tooltip
                ></v-btn
              >
              <v-btn
                v-if="
                  item.type !== 'accept' &&
                  item.type !== 'reject' &&
                  !isShowAddForm
                "
                @click.stop="gotoDetail(item.id)"
                class="ml-3"
                style="min-width: 36px; background-color: #11ba06; color: white"
              >
                Xử lý
              </v-btn>
              <v-btn
                v-if="
                  item.type !== 'accept' &&
                  item.type !== 'reject' &&
                  !isShowAddForm
                "
                @click.stop="rejectForm(item.id)"
                class="ml-3"
                color="error"
                variant="elevated"
                style="min-width: 36px"
              >
                Từ chối
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <div class="text-center" v-if="pages > 1">
      <v-pagination v-model="page" :length="pages"></v-pagination>
    </div>
  </div>
  <v-dialog v-model="open" width="auto" persistent>
    <div v-if="isShowAddForm" style="overflow-y: scroll; background: white">
      <form-add
        @closePopup="closePopup"
        @resetPopup="resetPopup"
        v-if="currentId === ''"
      />
      <form-detail @closePopup="closePopup" :currentId="currentId" v-else />
    </div>
    <div v-else style="overflow-y: scroll; background: white">
      <form-detail
        @closePopup="closePopup"
        :currentId="currentId"
        @resetPopup="resetPopup"
      />
    </div>
  </v-dialog>
</template>

<script lang="ts">
import {
  getBussinessData,
  getFormData,
  getVehicle,
  updateFormData,
} from "@/firebase";
import BusinessForm from "@/views/form/BusinessForm.vue";
import BusinessFormDetail from "@/views/form/BusinessFormDetail.vue";
import * as pdfMake from "pdfmake/build/pdfmake";
import _ from "lodash";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";
import {
  FONT_ITALIC,
  FONT_MEDIUM,
  FONT_MEDIUM_ITALIC,
  FONT_REGULAR,
  LABELTYPE,
} from "@/CommonFile";

export default {
  components: {
    "form-add": BusinessForm,
    "form-detail": BusinessFormDetail,
  },
  data() {
    return {
      listBussinessData: [] as any,
      listBussinessDataClone: [] as any,
      showListBussinessData: [] as any,
      vehicles: [] as any,
      contentPDF: {} as any,
      isReload: true,
      isSortASC: true,
      isShowAddForm: false,
      open: false,
      currentSort: "",
      currentId: "",
      search: "",
      messageAlert: "",
      alert: false,
      alertColor: "",
      filterType: [],
      fieldsSort: ["typeConvert", "sortTime"],
      page: 1,
      pages: 1,
      labelType: LABELTYPE,
    };
  },
  created(): void {
    this.getBussinessData();
    this.isShowAddForm = this.$store.state.user.data?.role === "enterprise";
    if (!this.$store.state.user.loggedIn) {
      this.$router.push("/");
    }
  },
  watch: {
    page(newVal) {
      if (this.listBussinessData.length > 0) {
        this.isReload = false;
        this.$emit("handleLoading", true);
        this.showListBussinessData = [...this.listBussinessData].slice(
          (newVal - 1) * 15,
          newVal * 15
        );
        setTimeout(() => {
          this.isReload = true;
          this.$emit("handleLoading", false);
        }, 500);
      }
    },
    filterType(newVal) {
      this.page = 1;
      if (!_.isEmpty(newVal)) {
        this.search = "";
      }
      const filterArray = JSON.parse(JSON.stringify(newVal));
      if (filterArray.length > 0) {
        const accecptType = filterArray.map((arr) => arr.en);
        this.listBussinessData = [...this.listBussinessDataClone].filter(
          (data) => accecptType.includes(data.type)
        );
      } else {
        this.listBussinessData = [...this.listBussinessDataClone];
      }

      this.paginationHandle();
      this.sortBy("sorting", ["asc", "asc"]);
    },
    search(newVal) {
      this.page = 1;
      this.searchBy(newVal);
    },
  },

  methods: {
    paginationHandle() {
      this.pages = this.listBussinessData.length / 15;
      if (this.listBussinessData.length % 15 > 0) {
        this.pages += 1;
      }
      if (this.listBussinessData.length > 0) {
        this.showListBussinessData = [...this.listBussinessData].slice(
          (this.page - 1) * 15,
          this.page * 15
        );
      }
    },
    sortBy(field: string, sorted: string[]) {
      this.fieldsSort = this.fieldsSort.filter((item) => item !== field);
      this.fieldsSort.unshift(field);
      this.listBussinessData = _.orderBy(
        [...this.listBussinessData],
        this.fieldsSort,
        sorted
      );
      this.paginationHandle();
    },
    searchBy(value: string) {
      const returnSearched = [...this.listBussinessDataClone].filter((obj) =>
        Object.values(obj).some((val) => {
          return JSON.stringify(val)
            .toLowerCase()
            .includes(value.toString().toLowerCase());
        })
      );
      this.listBussinessData = returnSearched;
      this.paginationHandle();
    },
    onChangeContentPDF(newVal) {
      this.contentPDF = newVal;
    },
    async onGenPDF(formId: string): Promise<void> {
      const businessData = await getFormData(formId);
      const dateCreatedAt = moment(businessData["created_at"]);
      const employees = businessData["clients"].filter(
        (item) => item.type === "employee"
      );
      const guides = businessData["clients"].filter(
        (item) => item.type === "guide"
      );
      const customers = businessData["clients"].filter(
        (item) => item.type === "Customer"
      );
      const test2 = customers.map((item, index) => [
        { text: `${index + 1}`, style: "static", alignment: "center" },
        { text: `${item.name ?? ""}`, style: "static" },
        {
          text: `${item.gender === "Nam" ? item.birthYear : ""}`,
          style: "static",
          alignment: "center",
        },
        {
          text: `${item.gender === "Nữ" ? item.birthYear : ""}`,
          style: "static",
          alignment: "center",
        },
        { text: `${item.cardId ?? ""}`, style: "static", alignment: "center" },
        { text: `${item.nation ?? ""}`, style: "static", alignment: "center" },
        { text: `${item.place ?? ""}`, style: "static", alignment: "center" },
        { text: `${item.note ?? ""}`, style: "static", alignment: "center" },
      ]);
      const docDefinition = {
        content: [
          {
            text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
            style: "header",
            bold: true,
            alignment: "center",
          },
          {
            text: "Độc lập - Tự do - Hạnh phúc",
            style: "underlineStyle",
            bold: true,
            alignment: "center",
          },
          {
            text: "DANH SÁCH ",
            style: "title",
            bold: true,
            alignment: "center",
            margin: [12, 12, 12, 0],
          },
          {
            text: "HÀNH KHÁCH VẬN TẢI ĐƯỜNG THỦY NỘI ĐỊA",
            style: "title",
            bold: true,
            alignment: "center",
            margin: [0, 0, 0, 10],
          },
          {
            columns: [
              {
                text: " - Tên phương tiện: ",
                bold: false,
                alignment: "left",
              },
              {
                text: businessData["meanName"],
                bold: true,
                margin: [20, 0, 20, 0],
              },
              {
                text: [
                  "Số đăng ký: ",
                  { text: `${businessData["meanNumber"]} `, bold: true },
                ],
              },
            ],
            margin: [32, 8, 8, 0],
          },
          {
            columns: [
              {
                width: "35%",
                text: " - Tên thuyền trưởng:",
                bold: false,
                alignment: "left",
              },
              {
                width: "auto",
                text: businessData["captain"].toUpperCase(),
                style: "headerText",
                bold: true,
                alignment: "left",
              },
            ],
            columnGap: 12,
            margin: [32, 8, 8, 0],
          },

          {
            columns: [
              {
                width: "35%",
                text: " - Tên chủ tàu:",
                bold: false,
                alignment: "left",
              },
              {
                width: "auto",
                text: businessData["ownerName"].toUpperCase(),
                bold: true,
                style: "headerText",
                alignment: "left",
              },
            ],
            columnGap: 12,
            margin: [32, 8, 8, 0],
          },
          {
            text: [
              " - Trọng tải đăng ký:  ",
              { text: `${businessData["tonnage"] ?? 0} `, bold: true },
              "(tấn) ",
              { text: ` ${businessData["seats"] ?? 0}`, bold: true },
              " (ghế)",
            ],
            margin: [32, 8, 8, 0],

            bold: false,
          },
          {
            text: [
              " - Số lượng thuyền viên: ",
              { text: ` ${businessData["totalShipMember"] ?? 0}`, bold: true },
              " (người)",
            ],
            margin: [32, 8, 8, 0],

            bold: false,
          },
          {
            text: [
              " - Số hành khách: ",
              { text: ` ${customers?.length ?? 0}`, bold: true },
              " (người)",
            ],
            margin: [32, 8, 8, 0],

            bold: false,
          },
          {
            columns: [
              {
                text: [
                  " - Quốc tịch: Việt Nam: ",
                  {
                    text: businessData["localCustomerNumber"] ?? 0,
                    bold: true,
                  },
                  " (người)",
                  ", Nước ngoài: ",
                  {
                    text: businessData["internationalCustomerNumber"] ?? 0,
                    bold: true,
                  },
                  " (người)",
                ],
              },
            ],
            margin: [32, 8, 8, 0],

            alignment: "left",
          },
          {
            columns: [
              {
                text: [
                  " - Bến rời: ",
                  { text: `${businessData["fromStation"] ?? ""}`, bold: true },
                  " ; ",
                  "Bến đến: ",
                  { text: `${businessData["toStation"] ?? ""}`, bold: true },
                  " ; ",
                  ` Thời gian rời bến: ${businessData["time"] ?? ""}`,
                ],
              },
            ],
            margin: [32, 8, 8, 0],

            alignment: "left",
          },
          {
            columns: [
              {
                width: 150,
                text: " - Hướng dẫn viên: ",
                bold: false,
                alignment: "left",
              },
              {
                stack: guides?.map((item, index) => [
                  `${index + 1}. ${item.name}`,
                ]),
              },
            ],
            columnGap: 1,
            margin: [32, 8, 8, 0],
          },
          {
            columns: [
              {
                width: 150,
                text: " - Nhân viên phục vụ: ",
                bold: false,
                alignment: "left",
              },
              {
                stack: employees?.map((item, index) => [
                  `${index + 1}. ${item.name}`,
                ]),
              },
            ],
            columnGap: 1,
            margin: [32, 8, 8, 5],
          },
          {
            style: "tableExample",
            table: {
              headerRows: 2,
              widths: [20, 110, "auto", "auto", 70, 60, 75, 70],

              body: [
                [
                  { text: "STT", style: "tableHeader", bold: true, rowSpan: 2 },
                  {
                    text: "Họ và tên khách",
                    style: "tableHeader",
                    bold: true,
                    rowSpan: 2,
                    alignment: "center",
                  },
                  {
                    text: "Năm sinh",
                    colSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                    bold: true,
                  },
                  {},
                  {
                    text: "Số CMND (Số hộ chiếu)",
                    style: "tableHeader",
                    bold: true,
                    rowSpan: 2,
                    alignment: "center",
                  },
                  {
                    text: "Quốc tịch",
                    style: "tableHeader",
                    bold: true,
                    rowSpan: 2,
                    alignment: "center",
                  },
                  {
                    text: "Nơi tạm trú (đối với khách nước ngoài)",
                    style: "tableHeader",
                    rowSpan: 2,
                    alignment: "center",
                    bold: true,
                  },
                  {
                    text: "Ghi chú",
                    style: "tableHeader",
                    alignment: "center",
                    bold: true,
                    rowSpan: 2,
                  },
                ],
                [
                  {},
                  {},
                  {
                    text: "Nam",
                    style: "tableHeader",
                    alignment: "center",
                    bold: true,
                  },
                  {
                    text: "Nữ",
                    style: "tableHeader",
                    alignment: "center",
                    bold: true,
                  },
                  {},
                  {},
                  {},
                  {},
                ],
              ].concat(test2),
            },
          },
          {
            text: "(Thuyền trưởng phải lập và nộp danh sách cho Bộ đội Biên phòng, Ban quản lý bến trước khi phương tiện xuất bến)",
            margin: 2,
            alignment: "center",
            fontSize: 10,
            italics: true,
          },
          {
            columns: [
              {
                stack: [
                  {
                    text: " ĐẠI DIỆN BQL CẢNG, BẾN",
                    style: "mark",
                    bold: true,
                  },
                  {
                    text: "(Ký, ghi rõ họ tên)",
                    alignment: "left",
                    margin: [18, 0, 0, 0],
                    italics: true,
                  },
                ],
                alignment: "left",
                width: "50%",
              },

              {
                stack: [
                  {
                    text: `Khánh Hòa, ngày ${
                      !isNaN(dateCreatedAt.date()) ? dateCreatedAt.date() : ""
                    } tháng ${
                      !isNaN(dateCreatedAt.month()) ? dateCreatedAt.month() : ""
                    } năm ${
                      !isNaN(dateCreatedAt.year()) ? dateCreatedAt.year() : ""
                    }`,
                    italics: true,
                  },
                  {
                    text: " NGƯỜI LẬP DANH SÁCH",
                    style: "mark",
                    bold: true,
                    alignment: "center",
                  },
                  {
                    text: "(Ký, ghi rõ họ tên)",
                    alignment: "center",
                    italics: true,
                  },
                ],
                width: "50%",
              },
            ],
            margin: 20,
            columnGap: 5,
          },
        ],
        styles: {
          underlineStyle: {
            decoration: "underline",
            fontSize: 10,
          },
          static: {
            fontSize: 10,
          },
          mark: {
            fontSize: 12,
          },
          title: {
            fontSize: 14,
          },
          tableExample: {
            pageBreak: "before",
            noWrap: false,
            margin: 3,
          },
          tableHeader: {
            fontSize: 10,
          },
          headerText: {
            characterSpacing: 0.4,
          },
        },
        pageMargins: [30, 30, 30, 30],
      };
      const vfsInherit = pdfFonts?.pdfMake?.vfs ?? {
        "Roboto-Italic.ttf": FONT_ITALIC,
        "Roboto-Medium.ttf": FONT_MEDIUM,
        "Roboto-MediumItalic.ttf": FONT_MEDIUM_ITALIC,
        "Roboto-Regular.ttf": FONT_REGULAR,
      };

      pdfMake
        .createPdf(docDefinition as any, undefined, undefined, vfsInherit)
        .open();
    },
    async getBussinessData() {
      this.$emit("handleLoading", true);
      let getDatas: any = await getBussinessData();
      const forms: any = [];
      const idVehicles: any = [];
      const role = this.$store.state.user.data?.role;
      getDatas = getDatas.filter((data) => {
        return this.labelType
          .find((label) => label.en === data.type)
          ?.roleAcess.includes(role);
      });
      for (const form of getDatas) {
        let vehicle: any = {};
        if (!idVehicles.includes(form["idVehicle"])) {
          idVehicles.push(form["idVehicle"]);
          const getDataVehicle = await getVehicle(form["idVehicle"]);
          vehicle = { ...getDataVehicle, idVehicle: form["idVehicle"] };
          this.vehicles.push(vehicle);
        } else {
          vehicle = this.vehicles.find(
            (vehicle) => vehicle["idVehicle"] === form["idVehicle"]
          );
        }
        form["typeConvert"] = this.labelType.find(
          (label) => label.en === form.type
        )?.vi;
        form["backgroundColor"] = this.labelType.find(
          (label) => label.en === form.type
        )?.backgroundColor;

        form["sorting"] = this.labelType.find(
          (label) => label.en === form.type
        )?.sorting;
        form["time_created"] = moment(
          form.created_at,
          "DD/MM/YYYY HH:mm"
        ).format("DD/MM/YYYY HH:mm");
        form["sortTime"] = moment(form.created_at, "DD/MM/YYYY");
        forms.push({ ...(form as any), vehicle });
      }
      this.listBussinessData = [...forms];
      this.listBussinessDataClone = [...forms];
      this.sortBy("sorting", ["asc", "asc"]);
      this.paginationHandle();

      this.$emit("handleLoading", false);
    },
    gotoDetail(id) {
      this.open = true;
      this.currentId = id;
    },
    createForm() {
      this.currentId = "";
      this.open = true;
      // this.$router.push("/form");
    },
    closePopup(currentId = "") {
      this.open = false;
      this.currentId = currentId;
    },
    resetPopup() {
      this.search = "";
      this.filterType = [];
      this.fieldsSort = ["typeConvert", "sortTime"];
      this.page = 1;
      this.getBussinessData();
      this.open = false;
    },
    async rejectForm(id) {
      const type = "reject";
      const setAPIData = this.listBussinessDataClone.find((e) => e.id === id);
      const data = { ...setAPIData, type: type };
      delete data["typeConvert"];
      delete data["backgroundColor"];
      delete data["sorting"];
      delete data["time_created"];
      delete data["sortTime"];
      const actionFormData = await updateFormData(id, data);
      if (actionFormData) {
        this.alertColor = "green";
        this.alert = true;
        this.messageAlert = `Bạn cập nhật Trạng thái của tàu có số đăng ký ${setAPIData.meanNumber} sang từ chối thành công`;
        this.getBussinessData();
        setTimeout(() => {
          this.alert = false;
        }, 3000);
      } else {
        this.alertColor = "red";

        this.alert = true;
        this.messageAlert = `Bạn cập nhật Trạng thái của tàu có số đăng ký ${setAPIData.meanNumber} sang từ chối không thành công`;
        setTimeout(() => {
          this.alert = false;
        }, 3000);
      }
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
.color-black {
  color: black;
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

<style>
.search-box {
  width: 25%;
  margin-left: auto;
  flex: unset;
  min-width: 450px;
}
.search-box .v-field__field {
  align-items: center;
}

.filter-box {
  width: 25%;
  margin-right: auto;
  flex: unset;
}
@media screen and (max-width: 500px) {
  .action-form {
    flex-direction: column;
  }
  .search-box {
    width: 100%;
    min-width: unset;
  }
  .filter-box {
    width: 100%;
  }
}
.search-box input[type="text"] {
  min-height: auto;
  padding: 10px;
}
</style>
