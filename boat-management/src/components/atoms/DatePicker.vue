<template>
  <v-dialog v-model="display" class="mt-3">
    <template :isActive="true">
      <v-text-field
      class="mt-2"
        v-on="true"
        hide-details="auto"
        readonly
        outlined
        clearable
      >
        <template>
          <slot name="progress">
            <v-progress-linear color="primary" indeterminate absolute height="2"></v-progress-linear>
          </slot>
        </template>
      </v-text-field>
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs fixed-tabs>
          <v-tab key="calendar">
            <slot name="dateIcon">
              <span style="font-size: 24px">日付</span>
            </slot>
          </v-tab>
          <v-tab key="timer">
            <slot name="timeIcon">
              <span style="font-size: 24px">時刻</span>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-time-picker
              ref="timer"
              class="v-time-picker-custom"
              full-width
              use-seconds
              format="24hr"

            />
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <slot name="actions" :parent="getParent()">
          <v-btn color="grey lighten-1" >clear</v-btn>
          <v-btn color="green darken-1">ok</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>



<script lang="ts">
  export default {
    data: () => ({
      display: false
    }),
    methods: {
      getParent(): any {
        return this
      }
    }
  }
</script>




<style>
.v-date-picker-table--date td {
  padding: 0 !important;
}
</style>