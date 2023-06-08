<script setup>
import { ref,watch,computed,nextTick  } from 'vue'
import wfForm from '@/components/wfForm.vue'
const option = ref({
  tsRowNum: 4,
  toggleOpen: true,
  title: '测试',
  addBtn: true,
  toggleType: true,
  viewBtn: true,
  tableSearch: [
    {
      prop: "requestType",
      label: "请求类型",
      value: "",
      type: "select",
      options: [
        {
          dictKey: "live_preview",
          dictValue: "实时预览"
        },
        {
          dictKey: "video_playback",
          dictValue: "录像回放"
        }
      ],
      rules: [
        {
          required: true,
          message: 'Please input email address',
          trigger: 'blur',
        },
        {
          type: 'email',
          message: 'Please input correct email address',
          trigger: ['blur', 'change'],
        },
      ]
    },
    {
      label: "名称",
      value: "",
      prop: "name",
      type: "input",
    },
    {
      label: "唯一标识",
      value: "",
      prop: "code",
      type: "input",
    },
    {
      prop: "tableName",
      label: "对应表名",
      value: "",
      shrink: true,
      type: "input",
    },
    {
      prop: "connMethod",
      label: "连接方式",
      shrink: true,
      value: "",
      type: "select",
      options: [
        {
          dictKey: 3,
          dictValue: "MINIO",
        },
        {
          dictKey: 1,
          dictValue: "FTP",
        },
        {
          dictKey: 2,
          dictValue: "HTTP",
        },
      ],
    },
  ],
  tableColumn: [
    {
      label: "视频名称",
      prop: "name",
      formate(row) {
        // 表格内容自定义
        return `<span title="${row[this.prop]
          }" class="clickable text-ellipsis-2">${row[this.prop]}</span>`;
      },
    },
    {
      //tag 类型配置
      label: "实时状态",
      prop: "connMethod",
      type: "select",
    },
  ],
  dialogColumn: [
    {
      label: "名称",
      value: "",
      type: "input",
      placeholder: "请输入名称",
      prop: "name",
    },
    {
      label: "版本号",
      value: "",
      type: "input",
      placeholder: "请输入版本号",
      prop: "connMethod",
    },
    {
      label: "固件类型",
      value: "",
      type: "input",
      placeholder: "请输入固件类型",
      prop: "type",
    },
  ],
})
const listData = ref([
  {
    name:'111111111',
    connMethod:2
  },
  {
    name:'2222222222',
    connMethod:3
  },
  {
    name:'33333333',
    connMethod:4
  },
  {
    name:'4444444444',
    connMethod:1
  },
  {
    name:'55555555',
    connMethod:2
  },
  {
    name:'6666666666',
    connMethod:4
  },
])
const search=ref({})
const cardConfig = ref({
  num: 4, //一行显示个数
  proportion: 1.28, //卡片高宽比
})
let pages = ref({
  paginationClass: 'pagination-test',
  current: 1,
  size: 10,
  total: 1000,
  layout: "prev, pager, next,sizes",
  sizes: [10, 20, 30, 40, 50, 100]
})
const open = ref(false)
function getList(){
  console.log(pages.value,'33333');
}
function rowDel(row){
  console.log(row.name,'del');
}
</script>

<template>
  <div class="app-wrap">
    <div class="menu-left"></div>
    <wfForm :option="option" 
    v-model:cardConfig="cardConfig"
    v-model:pages="pages"
    v-model:search="search"
    @on-load="getList"
    @row-del="rowDel"
    :data="listData" :open="open" @toggleOpen="open=!open">
      <template #cardComp="{data}">
        <div>{{ data }}</div>
      </template>
    </wfForm>
  </div>
</template>

<style scoped lang="scss">
.app-wrap{
  display: flex;
  padding: 20px;
  .menu-left{
    width: 300px;
  }
  .wf-form-wrap{
    flex: 1;
  }
}

</style>
