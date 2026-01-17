<template>
  <view class="id-card-box">
    <view class="id-card-content-box">
      <view class="id-card-content">
        <view class="title">身份认证</view>
        <view class="remark">仅用于身份实名核验，信息会严格保密</view>
        <!-- 身份证上传区域 -->
        <view class="unload-card-box">
          <view class="upload-card-item" @click="uploadPhoto(1)">
            <image
              :src="localData.idcardFront || '/static/auth/id-card-front.png'"
              class="img"
            />
            <view class="txt">身份证人像面</view>
          </view>
          <view class="upload-card-item" @click="uploadPhoto(2)">
            <image
              :src="localData.idcardBackend || '/static/auth/id-card-back.png'"
              class="img"
            />
            <view class="txt">身份证国徽面</view>
          </view>
        </view>
        <!-- 表单区域 -->
        <view class="id-card-form-content">
          <!-- 基本信息 -->
          <view class="form-item">
            <view class="label require">姓名</view>
            <view class="content">
              <input
                type="text"
                v-model="localData.name"
                placeholder="请输入姓名"
                class="form-input"
              />
            </view>
          </view>
          <view class="form-item">
            <view class="label require">身份证号</view>
            <view class="content">
              <input
                type="text"
                v-model="localData.idcardNum"
                placeholder="请输入身份证号"
                class="form-input"
              />
            </view>
          </view>
          <view class="form-item">
            <view class="label require">出生年月</view>
            <view class="content" @click="showTimePicker">
              <text>{{ localData.birthdate || "请选择" }}</text>
              <u-icon name="arrow-right"></u-icon>
              <u-picker
                type="text"
                v-model="birthdayShow"
                :params="timeParams"
                mode="time"
                @confirm="confirmBirthday"
              />
            </view>
          </view>
          <!-- 个人形象照 -->
          <view class="upload-section">
            <view class="label require requires">
              个人形象照
              <text class="sub-label">（用于个人主页封面，格式jpg/png，大小2M内）</text>
            </view>
            <u-upload
              :fileList="localData.masterGallery"
              :before-upload="beforeUpload"
              :header="headers"
              @on-success="uploadComplete1"
              @on-remove="(index, lists) => deletePic('masterGallery', index, lists)"
              name="file"
              :action="uploadUrl"
              :maxCount="5"
            />
          </view>
          <!-- 手持身份证件 -->
          <view class="form-item upload-with-image">
            <view class="upload-content">
              <view class="label require" style="width: 170rpx;">手持身份证件</view>
              <u-upload
                :fileList="localData.holdIdCardImg"
                :before-upload="beforeUpload"
                :header="headers"
                @on-success="uploadComplete2"
                @on-remove="(index, lists) => deletePic('holdIdCardImg', index, lists)"
                name="file"
                :action="uploadUrl"
                :maxCount="1"
              />
            </view>
            <image src="/static/auth/hold-in-hand.png" class="example-image" />
          </view>
          <!-- 承诺书 -->
          <view class="form-item upload-with-image">
            <view class="upload-content">
              <view class="label require" style="width: 200rpx;">手写承诺书照片</view>
              <u-upload
                :fileList="localData.commitmentImg"
                :before-upload="beforeUpload"
                :header="headers"
                @on-success="uploadComplete3"
                @on-remove="(index, lists) => deletePic('commitmentImg', index, lists)"
                name="file"
                :action="uploadUrl"
                :maxCount="1"
              />
            </view>
            <view class="promise">
              <view class="template" @click="handleTemplate('手写承诺书')">
                点击查看<text>《承诺书模板》</text>
              </view>
              <view class="promise-item" v-for="(item, index) in promiseRequirements" :key="index">
                <image src="/static/auth/stars.png" />
                <view>{{ item }}</view>
              </view>
            </view>
          </view>
          <!-- 星座选择 -->
          <view class="form-item">
            <view class="label require">星座</view>
            <picker :range="stars" @change="starChange">
              <view class="content picker-content">
                {{ localData.constellation || "请选择" }}
                <uni-icons type="right" size="14" color="rgba(0, 0, 0, 0.3)" />
              </view>
            </picker>
          </view>
          <!-- 地区选择 -->
          <view class="form-item">
            <view class="label require">所在地区</view>
            <view class="content" @click="chooseArea">
              {{ localData.address || "请选择" }}
              <uni-icons type="right" size="14" color="rgba(0, 0, 0, 0.3)" />
            </view>
            <u-picker
              v-model="regionPicker"
              @confirm="confirmRegion"
              mode="region"
            />
          </view>
          <!-- 个人签名 -->
          <view class="form-item user-sign">
            <view class="label">个人签名</view>
            <view class="content-input">
              <uni-easyinput
                trim="all"
                type="text"
                placeholder="请输入个人签名"
                :inputBorder="false"
                :clearable="false"
                v-model="localData.signature"
                class="signature-input"
              />
            </view>
          </view>
          <!-- 个人简介 -->
          <view class="form-item user-introduction">
            <view class="label">个人简介</view>
            <view class="introduction-content">
              <u-input
                type="textarea"
                border
                v-model="localData.profile"
                auto-height
                :height="height"
                placeholder="请输入个人简介"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps, watch, nextTick } from "vue";
