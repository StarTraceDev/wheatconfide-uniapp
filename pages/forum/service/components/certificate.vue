<template>
  <view class="certificate-box">
    <view class="certificate-content-box">
      <view class="certificate-content">
        <view class="title">
          <view> 资质信息<text class="require">(必填)</text> </view>
          <view class="tips">
            <image src="/static/auth/remark.png" class="img"></image>说明
          </view>
        </view>
        <view class="remark">此项信息正式上线后会公开展示在个人资料</view>
        <view class="id-card-form-box">
          <view
            class="id-card-form-content"
            v-for="(item, index) in certificateLists"
            :key="index"
          >
          <picker @change="(e) => bindPickerChange(e, index)" :value="item.selectIndex" :range="qualification" :range-key="'name'">
            <view class="form-item">
              <view class="label require">资质类别</view>
              <view class="content" :class="!item.name ? 'weight' : ''"></view>
              <view class="content" style="font-size: 24rpx">{{ item.name || '请选择' }}<u-icon name="arrow-right"></u-icon></view>
            </view>
          </picker>
            <view class="form-item">
              <view class="label require">发证时间</view>
              <view class="content">
                <view @click="() => showCertificateTimePicker(item, index)"
                  ><text style="font-size: 24rpx">
                    {{ item.date ? item.date : "请选择"}}
                    <u-icon name="arrow-right"></u-icon></text></view>
              </view>
            </view>
            <u-picker
              mode="time"
              v-model="certificatePickerShow"
              @confirm="confirmCertificateDate"
              :params="certificateDateParam"
            ></u-picker>
            <view class="form-item user-sign">
              <view class="label require">证书编号</view>
              <view class="content-input" style="width: 400rpx">
                <uni-easyinput
                  trim="all"
                  type="text"
                  placeholder="请输入证书编号"
                  :inputBorder="false"
                  :clearable="false"
                  v-model="item.number"
                  style="text-align: end"
                >
                </uni-easyinput>
              </view>
            </view>
            <view class="form-item user-introduction">
              <view class="label require">证件照片</view>
              <view class="introduction-content">
                <u-upload
                  :fileList="certificateLists[index].photoList"
                  :before-upload="beforeUpload"
                  :header="headers"
                  @on-success="(res) => uploadComplete(res, index)"  
                  @on-remove="(fileList) => deletePic(fileList, index)"   
                  name="file"
                  :action="uploadUrl"
                ></u-upload>
              </view>
            </view>
            <view class="line-box">
              <view class="line" :class="index > 0 ? 'line-delete' : ''"></view>
              <view
                v-if="index > 0"
                class="delete-item"
                @click="removeCertificateListHandler(index)"
              >
                <uni-icons
                  type="minus-filled"
                  size="30"
                  color="#FA5151"
                ></uni-icons>
                移除
              </view>
            </view>
          </view>
          <view class="add-certificate-btn" @click="addCertificateListHandler">
            <view class="btn"
              ><uni-icons
                type="plus-filled"
                size="18"
                color="rgba(0,0,0,.85)"
              ></uni-icons
              >增加一项</view
            >
          </view>
        </view>
      </view>
      <view class="certificate-content">
        <view class="title">
          <view>教育背景<text class="require">(选填)</text> </view>
          <view class="tips">
            <image src="/static/auth/remark.png" class="img"></image>说明
          </view>
        </view>
        <view class="remark">此项信息正式上线后会公开展示在个人资料</view>
        <view class="id-card-form-box">
          <view
            class="id-card-form-content"
            v-for="(item, index) in educationLists"
            :key="index"
          >
            <view class="form-item">
              <view class="label">起始时间</view>
              <view class="content" @click="showTimePicker(item, index, 1)">
                {{ item.startTime == null ? "请选择" : item.startTime }}
								<uni-icons
                  type="right"
                  size="14"
                  color="rgba(0, 0, 0, 0.3)"
                />
              </view>
            </view>
            <view class="form-item">
              <view class="label">截止时间</view>
              <view class="content" @click="showTimePicker(item, index, 2)">
                {{ item.endTime == null ? "请选择" : item.endTime }}
								<uni-icons
                  type="right"
                  size="14"
                  color="rgba(0, 0, 0, 0.3)"
                />
              </view>
            </view>
            <u-picker
              mode="time"
              v-model="timePickerShow"
              @confirm="confirmSchoolTime"
              :params="timePickerParams"
            ></u-picker>

            <view class="form-item user-sign">
              <view class="label">毕业院校</view>
              <view class="content-input" style="width: 400rpx">
                <uni-easyinput
                  trim="all"
                  type="text"
                  placeholder="请输入毕业院校"
                  v-model="item.schoolName"
                  :inputBorder="false"
                  :clearable="false"
                >
                </uni-easyinput>
              </view>
            </view>

            <view class="form-item user-sign">
              <view class="label">证书编号</view>
              <view class="content-input" style="width: 400rpx">
                <uni-easyinput
                  trim="all"
                  style="text-align: end"
                  type="text"
                  placeholder="请输入证书编号"
                  v-model="item.code"
                  :inputBorder="false"
                  :clearable="false"
                >
                </uni-easyinput>
              </view>
            </view>

            <view class="form-item user-sign">
              <view class="label">学历</view>
              <view class="content-input" style="width: 400rpx">
                <uni-easyinput
                  trim="all"
                  style="text-align: end"
                  type="text"
                  placeholder="请输入学历"
                  v-model="item.degree"
                  :inputBorder="false"
                  :clearable="false"
                >
                </uni-easyinput>
              </view>
            </view>

            <view class="form-item user-introduction">
              <view class="label">证件照片</view>
              <view class="introduction-content">
                <u-upload
                  :fileList="educationLists[index].photoList"
                  :before-upload="beforeUpload"
                  :header="headers"
                  @on-success="(res) => uploadComplete1(res, index)"
                  @on-remove="(fileList) => deletePic1(fileList, index)"
                  name="file"
                  :action="uploadUrl"
                ></u-upload>
              </view>
            </view>
            <view class="line-box">
              <view class="line line-delete"></view>
              <view
                class="delete-item"
                @click="removeEducationListsHandler(index)"
              >
                <uni-icons
                  type="minus-filled"
                  size="30"
                  color="#FA5151"
                ></uni-icons>
                移除
              </view>
            </view>
          </view>
        </view>
        <view class="add-certificate-btn" @click="addEducationListsHandler">
          <view class="btn" v-if="educationLists.length > 0"
            ><uni-icons
              type="plus-filled"
              size="18"
              color="rgba(0,0,0,.85)"
            ></uni-icons
            >增加一项</view
          >
          <view class="btn edit-btn" v-else>
            <image src="/static/auth/edit.png" class="img"></image>编辑
          </view>
        </view>
      </view>
      <view class="certificate-content">
        <view class="title">
          <view>伦理培训<text class="require">(选填)</text> </view>
          <view class="tips">
            <image src="/static/auth/remark.png" class="img"></image>说明
          </view>
        </view>
        <view class="remark">此项信息正式上线后会公开展示在个人资料</view>
        <view class="id-card-form-box">
          <view
            class="id-card-form-content"
            v-for="(item, index) in ethicsLists"
            :key="index"
          >
            <view class="form-item">
              <view class="label">起始时间</view>
              <view class="content" @click="showTimePicker(item, index, 1)">
                {{ item.startTime == null ? "请选择" : item.startTime }}
                <uni-icons
                  type="right"
                  size="14"
                  color="rgba(0, 0, 0, 0.3)"
                />
              </view>
            </view>
            <view class="form-item">
              <view class="label">截止时间</view>
              <view class="content" @click="showTimePicker(item, index, 2)">
                {{ item.endTime == null ? "请选择" : item.endTime }}
                <uni-icons
                  type="right"
                  size="14"
                  color="rgba(0, 0, 0, 0.3)"
                />
              </view>
            </view>
            <u-picker
              mode="time"
              v-model="timePickerShow"
              @confirm="confirmSchoolTime"
              :params="timePickerParams"
            ></u-picker>
            <view class="form-item user-sign">
              <view class="label">培训课程</view>
              <view class="content-input" style="width: 400rpx">
                <uni-easyinput
                  trim="all"
                  type="text"
                  placeholder="请输入培训课程"
                  v-model="item.career"
                  :inputBorder="false"
                  :clearable="false"
                  :placeholderStyle="{ 'text-align': 'right' }"
                >
                </uni-easyinput>
              </view>
            </view>
            <view class="form-item user-introduction">
              <view class="label">证件照片</view>
              <view class="introduction-content">
                <u-upload
                  :fileList="ethicsLists[index].photoList"
                  :before-upload="beforeUpload"
                  :header="headers"
                  @on-success="(res) => uploadComplete2(res, index)"
                  @on-remove="(fileList) => deletePic2(fileList, index)"
                  name="file"
                  :action="uploadUrl"
                ></u-upload>
              </view>
            </view>
            <view class="line-box">
              <view class="line line-delete"></view>
              <view class="delete-item" @click="removeEthicsListsHandler(index)">
                <uni-icons
                  type="minus-filled"
                  size="30"
                  color="#FA5151"
                ></uni-icons>
                移除
              </view>
            </view>
          </view>
          <view class="add-certificate-btn" @click="addEthicsListsHandler">
            <view class="btn" v-if="ethicsLists.length > 0"
              ><uni-icons
                type="plus-filled"
                size="18"
                color="rgba(0,0,0,.85)"
              ></uni-icons
              >增加一项</view
            >
            <view class="btn edit-btn" v-else>
              <image src="/static/auth/edit.png" class="img"></image>编辑
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { uploadFile } from "@/utils/common";
import { registerConsultantStep3 } from "@/common/api/consultant";
import { registerListenerStep3, getQualification } from "@/common/api/listener.js";
import { baseURL } from "@/utils/request";

