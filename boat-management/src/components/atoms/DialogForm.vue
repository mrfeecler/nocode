<template>
  <v-dialog
    v-model="openProp"
    width="500"
    class="font-weight-medium"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Thông tin hành khách</span>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-container>
          <v-row>
            <v-col cols="6" sm="6" md="6" class="name-field">
              <h4>Họ tên hành khách <span style="color: red">*</span></h4>
              <v-text-field
                variant="outlined"
                v-model="customerData['name']"
                required
                :rules="[rules.required, rules.counter]"
              />
            </v-col>
            <v-col cols="6" sm="6" md="6" class="birth-field">
              <h4>Năm sinh <span style="color: red">*</span></h4>
              <vue-date-picker
                v-model="customerData['birthYear']"
                locale="vi"
                format="yyyy"
                year-picker
                min-date="01/01/1990"
                :max-date="new Date()"
                select-text="Chọn"
                cancel-text="Đóng"
                :year-range="[1900, new Date().getFullYear()]"
              />
            </v-col>
          </v-row>

          <v-row class="mt-0">
            <v-col cols="6" class="name-field">
              <v-select
                :items="['Nam', 'Nữ']"
                label="Giới tính *"
                v-model="customerData['gender']"
                required
                variant="outlined"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="6" class="birth-field">
              <v-autocomplete
                label="Quốc tịch *"
                :items="countries"
                variant="outlined"
                v-model="customerData['nation']"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row class="mt-0">
            <v-col cols="6" sm="6" md="6" class="name-field pt-0">
              <h4>CCCD / hộ chiếu</h4>
              <v-text-field
                variant="outlined"
                v-model="customerData['cardId']"
                required
              />
            </v-col>
            <v-col cols="6" sm="6" md="6" class="birth-field pt-0">
              <h4>Nơi tạm trú</h4>
              <v-text-field
                variant="outlined"
                v-model="customerData['place']"
                required
              />
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col cols="12" class="note-field pt-0">
              <h4>Ghi chú</h4>
              <v-text-field
                variant="outlined"
                v-model="customerData['note']"
                required
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" @click="onClosePopUp" variant="elevated">
          Đóng
        </v-btn>
        <v-btn
          color="green"
          variant="elevated"
          @click="onActionButton"
          :disabled="checkDisabledButton"
        >
          Lưu
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { CONTRIES } from "../../CommonFile";
export default {
  props: {
    setOpen: {
      type: Boolean,
      default: false,
    },
    chosenCustomerId: {
      type: String,
      default: "",
    },
    customerValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      openProp: this.setOpen,
      customerData: {},
      countries: CONTRIES,
      checkDisabledButton: true,
      rules: {
        required: (value: any) => !!value || "Xin mời nhập trường yêu cầu.",
        counter: (value: any) =>
          value.length > 1 || "Xin mời nhập tối thiểu 2 ký tự",
        isNumber: (value: any) =>
          /^\d+$/.test(value) || "Xin mời nhập đúng định dạng",
        counterBirth: (value: any) =>
          value.length === 4 || "Xin mời nhập 4 ký tự",
      },
    };
  },
  created(): void {
    this.init();
  },
  watch: {
    customerData: {
      handler(newVal) {
        this.checkDisabled();
      },
      deep: true,
    },
    setOpen(newValue: boolean): void {
      this.openProp = newValue;
    },
    customerValue(newVal): void {
      this.customerData = { ...newVal };
    },
  },
  methods: {
    init(): void {
      this.customerData = { ...this.customerValue };
    },
    checkDisabled() {
      const falseTrue =
        _.isEmpty(this.customerData["name"]) ||
        this.customerData["birthYear"] === null ||
        _.isEmpty(this.customerData["gender"]) ||
        this.customerData["name"]?.length < 2 ||
        _.isEmpty(this.customerData["nation"]);

      this.checkDisabledButton = falseTrue;
    },
    regisNewCustomer(): void {
      const newCustomer = {
        ...this.customerData,
        id: uuidv4(),
        type: "Customer",
      };
      this.$emit("onAddNewCustomer", newCustomer);
    },
    onChangeCustomerData(): void {
      this.$emit("onChangeCustomer", this.customerData);
    },
    onActionButton(): void {
      if (this.chosenCustomerId && this.chosenCustomerId.length > 0) {
        this.onChangeCustomerData();
      } else {
        this.regisNewCustomer();
      }
    },
    onClosePopUp(): void {
      this.$emit("onHandleActionDialog", false);
    },
  },
};
</script>

<style scoped>
.name-field {
  padding-left: 0 !important;
}
.birth-field {
  padding-right: 0 !important;
}
.note-field {
  padding: 0;
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