import { uploadFile } from "@/utils/common";
import { onUnload } from "@dcloudio/uni-app";
import { registerConsultantStep1 } from "@/common/api/consultant.js";
import { registerListenerStep1 } from "@/common/api/listener.js";

// 常量定义
const STARS = [
  "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座",
  "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"
];

const PROMISE_REQUIREMENTS = [
  "字迹书写规整",
  "模板内容抄写完整", 
  "签字、按手印",
  "身份证正面向上合照"
];

// Props & Emits
const props = defineProps({
  consultantType: String,
  modelValue: {
    type: Object,
    default: () => ({})
  },
});

const emit = defineEmits(["update:modelValue", "committed"]);

// 解析masterGallery的工具方法
const parseMasterGallery = (val) => {
  // 空值（新用户）返回空数组
  if (!val || val === "[]" || val === "''") return [];
  try {
    // 解析字符串为数组
    const parsed = JSON.parse(val);
    // 确保是数组且每个项有url属性
    return Array.isArray(parsed) 
      ? parsed.map(item => ({ url: item.url || '' })).filter(item => item.url) 
      : [];
  } catch (e) {
    // 解析失败返回空数组
    return [];
  }
};

// 核心：本地数据维护（重点处理masterGallery）
const localData = ref({
  ...props.modelValue,
  // 初始化masterGallery：解析接口返回的字符串，无数据则为空数组（新用户）
  masterGallery: parseMasterGallery(props.modelValue.masterGallery),
  // 确保u-upload的fileList默认是数组
  holdIdCardImg: props.modelValue.holdIdCardImg || [],
  commitmentImg: props.modelValue.commitmentImg || []
});

// 标记是否为新用户（masterGallery初始为空）
const isNewUser = ref(!props.modelValue.masterGallery || parseMasterGallery(props.modelValue.masterGallery).length === 0);

// 监听props.modelValue变化，同步到本地（nextTick避免立即触发循环）
watch(
  () => props.modelValue,
  (newVal) => {
    nextTick(() => {
      const newMasterGallery = parseMasterGallery(newVal.masterGallery);
      localData.value = {
        ...newVal,
        masterGallery: newMasterGallery,
        holdIdCardImg: newVal.holdIdCardImg || [],
        commitmentImg: newVal.commitmentImg || []
      };
      // 更新新用户标记
      isNewUser.value = !newVal.masterGallery || newMasterGallery.length === 0;
    });
  },
  { immediate: true, deep: true }
);

// 监听本地数据变化，延迟通知父组件（打破递归循环）
watch(
  localData,
  (newVal) => {
    nextTick(() => {
      emit("update:modelValue", { ...newVal });
    });
  },
  { deep: true }
);

// 响应式数据
const birthdayShow = ref(false);
const regionPicker = ref(false);
const height = ref(150);
const token = uni.getStorageSync("token");
const headers = ref({ token });
const uploadUrl = ref("https://ceshi.maimiaoqingsu.com/api/common/upload");

