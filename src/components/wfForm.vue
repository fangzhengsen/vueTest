<template>
  <div class="wf-form-wrap" ref="wfFormWrap">
    <!-- 搜索区域 -->
    <div class="table-search" ref="tableSearch">
      <el-form ref="tableSearchForm" class="table-search-form">
        <el-row :gutter="20">
          <template v-for="(searchItem, ind) in mergeOption.tableSearch" :key="ind">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="{ span: (24 / mergeOption.tsRowNum) * (searchItem.column || 1) }"
              v-if="open || !open && ind == 0"
            >
              <el-form-item
                :prop="searchItem.prop"
                :label="searchItem.label"
                :rules="searchItem.rules"
              >
                <switchItem :item="searchItem"></switchItem>
              </el-form-item>
            </el-col>
          </template>
          <el-col class="btn-group" :span="24 / mergeOption.tsRowNum">
            <!-- 表格搜索区域自定义卡槽 -->
            <slot name="search"></slot>
            <el-form-item>
              <!-- 表格搜索区域搜索按钮自定义卡槽 -->
              <slot name="searchMenu"></slot>
              <el-button @click="onReset">重置</el-button>
              <el-button @click="onSearch" type="primary">搜索</el-button>
              <el-button
                v-if="mergeOption.toggleOpen"
                @click="$emit('update:open', !open)"
                type="text"
                class="toggle"
              >
                {{
                open ? "收起" :
                "展开"
                }}
                <i
                  :class="open ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                ></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 内容主体 -->
    <div class="wf-form-content">
      <!-- 顶部操作区域 -->
      <el-row ref="menuTop" :gutter="10">
        <el-col class="menu-left" :span="12">
          <div class="t-title" v-if="mergeOption.title">{{ mergeOption.title }}</div>
          <div class="toggle-type" v-if="mergeOption.toggleType" @click="toggleType">
            <span :class="{ active: showCard == 'table' }">
              <el-icon>
                <Tickets />
              </el-icon>
            </span>
            <span :class="{ active: showCard == 'card' }">
              <el-icon>
                <Grid />
              </el-icon>
            </span>
          </div>
          <!-- 表格头部左侧插槽 -->
          <slot name="menuLeft"></slot>
        </el-col>
        <el-col :span="12" class="menu-right">
          <el-button
            type="primary"
            size="small"
            @click="showFormDialog('row-save')"
            v-if="mergeOption.addBtn"
          >
            {{
            mergeOption.addText
            }}
          </el-button>
          <!-- 表格头部右侧插槽 -->
          <slot name="menuRight"></slot>
        </el-col>
      </el-row>
      <!-- 表格式 -->
      <div v-show="showCard == 'table'">
        <!-- 表格插槽 -->
        <slot name="tableSlot" v-if="mergeOption.tableColumn == 'slot'"></slot>
        <!-- 表格式 -->
        <el-table
          v-else
          ref="multipleTable"
          :data="data"
          size="small"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column v-if="mergeOption.selection" type="selection" width="55" align="center"></el-table-column>
          <el-table-column
            v-if="mergeOption.index"
            label="序号"
            :index="indexMethod"
            type="index"
            :width="mergeOption.indexWidth || 50"
          ></el-table-column>
          <template v-for="(item, index) in mergeOption.tableColumn">
            <el-table-column
              v-if="!item.hidden"
              :label="item.label"
              :key="index"
              :width="item.labelWidth"
              :show-overflow-tooltip="item.tooltip || false"
            >
              <template #default="scope">
                <!-- 通过tableColumn配置formate方法自定义显示表格显示内容 -->
                <template v-if="item.type === 'slot'">
                  <slot :name="'col-' + item.prop" :row="scope.row" :index="scope.$index" />
                </template>
                <span
                  v-else-if="item.type == 'select'"
                  @click="item.callback && item.callback(scope.row, item.prop)"
                  v-html="(item.formate && item.formate(scope.row, item.prop)) ||
                    (getSelectVal[item.prop] &&
                      getSelectVal[item.prop][scope.row[item.prop]])"
                ></span>
                <span
                  class="column-formate"
                  v-else-if="item.formate"
                  @click="item.callback && item.callback(scope.row, item.prop)"
                  v-html="item.formate(scope.row, item.prop)"
                ></span>
                <span
                  @click="item.callback && item.callback(scope.row, item.prop)"
                  v-else
                >{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>
          </template>

          <el-table-column
            label="操作"
            align="center"
            v-if="mergeOption.controlWidth > 0"
            class-name="small-padding fixed-width"
            :width="mergeOption.controlWidth"
            fixed="right"
          >
            <template #default="scope">
              <slot name="tableBtn" :row="scope.row"></slot>
              <el-button
                size="small"
                :text="true"
                :disabled="scope.row.viewDisabled"
                v-if="mergeOption.viewBtn"
                @click="showFormDialog('detail', scope)"
              >
                {{
                mergeOption.viewText
                }}
              </el-button>
              <el-button
                size="small"
                :text="true"
                :disabled="scope.row.editDisabled"
                v-if="mergeOption.editBtn"
                @click="showFormDialog('row-update', scope)"
              >{{ mergeOption.editText }}</el-button>
              <el-button
                size="small"
                :text="true"
                :disabled="scope.row.delDisabled"
                v-if="mergeOption.delBtn"
                @click="showFormDialog('delete', scope)"
              >
                {{
                mergeOption.delText
                }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 卡片式 -->
      <div v-show="showCard == 'card'" v-loading="tLoading" class="card-content" ref="cardContent">
        <template v-if="data.length > 0">
          <el-row class="card-inner">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="{ span: Math.ceil(24 / mergeCardConfig.num) * (item.column || 1) }"
              v-for="(item, index) in data"
              :key="index"
            >
              <div
                class="card-item"
                :style="{ height: mergeCardConfig.height + 'px' }"
                :ref="'cardDom' + index"
              >
                <!-- 卡片组件插槽 -->
                <slot name="cardComp" :data="item"></slot>
              </div>
            </el-col>
          </el-row>
        </template>
        <div class="no-select" v-else>
          <img src="/img/img_empty@2x.png" width="380" height="210" alt />
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination
      v-if="pages"
      style="margin-top: 10px; text-align: right"
      ref="tablePage"
      :popper-class="mergePages.paginationClass"
      @current-change="currentChange"
      @size-change="sizeChange"
      :pager-count="mergePages.pagerCount"
      :page-sizes="mergePages.sizes"
      background
      :current-page="mergePages.current"
      :layout="mergePages.layout"
      :page-size="mergePages.size"
      :total="mergePages.total"
    ></el-pagination>
    <!-- 弹窗 -->
    <el-dialog
      class="wf-form-dialog"
      :top="mergeOption.dialogTop || '15vh'"
      :custom-class="mergeOption.dialogClass"
      :title="dialogTitle"
      v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      :modal-append-to-body="mergeOption.dialogAppend"
      :append-to-body="mergeOption.dialogAppend"
    >
      <el-form
        v-loading="mergeOption.dialogLoading"
        :model="dialogFormData"
        size="small"
        ref="dialogFormsRef"
        :label-width="mergeOption.dialogLableWidth || '100px'"
      >
        <template v-for="(item, index) in dialogColumn" :key="index">
          <el-form-item
            v-if="item.type != 'slot' && !item.hidden"
            :prop="item.prop"
            :label="item.label"
            :rules="item.rules"
          >
            <switchItem :item="item"></switchItem>
          </el-form-item>
          <template v-else>
            <el-form-item
              v-show="!item.hidden"
              :class="['slot-form', item.className]"
              :key="item.prop + item.type"
              :prop="item.prop"
              :label="item.label"
            >
              <slot :name="item.prop" :row="item"></slot>
            </el-form-item>
          </template>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          v-show="dialogType != 'detail'"
          @click="comfirmDialog"
          :loading="confirmLoading"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import switchItem from '@/components/switchItem.vue'
import {
  ref,
  watch,
  computed,
  nextTick,
  onMounted,
  getCurrentInstance,
} from 'vue'
let rowData = null
const { proxy } = getCurrentInstance()
const defaultOption = ref({
  tsRowNum: 4,
  toggleType: false,
  toggleOpen: false,
  dialogClass: '', // 弹窗自定义类名
  dialogAppend: true, //弹窗是否追加body
  dialogLoading: false, //弹窗是否加载中
  addBtn: true,
  title: '',
  addText: '新增',
  editBtn: true, //编辑按钮
  editText: '修改',
  viewBtn: true, //查看按钮
  viewText: '详情',
  delBtn: true, //行内删除按钮
  delText: '删除',
  controlWidth: 120,
  tableSearch: [],
  tableColumn: [],
  dialogColumn: [],
})
const defaultPage = ref({
  paginationClass: '',
  current: 1,
  size: 10,
  total: 0,
  layout: 'prev, pager, next',
  sizes: [10, 20, 30, 40, 50, 100],
})
let defaultCardConfig = ref({
  //卡片配置参数
  width: 0, //卡片宽度
  height: 0, //卡片高度
  num: 5, //一行显示个数
  proportion: 1.28, //卡片高宽比
})

/***props***/
const props = defineProps({
  option: {
    type: Object,
    default: () => {},
  },
  search: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Array,
    default: () => [],
  },
  tLoading: {
    type: Boolean,
    default: false,
  },
  open: {
    type: Boolean,
    default: false,
  },
  pages: {
    type: Object,
    default: () => {},
  },
  tableScroll: {
    // 表格区域滚动
    type: Boolean,
    default: true,
  },
  cardConfig: {
    type: Object,
    default: () => {},
  },
})

/***事件派发***/
const emit = defineEmits([
  'update:cardConfig',
  'update:pages',
  'update:open',
  'update:search',
  'showDialog',
  'row-save',
  'onLoad',
  'searchReset',
  'searchChange',
  'rowDel',
  'row-update',
])

/***dom元素***/
let cardContent = ref(null)
let wfFormWrap = ref(null)
let cardDom0 = ref(null)
let dialogFormsRef = ref(null)

/***响应式变量***/
let originOption = ref({})
let defaultValueObj = ref({})
let dialogColumn = ref([])
let dialogType = ref('')
let confirmLoading = ref(false)
let dialogFormVisible = ref(false)
let showCard = ref('table')

/***computed***/
let mergeOption = computed(() => {
  return Object.assign({}, defaultOption.value, props.option)
})
let mergeCardConfig = computed(() => {
  return Object.assign({}, defaultCardConfig.value, props.cardConfig)
})
let mergePages = computed(() => {
  return Object.assign({}, defaultPage.value, props.pages)
})

let dialogTitle = computed(() => {
  return dialogType == 'row-update'
    ? mergeOption.value.editTitle || '编辑'
    : dialogType == 'row-save'
    ? mergeOption.value.addTitle || '新增'
    : mergeOption.value.detTitle || '详情'
})
let dialogFormData = computed(() => {
  let obj = {}
  mergeOption.value.dialogColumn.map((item) => {
    obj[item.prop] = item.value
  })
  return obj
})

// 表格下拉值显示处理
let getSelectVal = computed(() => {
  let selects = mergeOption.value.tableSearch.filter(
    (item) => item.type == 'select'
  )
  let selObj = {}
  selects.map((item) => {
    let optObj = {}
    item.options &&
      item.options.map((opt) => {
        optObj[opt.dictKey] = opt.dictValue
      })
    selObj[item.prop] = optObj
  })
  return selObj
})

/***watch***/
watch(
  () => mergeOption.value.tableSearch,
  (newV, oldV) => {
    let obj = {}
    newV.map((item, index) => {
      obj[item.prop] = item.value
    })
    emit('update:search', obj)
  },
  {
    deep: true,
  }
)

/***Methods***/
function indexMethod(index) {
  return (mergePages.current - 1) * mergePages.size + parseInt(index + 1)
}
function currentChange(current) {
  refleshPage({ current })
  emit('onLoad')
}
function sizeChange(size) {
  refleshPage({ current: 1, size })
  emit('onLoad')
}
function toggleType() {
  showCard.value = showCard.value == 'card' ? 'table' : 'card'
  nextTick(() => {
    calcItemWidth()
  })
}
// 计算视频宽度
function calcItemWidth() {
  if (!cardContent.value) return
  let config = { ...mergeCardConfig.value }
  config.width = cardDom0.value[0].offsetWidth
  config.height = config.width / config.proportion
  emit('update:cardConfig', config)
}
/**
 * @param type 弹窗类型（1、detail:详情2、row-update:编辑3、row-save:新增4、delete:删除）
 */
function showFormDialog(type, scope) {
  dialogType.value = type
  if (type == 'delete') return handleDelete(scope)
  // 处理编辑，新增显示不同字段
  dialogColumn.value = mergeOption.value.dialogColumn.filter(
    (item) => !(item.hide && item.hide.includes(dialogType.value))
  )
  dialogColumn.value.map((item) => {
    item.value =
      (defaultValueObj.value[item.prop] &&
        JSON.parse(JSON.stringify(defaultValueObj.value[item.prop]))) ||
      ''
    item.disabled =
      (item.readOnly && item.readOnly.includes(dialogType.value)) || false
  })
  let item = scope && scope.row
  rowData = scope
  emit('showDialog', item, dialogType.value)
  if (type == 'row-update' || type == 'detail') {
    dialogColumn.value.map((that) => {
      for (const key in item) {
        if (key == that.prop && item['dialog' + key]) {
          // 如果弹窗展示跟列表展示不一样，showDialog处理时增加dialog属性
          that.value = item['dialog' + key]
        } else if (key == that.prop) {
          that.value = item[key]
        }
        if (type == 'detail') {
          //如果是详情，不可编辑
          that.disabled = true
        }
      }
    })
  }
  dialogFormVisible.value = true
  nextTick(() => {
    dialogFormsRef.value && dialogFormsRef.value.resetFields()
  })
}
function comfirmDialog() {
  let data = {}
  dialogColumn.value.map((item) => {
    data[item.prop] = item.value
  })
  dialogFormsRef.value.validate((valid) => {
    if (valid) {
      confirmLoading.value = true
      emit(dialogType.value, rowData, data, (error) => {
        confirmLoading.value = false
        if (!error) {
          dialogFormVisible.value = false
        }
      })
    } else {
      console.log(valid, 'valid')
    }
  })
}
// 重置
function onReset() {
  props.option.tableSearch.map((item, index) => {
    item.value = originOption.value.tableSearch[index].value
  })
  refleshPage({ current: 1 })
  nextTick(() => {
    emit('searchReset')
  })
}
function refleshPage({ current, size }) {
  let page = { ...mergePages.value }
  page.current = current
  if (size) {
    page.size = size
  }
  emit('update:pages', page)
}
// 搜索
function onSearch() {
  let obj = {}
  props.option.tableSearch.map((item, index) => {
    obj[item.prop] = item.value
  })
  refleshPage({ current: 1 })
  emit('searchChange')
}
function handleDelete(scope) {
  proxy.$msgbox
    .confirm('是否确定删除？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      emit('rowDel', scope.row)
    })
    .catch(() => {})
}
onMounted(() => {
  originOption.value = JSON.parse(JSON.stringify(props.option))
  // 处理新增默认回显值
  originOption.value.dialogColumn &&
    originOption.value.dialogColumn.map((item) => {
      defaultValueObj.value[item.prop] =
        item.value && JSON.parse(JSON.stringify(item.value))
    })
  emit('onLoad')
  calcItemWidth()
})
</script>

