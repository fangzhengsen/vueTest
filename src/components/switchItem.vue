<template>
  <span class="switch-item">
    <!-- input 类型-->
    <div style="display: flex" v-if="item.type === 'input'">
      <el-input
        :style="{width: item.itemWidth || '100%'}"
        :type="item.type"
        :rows="item.rows"
        :maxlength="item.maxlength"
        :placeholder="item.placeholder || '请输入' + item.label"
        :clearable="item.clearable || false"
        :disabled="item.disabled || false"
        v-model="item.value"
      ></el-input>
    </div>
    <!-- inputNumber 类型-->
    <template v-if="item.type === 'inputNumber'">
      <el-input-number
        v-model="item.value"
        :disabled="item.disabled || false"
        :controls-position="item.position"
        @change="item.change&&item.change(item)"
        :min="item.min || 1"
        :max="item.max || 600"
      ></el-input-number>
      <span v-if="item.unit" style="margin-left:10px;">{{item.unit}}</span>
    </template>
    <!-- select 类型-->
    <el-select
      v-else-if="item.type === 'select'"
      :style="{width: item.itemWidth || '100%'}"
      :multiple="item.multiple || false"
      :popper-append-to-body="false"
      :clearable="item.clearable || false"
      :collapse-tags="item.collapseTags"
      @change="item.change && item.change(item)"
      :filterable="item.filterable || false"
      :placeholder="item.placeholder || '请选择' + item.label"
      :disabled="item.disabled || false"
      v-model="item.value"
    >
      <el-option
        v-for="(opt, ind) in item.options"
        :key="ind"
        :disabled="item.disabled || false"
        :label="opt.dictValue"
        :value="opt.dictKey"
      ></el-option>
    </el-select>
    <!-- radio 类型-->
    <el-radio-group
      v-else-if="item.type === 'radio'"
      :disabled="item.disabled || false"
      :style="{width: item.itemWidth || '100%'}"
      @change="item.change && item.change(item)"
      v-model="item.value"
    >
      <el-radio
        v-for="(opt, ind) in item.options"
        :key="ind"
        :label="opt.dictKey"
      >{{ opt.dictValue }}</el-radio>
    </el-radio-group>
    <!-- checkbox 类型-->
    <el-checkbox-group
      v-else-if="item.type === 'checkbox'"
      v-model="item.value"
      @change="item.change && item.change(item)"
      :disabled="item.disabled || false"
      :max="item.max"
    >
      <el-checkbox
        v-for="(opt, ind) in item.options"
        :key="ind"
        :disabled="opt.disabled"
        :label="opt.dictKey"
      >{{ opt.dictValue }}</el-checkbox>
    </el-checkbox-group>
    <!-- switch 类型-->
    <el-switch
      v-else-if="item.type === 'switch'"
      v-model="item.value"
      :disabled="item.disabled || false"
      :active-color="item.activeColor || '#3388ff'"
      :inactive-color="item.inactiveColor || '#ededed'"
      :active-value="item.activeValue || true"
      :inactive-value="item.inactiveValue || false"
    ></el-switch>
    <!-- cascader 类型-->
    <el-cascader
      v-else-if="item.type === 'cascader'"
      v-model="item.value"
      :disabled="item.disabled || false"
      :placeholder="item.placeholder || '请选择' + item.label"
      :options="item.options"
      :clearable="item.clearable"
      :props="item.cascaderProps"
      @change="item.change(item)"
      :show-all-levels="item.showAllLevels || false"
    ></el-cascader>
    <!-- slotInput 类型-->
    <div
      v-else-if="item.type === 'slotInput' || item.type === 'slotTextarea'"
      style="display: flex; align-items: flex-end"
    >
      <el-input
        :type="item.type == 'slotTextarea' ? 'textarea' : 'input'"
        :rows="item.rows"
        :placeholder="item.placeholder || '请选择' + item.label"
        :disabled="item.inputDisabled || item.disabled || false"
        v-model="item.value"
      ></el-input>
      <el-button
        :loading="item.loading"
        v-if="!item.disabled"
        @click.native="item.callback && item.callback(item)"
        type="primary"
        class="btn-m"
        style="margin-left: 10px"
      >{{ item.append }}</el-button>
    </div>
    <!-- slotImg 类型-->
    <div v-else-if="item.type === 'slotImg'" class="img-shot" v-loading="item.loadingShotImg">
      <i class="el-icon-refresh" @click="item.callback && item.callback(item)"></i>
      <el-image fit="fill" v-if="item.value" :src="item.value"></el-image>
      <el-empty description="暂无数据" :image-size="item.imgSize || 85" v-else></el-empty>
    </div>
    <!-- date 类型-->
    <el-date-picker
      v-else-if="item.type === 'date'"
      v-model="item.value"
      :popper-class="item.customClass"
      :picker-options="item.pickerOptions"
      @focus="item.focus && item.focus(item)"
      @change="item.change && item.change(item,$event)"
      :clearable="item.clearable == undefined?true:item.clearable"
      :type="item.dateType || 'daterange'"
      :value-format="item.format || 'yyyy-MM-dd'"
      :start-placeholder="item.startHolder || '开始日期'"
      :end-placeholder="item.endHolder || '结束日期'"
      :placeholder="item.placeholder || '请选择时间'"
    ></el-date-picker>
    <!-- timePicker 类型-->
    <el-time-picker
      v-else-if="item.type === 'timePicker'"
      :is-range="item.range"
      v-model="item.value"
      :range-separator="item.rangeSeparator"
      :start-placeholder="item.startHolder || '开始时间'"
      :end-placeholder="item.endHolder || '结束时间'"
      :placeholder="item.placeholder || '选择时间范围'"
    ></el-time-picker>
    <!-- upload 类型-->
    <el-upload
      v-else-if="item.type === 'upload'"
      :disabled="item.disabled || false"
      :headers="{ 'Blade-Auth': item.token }"
      :action="item.action"
      :before-upload="item.beforeUpload"
      :on-change="item.onChange"
      :list-type="item.listType || ''"
      :on-preview="item.onPreview"
      :on-error="item.onError"
      :on-remove="item.onReomve"
      :file-list="item.value || []"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </span>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
})
</script>

<style lang="scss" scoped>
.switch-item {
  padding-right: 20px;
}
</style>