// 1. 响应式变量初始化
const certificatePickerShow = ref(false);
const certificateLists = ref([
  { name: null, date: null, photoList: [], authority: null, number: null, listenerId: null, selectIndex: -1 }
]);
const educationLists = ref([]);
const ethicsLists = ref([]);
const qualification = ref([]);
const uploadUrl = ref(baseURL + "/api/common/upload");
const timePickerShow = ref(false);
const currentItem = ref(null);
const currentIndex = ref(-1);
const type = ref(0);
const token = uni.getStorageSync("token");
const headers = ref({ token });

// ✅ 【核心修复1】初始化赋值，永不undefined！父组件能拿到兜底值
const fromDataCertificate = ref({
  certificateList: [],
  educationList: [],
  ethicsList: [],
  consultantType: 1
});

// 2. 时间选择器参数
const timePickerParams = ref({
  year: true, month: true, day: false, hour: false, minute: false, second: false, timestamp: true
});
const certificateDateParam = ref({
  year: true, month: true, day: true, hour: false, minute: false, second: false, timestamp: true
});

// 3. 初始化资质列表
const initCertificateLists = (apiData) => {
  certificateLists.value.length = 0;
  const validData = Array.isArray(apiData) ? apiData : [];
  validData.forEach(item => {
    certificateLists.value.push({
      ...item,
      selectIndex: -1,
      qualificationValue: '',
      photoList: parseStrToImgArr(item.photos || '[]')
    });
  });
};