const timeParams = ref({
  year: true,
  month: true,
  day: false,
  hour: false,
  minute: false,
  second: false,
});

const stars = ref(STARS);
const promiseRequirements = ref(PROMISE_REQUIREMENTS);

// 方法定义
const showTimePicker = () => {
  birthdayShow.value = true;
};

// 选择生日
const confirmBirthday = (e) => {
  localData.value.birthdate = `${e.year}-${e.month}`;
};

// 打开地区选择
const chooseArea = () => {
  regionPicker.value = true;
};

// 选择地区
const confirmRegion = (e) => {
  localData.value.address = e.province.name + e.city.name + e.area.name;
};

// 选择星座
const starChange = (e) => {
  localData.value.constellation = stars.value[e.detail.value];
};

// 查看承诺书
const handleTemplate = (type) => {
  uni.navigateTo({
    url: `/pages/webview/webview?type=${type}`,
  });
};

// 上传相关方法
const beforeUpload = () => {
  // 上传前校验逻辑（可补充文件大小/格式校验）
};

// 上传完成-个人形象照（确保生成[{url: xxx}]格式）
const uploadComplete1 = (data, index, lists) => {
  if (lists && lists[index]) {
    // 确保url赋值正确
    lists[index].url = data.data?.url || '';
    // 覆盖masterGallery，确保是[{url: xxx}]格式
    localData.value.masterGallery = lists.map(item => ({ url: item.url || '' })).filter(item => item.url);
  }
};

const uploadComplete2 = (data, index, lists) => {
  lists[index].url = data.data?.url || '';
  localData.value.holdIdCardImg = lists;
};

const uploadComplete3 = (data, index, lists) => {
  lists[index].url = data.data?.url || '';
  localData.value.commitmentImg = lists;
};

// 删除图片（同步更新masterGallery）
const deletePic = (field, index, lists) => {
  localData.value[field] = lists.map(item => ({ url: item.url || '' })).filter(item => item.url);
};

// 上传照片
const uploadPhoto = async (type) => {
  try {
    const res = await uni.chooseImage({ count: 1 });
    const filePath = res.tempFilePaths[0];
    const uploadRes = await uploadFile(uploadUrl.value, filePath);
    
    if (uploadRes.code === 0) {
      if (type === 1) {
        localData.value.idcardFront = uploadRes.data.url;
      } else {
        localData.value.idcardBackend = uploadRes.data.url;
      }
    }
  } catch (error) {
    console.error("上传失败:", error);
    uni.showToast({
      title: "上传失败",
      icon: "error"
    });
  }
};

// 提交表单
const submit = async () => {
  // 完善必填项校验
  const requiredFields = [
    { field: localData.value.idcardFront, message: "请上传身份证人像页" },
    { field: localData.value.idcardBackend, message: "请上传身份证国徽页" },
    { field: localData.value.name, message: "请输入姓名" },
    { field: localData.value.idcardNum, message: "请输入身份证号" },
    { field: localData.value.birthdate, message: "请选择出生年月" },
    // 核心：masterGallery校验 - 新用户必须上传，老用户只要有数据即可
    { 
      field: localData.value.masterGallery.length, 
      message: "请上传个人形象照",
      validate: () => !isNewUser.value ? true : localData.value.masterGallery.length > 0
    },
    { field: localData.value.holdIdCardImg?.length, message: "请上传手持身份证件照" },
    { field: localData.value.commitmentImg?.length, message: "请上传手写承诺书照" },
    { field: localData.value.constellation, message: "请选择星座" },
    { field: localData.value.address, message: "请选择所在地区" }
  ];

  // 校验必填项
  for (const item of requiredFields) {
    // 自定义校验逻辑
    if (item.validate) {
      if (!item.validate()) {
        uni.showToast({ title: item.message, icon: "none" });
        return;
      }
    } else if (!item.field) {
      uni.showToast({ title: item.message, icon: "none" });
      return;
    }
  }

  // 构造提交数据（重点：masterGallery转字符串，覆盖原有数据）
  const submitData = {
    ...localData.value,
    // masterGallery转JSON字符串，确保覆盖接口原有数据
    masterGallery: JSON.stringify(localData.value.masterGallery),
    consultantType: props.consultantType,
    idCardNo: localData.value.idcardNum,
    idCardFrontImg: localData.value.idcardFront,
    idCardBackImg: localData.value.idcardBackend,
    holdIdCardImg: localData.value.holdIdCardImg[0]?.url || '',
    commitmentImg: localData.value.commitmentImg[0]?.url || ''
  };

  uni.showLoading({ title: "提交中" });

  try {    
    const api = props.consultantType == '1' ? registerConsultantStep1 : registerListenerStep1;
    const res = await api(submitData);
    
    uni.hideLoading();
    localData.value = { ...localData.value, ...res.data };
    emit("committed", submitData);
    uni.showToast({ title: "提交成功", icon: "success" });
  } catch (error) {
    uni.hideLoading();
    console.error("提交失败:", error);
    uni.showToast({ title: "提交失败，请重试", icon: "error" });
  }
};