<style scoped lang='scss'>
.wf-form-wrap {
  .table-search {
    padding: 18px 24px 0 24px;
    background: #fff;
    margin-bottom: 20px;

    .el-row {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      .el-col {
        flex-shrink: 0;
        padding: 0 12px;
      }
    }

    .btn-group {
      display: flex;
      justify-content: flex-end;
      flex-grow: 1;
      max-width: 100%;
    }
  }

  .wf-form-content {
    padding: 0 20px 20px;
    background: #fff;

    .menu-left {
      display: flex;
      padding-top: 20px;

      .toggle-type {
        height: 32px;
        padding: 3px;
        background: #f5f5f5;
        border-radius: 4px;
        margin-left: 10px;

        & > span {
          display: inline-block;
          height: 26px;
          padding: 0 12px;
          line-height: 26px;
          color: #999;
          cursor: pointer;
          border-radius: 2px;

          &.active {
            background: #fff;
            color: #2a75ff;
          }
        }
      }

      .t-title {
        display: flex;
        align-items: center;
        font-weight: bold;
        color: #333333;
      }

      // height: 32px;
    }

    .menu-right {
      padding-top: 20px;
      text-align: right;
    }
  }

  .card-content {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    min-height: 200px;

    .card-inner {
      margin-left: -10px;
      margin-right: -10px;
    }

    .card-item {
      margin: 10px;
      border: 1px solid #555;
      transition: all 0.2s linear;

      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
    }

    .no-select {
      margin: 50px auto;
    }
  }
}
</style>