// 4. 获取资质类别接口
const getQualificationApi = async () => {
  try {
    const { data } = await getQualification();
    qualification.value = Array.isArray(data) ? data : [];
    initCertificateLists([]);
  } catch (err) {
    console.error("获取资质类别失败：", err);
    qualification.value = [];
    initCertificateLists([]);
  }
};

// 5. 时间选择器确认
const confirmSchoolTime = (e) => {
  if (!currentItem.value || currentIndex.value === -1) return;
  const monthStr = String(e.month).padStart(2, "0");
  const fullDate = `${e.year}-${monthStr}-01 00:00:00`;
  if (type.value === 1) {
    currentItem.value.startTime = fullDate;
  } else {
    currentItem.value.endTime = fullDate;
  }
  timePickerShow.value = false;
  currentItem.value = null;
};

// 6. 图片URL解析/转换核心函数
const getRealImgUrl = (obj) => {
  if (typeof obj === 'string') return obj;
  if (obj && obj.url) return getRealImgUrl(obj.url);
  return '';
};
const parseStrToImgArr = (str) => {
  if (!str || str === '' || str === '[]') return [];
  try {
    const jsonStr = str.replace(/'/g, '"');
    const res = JSON.parse(jsonStr);
    return Array.isArray(res) ? res.map(item => {
      const realUrl = getRealImgUrl(item);
      return realUrl ? { url: realUrl } : null;
    }).filter(Boolean) : [];
  } catch (err) {
    console.error('解析图片字符串失败：', err);
    return [];
  }
};
const parseImgArrToStr = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return '[]';
  try {
    const simpleArr = arr.map(item => {
      const realUrl = getRealImgUrl(item);
      return realUrl ? { url: realUrl } : null;
    }).filter(Boolean);
    return JSON.stringify(simpleArr).replace(/"/g, "'");
  } catch (err) {
    console.error('转换图片数组为字符串失败：', err);
    return '[]';
  }
};

// 7. 时间选择器显示/确认
const showCertificateTimePicker = (item, index) => {
  currentItem.value = item;
  currentIndex.value = index;
  certificatePickerShow.value = true;
};
const confirmCertificateDate = (e) => {
  if (!currentItem.value) return;
  const month = String(e.month).padStart(2, '0');
  const day = String(e.day).padStart(2, '0');
  currentItem.value.date = `${e.year}-${month}-${day}`;
  certificatePickerShow.value = false;
  currentItem.value = null;
};
const bindPickerChange = (e, index) => {
  const selectIdx = Number(e.detail.value);
  const selectItem = qualification.value[selectIdx];
  if (selectItem) {
    certificateLists.value[index].selectIndex = selectIdx;
    certificateLists.value[index].listenerId = selectItem.id || '';
    certificateLists.value[index].name = selectItem.name || '';
  }
};
const showTimePicker = (item, index, t) => {
  currentItem.value = item;
  currentIndex.value = index;
  type.value = t;
  timePickerShow.value = true;
};

// 8. 图片上传/删除处理
const beforeUpload = () => { return true; };
const uploadComplete = (res, index) => {
  if (!certificateLists.value[index]) return;
  const realUrl = res?.data?.url || res?.url || '';
  if (realUrl) certificateLists.value[index].photoList.push({ url: realUrl });
  else uni.showToast({ title: '图片上传失败，URL为空', icon: 'error' });
};
const uploadComplete1 = (res, index) => {
  if (!educationLists.value[index]) return;
  const realUrl = res?.data?.url || res?.url || '';
  if (realUrl) educationLists.value[index].photoList.push({ url: realUrl });
  else uni.showToast({ title: '图片上传失败，URL为空', icon: 'error' });
};
const uploadComplete2 = (res, index) => {
  if (!ethicsLists.value[index]) return;
  const realUrl = res?.data?.url || res?.url || '';
  if (realUrl) ethicsLists.value[index].photoList.push({ url: realUrl });
  else uni.showToast({ title: '图片上传失败，URL为空', icon: 'error' });
};
const deletePic = (fileList, index) => { certificateLists.value[index].photoList = fileList || []; };
const deletePic1 = (fileList, index) => { educationLists.value[index].photoList = fileList || []; };
const deletePic2 = (fileList, index) => { ethicsLists.value[index].photoList = fileList || []; };

// 9. 增删列表项
const addCertificateListHandler = () => {
  certificateLists.value.push({ name: "", date: "", photoList: [], authority: "", number: "", listenerId: null, selectIndex: -1 });
};
const addEducationListsHandler = () => {
  educationLists.value.push({ startTime: null, endTime: null, schoolName: null, idNumber: null, photoList: [], code: null, degree: null });
};
const addEthicsListsHandler = () => {
  ethicsLists.value.push({ startTime: null, endTime: null, schoolName: null, idNumber: null, photoList: [], code: null, career: '' });
};
const removeCertificateListHandler = (index) => { certificateLists.value.splice(index, 1); };
const removeEducationListsHandler = (index) => { educationLists.value.splice(index, 1); };
const removeEthicsListsHandler = (index) => { ethicsLists.value.splice(index, 1); };

// 10. 数据刷新与提交
const emit = defineEmits(["commited"]);
const props = defineProps({
  consultantType: Number,
  modelValue: Object,
});

const refreshData = () => {
  if (props.modelValue?.certificateList?.length) {
    certificateLists.value = props.modelValue.certificateList.map(e => {
      const photoList = parseStrToImgArr(e.photos || '[]');
      const { photos, ...rest } = e;
      return { ...rest, photoList, selectIndex: -1 };
    });
  } else {
    certificateLists.value = [{ name: null, date: null, photoList: [], authority: null, number: null, listenerId: null, selectIndex: -1 }];
  }
  if (props.modelValue?.educationList?.length) {
    educationLists.value = props.modelValue.educationList.map(e => {
      const photoList = parseStrToImgArr(e.photo || '[]');
      const { photo, ...rest } = e;
      return { ...rest, photoList };
    });
  } else {
    educationLists.value = [];
  }
  if (props.modelValue?.ethicsList?.length) {
    ethicsLists.value = props.modelValue.ethicsList.map(e => {
      const photoList = parseStrToImgArr(e.photos || '[]');
      const { photos, ...rest } = e;
      return { ...rest, photoList };
    });
  } else {
    ethicsLists.value = [];
  }
  // ✅ 【核心修复2】刷新数据时同步赋值，父组件随时能拿到最新值
  fromDataCertificate.value = {
    certificateList: certificateLists.value,
    educationList: educationLists.value,
    ethicsList: ethicsLists.value,
    consultantType: props.consultantType || 1
  };
};

const submit = async () => {
  if (props.consultantType === 1 && certificateLists.value.length === 0) {
    uni.showToast({ title: "请上传至少一张资质证书", icon: "error" });
    return;
  }
  const submitCertificateLists = JSON.parse(JSON.stringify(certificateLists.value));
  const submitEducationLists = JSON.parse(JSON.stringify(educationLists.value));
  const submitEthicsLists = JSON.parse(JSON.stringify(ethicsLists.value));

  submitCertificateLists.forEach(e => {
    e.photos = parseImgArrToStr(e.photoList || []);
    delete e.photoList; delete e.selectIndex;
  });
  submitEducationLists.forEach(e => {
    e.photo = parseImgArrToStr(e.photoList || []);
    delete e.photoList;
  });
  submitEthicsLists.forEach(e => {
    e.photos = parseImgArrToStr(e.photoList || []);
    delete e.photoList;
  });

  const data = {
    certificateList: submitCertificateLists,
    educationList: submitEducationLists,
    ethicsList: submitEthicsLists,
    consultantType: props.consultantType,
  };
  
  // ✅ 【核心修复3】赋值时机提前，每次submit都赋值，父组件永远能拿到值
  fromDataCertificate.value = data;

  try {
    const res = props.consultantType == 1 
      ? await registerConsultantStep3({ ...props.modelValue, ...data }) 
      : await registerListenerStep3({ ...props.modelValue, ...data });
    if (res.code === 0) {
      emit("commited", "");
    } else {
      uni.showToast({ title: res.msg || "提交失败", icon: "error" });
    }
  } catch (err) {
    console.error("提交失败：", err);
    uni.showToast({ title: "提交失败，请重试", icon: "error" });
  }
};

// 生命周期
onMounted(() => {
  refreshData();
  getQualificationApi();
});

// ✅ 确认暴露字段无误
defineExpose({ submit, refreshData, fromDataCertificate });
</script>

<style scoped lang="scss">
.certificate-box {
  width: 750rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .certificate-content-box {
    width: 686rpx;
    background: #fff;
    border-radius: 20rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding-bottom: 40rpx;

    .certificate-content {
      width: 630rpx;

      .title {
        color: #212528;
        font-size: 36rpx;
        margin-top: 36rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .require {
          font-size: 26rpx;
          color: rgba(0, 0, 0, 0.85);
        }

        .tips {
          color: rgba(0, 0, 0, 0.5);
          font-size: 24rpx;
          display: flex;
          align-items: center;

          .img {
            width: 26rpx;
            height: 26rpx;
            padding-right: 12rpx;
          }
        }
      }

      .remark {
        color: rgba(0, 0, 0, 0.5);
        font-size: 26rpx;
        margin-top: 12rpx;
      }

      .id-card-form-content {
        margin-top: 54rpx;

        .form-item {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-top: 52rpx;

          .label {
            position: relative;
            font-size: 28rpx;
            color: rgba(0, 0, 0, 0.85);
          }

          .require {
            &::after {
              content: "*";
              color: #fa5151;
              position: absolute;
              right: -20rpx;
            }
          }

          .content {
            font-size: 28rpx;
            text-align: right;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.35);

            ::v-deep .uni-calendar-item--checked {
              background-color: #35ca95 !important;
            }

            ::v-deep .uni-datetime-picker--btn {
              background-color: #35ca95 !important;
            }
          }

          .weight {
            color: rgba(0, 0, 0, 0.65);
          }
        }

        .user-sign {
          align-items: center;
          margin-top: 42rpx;

          .content-input {
            ::v-deep .uni-input-input {
              color: rgba(0, 0, 0, 0.35);
              text-align: right !important;
            }
          }
        }

        .user-introduction {
          flex-direction: column;

          .introduction-content {
            width: 630rpx;
            margin-top: 24rpx;
            display: flex;
            align-items: center;

            .upload-image {
              width: 160rpx;
              height: 160rpx;
              border-radius: 8rpx;
              background: #f4f6f8;
              box-sizing: border-box;
              border: 1px dashed rgba(0, 0, 0, 0.16);
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;

              .txt {
                color: rgba(0, 0, 0, 0.3);
                font-size: 24rpx;
                margin-top: 10rpx;
              }
            }

            .img-list {
              display: flex;
              align-items: center;
              height: 160rpx;

              .img-item {
                position: relative;
                margin-right: 20rpx;

                .img {
                  width: 160rpx;
                  height: 160rpx;
                }

                .delete-item-img {
                  height: 38rpx;
                  width: 100%;
                  background: rgba(0, 0, 0, 0.6);
                  color: #fff;
                  font-size: 22rpx;
                  line-height: 38rpx;
                  text-align: center;
                  position: absolute;
                  top: 122rpx;
                }
              }
            }
          }
        }

        .line-box {
          display: flex;
          align-items: center;

          .line {
            width: 630rpx;
            height: 2rpx;
            background-color: #f4f6f8;
          }

          .line-delete {
            width: 502rpx;
          }

          .delete-item {
            width: 128rpx;
            height: 52rpx;
            border-radius: 6rpx;
            display: flex;
            background: #ffffff;
            box-sizing: border-box;
            border: 0.5px solid #fa5151;
            justify-content: center;
            align-items: center;
            font-size: 28rpx;
            color: #fa5151;
          }
        }
      }

      .add-certificate-btn {
        margin-top: 20rpx;

        .btn {
          display: flex;
          align-items: center;
          width: 200rpx;
          height: 64rpx;
          justify-content: center;
          color: rgba(0, 0, 0, 0.85);
          font-size: 28rpx;
          box-sizing: border-box;
          border: 1px solid rgba(0, 0, 0, 0.6);
	border-radius: 10rpx;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          width: 148rpx;

          .img {
            width: 28rpx;
            height: 28rpx;
            padding-right: 20rpx;
          }
        }
      }
    }
  }
}
::v-deep .uni-easyinput__placeholder-class {
  text-align: right !important;
}
</style>