// 暴露方法
defineExpose({ submit });

onUnload(() => {
  // 清理逻辑（如需要可补充）
});
</script>

<style scoped lang="scss">
.id-card-box {
  width: 750rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .id-card-content-box {
    width: 686rpx;
    background: #fff;
    border-radius: 20rpx;
    display: flex;
    justify-content: center;

    .id-card-content {
      width: 630rpx;

      .title {
        font-size: 36rpx;
        font-weight: 500;
        color: #212528;
        margin-top: 36rpx;
      }

      .remark {
        font-size: 26rpx;
        color: rgba(0, 0, 0, 0.5);
        margin-top: 12rpx;
      }

      .unload-card-box {
        display: flex;
        justify-content: space-between;
        margin-top: 26rpx;

        .upload-card-item {
          width: 296rpx;
          height: 268rpx;
          border-radius: 10rpx;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          .img {
            width: 192rpx;
            height: 132rpx;
          }

          .txt {
            font-size: 24rpx;
            color: rgba(0, 0, 0, 0.6);
            margin-top: 40rpx;
          }
        }
      }

      .id-card-form-content {
        margin-top: 54rpx;

        .form-item {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-top: 52rpx;

          .content {
            font-size: 28rpx;
            text-align: right;
            color: rgba(0, 0, 0, 0.35);

            &.picker-content {
              color: rgba(0, 0, 0, 0.65);
            }
          }

          &.upload-with-image {
            align-items: flex-start;
          }
        }

        .upload-section {
          display: flex;
          flex-direction: column;
          margin-top: 25rpx;
        }

        .label {
          position: relative;
          font-size: 28rpx;
          color: rgba(0, 0, 0, 0.85);

          .sub-label {
            font-size: 20rpx;
            color: rgba(0, 0, 0, 0.5);
          }

          &.require::after {
            content: "*";
            color: #fa5151;
            position: absolute;
            right: -20rpx;
          }

          &.requires::after {
            left: 145rpx;
          }
        }

        .form-input {
          font-size: 28rpx;
          text-align: right;
        }

        .upload-content {
          flex: 1;
        }

        .example-image {
          height: 200rpx;
          width: 300rpx;
          margin-left: 20rpx;
          margin-top: 40rpx;
        }

        .user-sign {
          align-items: center;
          margin-top: 42rpx;

          .content-input {
            width: 400rpx;
          }

          .signature-input {
            text-align: right !important;
            color: rgba(0, 0, 0, 0.35);
          }
        }

        .user-introduction {
          flex-direction: column;
          margin-bottom: 30rpx;

          .introduction-content {
            margin-top: 24rpx;
            width: 100%;
          }
        }
      }
    }
  }
}

.promise {
  color: #9E9E9E;
  margin-left: 20rpx;

  .template {
    font-size: 24rpx;
    margin-bottom: 10rpx;

    text {
      color: #35CA95;
    }
  }

  &-item {
    font-size: 22rpx;
    display: flex;
    align-items: center;
    padding: 8rpx 0;

    image {
      width: 25rpx;
      height: 25rpx;
      margin-right: 20rpx;
    }
  }
}
</style>