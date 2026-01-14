<!-- <template>
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
              <view class="content" :class="!value ? 'weight' : ''"></view>
              <view class="content" style="font-size: 24rpx">{{ item.name || '请选择' }}<u-icon name="arrow-right"></u-icon></view>
            </view>
          </picker>
            <view class="form-item">
              <view class="label require">发证时间</view>
              <view class="content">
                <view @click="showCertificateTimePicker"
                  ><text style="font-size: 24rpx">
                    {{ item.date ? item.date : "请选择"}}
                    <u-icon name="arrow-right"></u-icon></text></view>
              </view>
            </view>
            <u-picker
              mode="time"
              v-model="certificatePickerShow"
              @confirm="confirmCertificateDate(item, $event)"
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
                  @on-success="uploadComplete($event)(index)"  
                  @on-remove="deletePic($event)(index)"   
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
              @confirm="confirmSchoolTime(item, $event)"
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
                  :fileList="trainLists[index].photoList"
                  :before-upload="beforeUpload"
                  :header="headers"
                  @on-success="uploadComplete1($event)(index)"
                  @on-remove="deletePic1($event)(index)"
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
            v-for="(item, index) in trainLists"
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
              @confirm="confirmSchoolTime(item, $event)"
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
                  :fileList="trainLists[index].photoList"
                  :before-upload="beforeUpload"
                  :header="headers"
                  @on-success="uploadComplete2"
                  @on-remove="(i, lists) => deletePic2(i, lists, 'photos', index)"
                  name="file"
                  :action="uploadUrl"
                ></u-upload>
              </view>
            </view>
            <view class="line-box">
              <view class="line line-delete"></view>
              <view class="delete-item" @click="removeTrainListsHandler(index)">
                <uni-icons
                  type="minus-filled"
                  size="30"
                  color="#FA5151"
                ></uni-icons>
                移除
              </view>
            </view>
          </view>
          <view class="add-certificate-btn" @click="addTrainListsHandler">
            <view class="btn" v-if="trainLists.length > 0"
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
import { ref, onMounted } from "vue";
import { uploadFile } from "@/utils/common";
import { registerConsultantStep3 } from "@/common/api/consultant";
import { registerListenerStep3, getQualification } from "@/common/api/listener.js";
import { baseURL } from "@/utils/request";
const certificatePickerShow = ref(false);
let certificateLists = ref([
  {
    name: null,
    date: null,
    photoList: [],
    authority: null,
    number: null,
    listenerId: null
  },
]);
const initCertificateLists = (apiData) => {
  certificateLists.length = 0;
  apiData.forEach(item => {
    certificateLists.push({
      ...item, 
      selectIndex: -1, 
      qualificationValue: '',
      photoList: item.photoList || []
    });
  });
};
const confirmCertificateDate = (item, e) => {
  item.date = e.year + "-" + e.month + "-" + e.day;
};
const uploadUrl = ref("");
uploadUrl.value = baseURL + "/api/common/upload";

let educationLists = ref([]);
const trainLists = ref([]);

const showCertificateTimePicker = () => {
  certificatePickerShow.value = true;
};
const qualification = ref([]);
const getQualificationApi = async () => {
  let { data } = await getQualification();
  qualification.value = data;
  initCertificateLists(data);
};
const bindPickerChange = (e, index) => {
  const selectIdx = Number(e.detail.value); 
  const selectItem = qualification.value[selectIdx];
  certificateLists.value[index].listenerId = qualification.value[selectIdx].id;
  certificateLists.value[index].name = selectItem?.name || qualification.value[selectIdx];
};
const deletePic = (imgIndex, fileLists) => {
  return (index) => {
    if (!certificateLists.value[index]) return;
    certificateLists.value[index].photoList = fileLists.map(item => item.url).filter(url => url);
    certificateLists.value = [...certificateLists.value];
  };
};

const deletePic1 = (imgIndex, fileLists) => {
  return (index) => {
    if (!educationLists.value[index]) return;
    educationLists.value[index].photoList = fileLists.map(item => item.url).filter(url => url);
    educationLists.value = [...educationLists.value];
  };
};

const deletePic2 = (imgIndex, fileLists) => {
  return (index) => {
    if (!trainLists.value[index]) return;
    trainLists.value[index].photoList = fileLists.map(item => item.url).filter(url => url);
    trainLists.value = [...trainLists.value];
  };
};

const timePickerParams = ref({
  year: true,
  month: true,
  day: false,
  hour: false,
  minute: false,
  second: false,
  timestamp: true,
});

const certificateDateParam = ref({
  year: true,
  month: true,
  day: true,
  hour: false,
  minute: false,
  second: false,
  timestamp: true,
});

const currentIndex = ref(-1);
const confirmSchoolTime = (item, e) => {
  const date = `${e.year}-${String(e.month).padStart(2, "0")}`;
  if (currentIndex.value === -1) return;
  if (type.value === 1) {
    educationLists.value[currentIndex.value].startTime = date;
  } else {
    educationLists.value[currentIndex.value].endTime = date;
  }
  educationLists.value = [...educationLists.value];

  timePickerShow.value = false
  if (type.value == 1) { 
  	item.startTime = e.year + '-' + e.month + '-' + '01 00:00:00'
  } else {
  	item.endTime = e.year + '-' + e.month + '-' + '01 00:00:00'
  }
};


const parseStrToImgArr = (str) => {
  if (!str || str === '' || str === '[]') return [];
  try {
    const res = JSON.parse(str);
    return Array.isArray(res) ? res.map(item => typeof item === 'string' ? { url: item } : { url: item.url || '' }) : [];
  } catch (err) {
    // 解析失败也返回空数组，不会报错
    return [];
  }
};

const parseImgArrToStr = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return '[]';
  const validArr = arr.filter(item => item.url && item.url.trim());
  return JSON.stringify(validArr);
};

const timePickerShow = ref(false);

const showTimePicker = (item, index, t) => {
  type.value = t;
  currentIndex.value = index;
  timePickerShow.value = true;
};

const beforeUpload = (index, list) => {
};
const uploadComplete2 = (data, imgIndex, fileLists) => {
  return (index) => {
    if (!trainLists.value[index]) return;
    const item = trainLists.value[index];
    if (!item.photoList) item.photoList = [];
    item.photoList.push(data.data.url);
    trainLists.value = [...trainLists.value];
  };
};


const token = uni.getStorageSync("token");
const headers = ref({
  token: token,
});
const type = ref(0);

const emit = defineEmits(["commited"]);
const formatImageListToStr = (urlList) => {
  if (!Array.isArray(urlList) || urlList.length === 0) {
    return '[]'; // 空数组返回空的格式
  }
  // 转换为 [{url: 'xxx'}] 格式的字符串
  const arr = urlList.map(url => ({ url }));
  return JSON.stringify(arr);
};
const submit = async () => {
  if (props.consultantType == 1) {
    if (certificateLists.value.length == 0) {
      uni.showToast({ title: "请上传至少一张资质证书", icon: "error" });
      return;
    }
    // 资质证书：photoList → photos (转字符串)
    certificateLists.value.forEach((e) => {
      e.photos = parseImgArrToStr(e.photoList);
    });
    // 教育经历：photoList → photo (转字符串) ✔️ 你的字段名不变
    educationLists.value.forEach((e) => {
      e.photo = parseImgArrToStr(e.photoList);
    });
    // 伦理培训：photoList → photos (转字符串)
    trainLists.value.forEach((e) => {
      e.photos = parseImgArrToStr(e.photoList);
    });

    let data = {
      ...props.modelValue,
      certificateList: certificateLists.value,
      educationList: educationLists.value,
      careerList: trainLists.value,
      consultantType: props.consultantType,
    };
    let res = await registerConsultantStep3(data);
    if (res.code == 0) {
      uni.showToast({ title: "提交成功" });
      emit("commited", "");
    }
  } else {
    // 监听者端 同样处理，补全教育经历转换 ✔️
    certificateLists.value.forEach((e) => {
      e.photos = parseImgArrToStr(e.photoList);
    });
    educationLists.value.forEach((e) => {
      e.photo = parseImgArrToStr(e.photoList);
    });
    trainLists.value.forEach((e) => {
      e.photos = parseImgArrToStr(e.photoList);
    });

    let data = {
      ...props.modelValue,
      certificateList: certificateLists.value,
      educationList: educationLists.value,
      careerList: trainLists.value,
      consultantType: props.consultantType,
    };
    let res = await registerListenerStep3(data);
    if (res.code == 0) {
      uni.showToast({ title: "提交成功" });
      emit("commited", "");
    }
  }
};

const props = defineProps({
  consultantType: Number,
  modelValue: Object,
});

const refreshData = () => {
  if (props.modelValue?.certificateList && props.modelValue?.certificateList.length > 0) {
    certificateLists.value = props.modelValue.certificateList.map((e) => ({
      ...e,
      photoList: parseStrToImgArr(e.photos),
      selectIndex: -1,
      qualificationValue: ''
    }));
  } else {
    certificateLists.value = [{name: null, date: null, photoList: [], authority: null, number: null, listenerId: null}];
  }

  if (props.modelValue?.educationList && props.modelValue?.educationList.length > 0) {
    educationLists.value = props.modelValue.educationList.map((e) => ({
      ...e,
      photoList: parseStrToImgArr(e.photo) 
    }));
  } else {
    educationLists.value = [];
  }

  if (props.modelValue?.careerList && props.modelValue?.careerList.length > 0) {
    trainLists.value = props.modelValue.careerList.map((e) => ({
      ...e,
      photoList: parseStrToImgArr(e.photos)
    }));
  } else {
    trainLists.value = [];
  }
};

onMounted(() => {
  refreshData();
  getQualificationApi();
});

defineExpose({
  submit,
  refreshData,
});

const uploadComplete = (data, imgIndex, fileLists) => {
  // 参数说明：data=上传返回数据, imgIndex=当前图片的索引, fileLists=当前上传组件的完整文件列表
  // 【关键】这里的 index 是 u-upload 绑定的列表项索引，在模板里通过参数传递
  return (index) => {
    // 双层兜底判断 1：判断当前列表项是否存在
    if (!educationLists.value[index]) return;
    const item = certificateLists.value[index];
    // 双层兜底判断 2：判断photoList是否存在，不存在则初始化空数组
    if (!item.photoList) item.photoList = [];
    // 正常追加图片url
    item.photoList.push(data.data.url);
    // 触发响应式更新
    certificateLists.value = [...certificateLists.value];
  };
};

const uploadComplete1 = (data, imgIndex, fileLists) => {
  return (index) => {
    // ✅ 第一层兜底：列表项不存在 直接终止，杜绝 undefined
    if (!educationLists.value[index]) return;
    const item = educationLists.value[index];
    // ✅ 第二层兜底：photoList不存在 初始化空数组
    if (!item.photoList) item.photoList = [];
    item.photoList.push(data.data.url);
    educationLists.value = [...educationLists.value];
  };
};

// 新增资质证书项
const addCertificateListHandler = () => {
  certificateLists.value.push({
    name: "", date: "", photoList: [], // ✅ 必带，初始化空数组
    authority: "", number: "", listenerId: null
  });
};

// 新增教育经历项
const addEducationListsHandler = () => {
  educationLists.value.push({
    startTime: null, endTime: null, schoolName: null, idNumber: null,
    consultantId: null, photoList: [], // ✅ 必带，初始化空数组
    code: null, degree: null,
  });
};

// 新增伦理培训项
const addTrainListsHandler = () => {
  trainLists.value.push({
    startTime: null, endTime: null, schoolName: null, idNumber: null,
    photoList: [], // ✅ 必带，初始化空数组
    code: null, career: ''
  });
};

const removeCertificateListHandler = (index) => {
  certificateLists.value.splice(index, 1);
};

const removeEducationListsHandler = (index) => {
  educationLists.value.splice(index, 1);
};
const removeTrainListsHandler = (index) => {
  trainLists.value.splice(index, 1);
};

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

            .textarea {
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
</style> -->

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
              <view class="content" :class="!value ? 'weight' : ''"></view>
              <view class="content" style="font-size: 24rpx">{{ item.name || '请选择' }}<u-icon name="arrow-right"></u-icon></view>
            </view>
          </picker>
            <view class="form-item">
              <view class="label require">发证时间</view>
              <view class="content">
                <view @click="showCertificateTimePicker"
                  ><text style="font-size: 24rpx">
                    {{ item.date ? item.date : "请选择"}}
                    <u-icon name="arrow-right"></u-icon></text></view>
              </view>
            </view>
            <u-picker
              mode="time"
              v-model="certificatePickerShow"
              @confirm="confirmCertificateDate(item, $event)"
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
                  @on-success="uploadComplete($event)(index)"  
                  @on-remove="deletePic($event)(index)"   
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
              @confirm="confirmSchoolTime(item, $event)"
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
                  @on-success="uploadComplete1($event)(index)"
                  @on-remove="deletePic1($event)(index)"
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
            v-for="(item, index) in trainLists"
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
              @confirm="confirmSchoolTime(item, $event)"
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
                  :fileList="trainLists[index].photoList"
                  :before-upload="beforeUpload"
                  :header="headers"
                  @on-success="uploadComplete2($event)(index)"
                  @on-remove="deletePic2($event)(index)"
                  name="file"
                  :action="uploadUrl"
                ></u-upload>
              </view>
            </view>
            <view class="line-box">
              <view class="line line-delete"></view>
              <view class="delete-item" @click="removeTrainListsHandler(index)">
                <uni-icons
                  type="minus-filled"
                  size="30"
                  color="#FA5151"
                ></uni-icons>
                移除
              </view>
            </view>
          </view>
          <view class="add-certificate-btn" @click="addTrainListsHandler">
            <view class="btn" v-if="trainLists.length > 0"
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
import { ref, onMounted } from "vue";
import { uploadFile } from "@/utils/common";
import { registerConsultantStep3 } from "@/common/api/consultant";
import { registerListenerStep3, getQualification } from "@/common/api/listener.js";
import { baseURL } from "@/utils/request";

// 1. 响应式变量初始化
const certificatePickerShow = ref(false);
const certificateLists = ref([
  { name: null, date: null, photoList: [], authority: null, number: null, listenerId: null }
]);
const educationLists = ref([]);
const trainLists = ref([]);
const qualification = ref([]);
const uploadUrl = ref(baseURL + "/api/common/upload");
const timePickerShow = ref(false);
const currentIndex = ref(-1);
const type = ref(0);
const token = uni.getStorageSync("token");
const headers = ref({ token });

// 2. 时间选择器参数
const timePickerParams = ref({
  year: true, month: true, day: false, hour: false, minute: false, second: false, timestamp: true
});
const certificateDateParam = ref({
  year: true, month: true, day: true, hour: false, minute: false, second: false, timestamp: true
});

// 3. 修复核心函数：initCertificateLists（操作ref数组必须通过.value）
const initCertificateLists = (apiData) => {
  certificateLists.value.length = 0; // 清空数组（操作value）
  const validData = Array.isArray(apiData) ? apiData : [];
  validData.forEach(item => {
    certificateLists.value.push({ // 正确访问ref数组
      ...item,
      selectIndex: -1,
      qualificationValue: '',
      photoList: item.photoList || []
    });
  });
};

// 4. 修复接口请求（增加容错，避免非数组返回）
const getQualificationApi = async () => {
  try {
    const { data } = await getQualification();
    qualification.value = Array.isArray(data) ? data : [];
    initCertificateLists(qualification.value);
  } catch (err) {
    console.error("获取资质类别失败：", err);
    qualification.value = [];
    initCertificateLists([]);
  }
};

// 5. 修复时间选择器递归更新问题（移除重复赋值）
const confirmSchoolTime = (item, e) => {
  if (currentIndex.value === -1) return;
  const monthStr = String(e.month).padStart(2, "0");
  const fullDate = `${e.year}-${monthStr}-01 00:00:00`;
  
  // 仅修改引用对象，避免重复更新数组
  if (type.value === 1) {
    item.startTime = fullDate;
  } else {
    item.endTime = fullDate;
  }
  timePickerShow.value = false;
};

// 6. 工具函数（解析图片列表）
const parseStrToImgArr = (str) => {
  if (!str || str === '' || str === '[]') return [];
  try {
    const res = JSON.parse(str);
    return Array.isArray(res) ? res.map(item => typeof item === 'string' ? { url: item } : { url: item.url || '' }) : [];
  } catch (err) {
    return [];
  }
};
const parseImgArrToStr = (arr) => {
  if (arr.length === 0) return '[]';
  const validArr = arr.map(item => ({ url: item }));
  return JSON.stringify(validArr);
};

// 7. 事件处理函数
const showCertificateTimePicker = () => {
  certificatePickerShow.value = true;
};
const confirmCertificateDate = (item, e) => {
  item.date = `${e.year}-${e.month}-${e.day}`;
};
const bindPickerChange = (e, index) => {
  const selectIdx = Number(e.detail.value);
  const selectItem = qualification.value[selectIdx];
  certificateLists.value[index].listenerId = selectItem?.id || '';
  certificateLists.value[index].name = selectItem?.name || '';
};
const showTimePicker = (item, index, t) => {
  type.value = t;
  currentIndex.value = index;
  timePickerShow.value = true;
};

// 8. 图片上传/删除
const beforeUpload = () => {};
const uploadComplete = (data) => (index) => {
  if (!certificateLists.value[index]) return;
  const item = certificateLists.value[index];
  item.photoList = item.photoList || [];
  item.photoList.push(data.data.url);
  certificateLists.value = [...certificateLists.value];
};
const uploadComplete1 = (data) => (index) => {
  if (!educationLists.value[index]) return;
  const item = educationLists.value[index];
  item.photoList = item.photoList || [];
  item.photoList.push(data.data.url);
  educationLists.value = [...educationLists.value];
};
const uploadComplete2 = (data) => (index) => {
  if (!trainLists.value[index]) return;
  const item = trainLists.value[index];
  item.photoList = item.photoList || [];
  item.photoList.push(data.data.url);
  trainLists.value = [...trainLists.value];
};
const deletePic = (_, fileLists) => (index) => {
  if (!certificateLists.value[index]) return;
  certificateLists.value[index].photoList = fileLists.map(item => item.url).filter(Boolean);
  certificateLists.value = [...certificateLists.value];
};
const deletePic1 = (_, fileLists) => (index) => {
  if (!educationLists.value[index]) return;
  educationLists.value[index].photoList = fileLists.map(item => item.url).filter(Boolean);
  educationLists.value = [...educationLists.value];
};
const deletePic2 = (_, fileLists) => (index) => {
  if (!trainLists.value[index]) return;
  trainLists.value[index].photoList = fileLists.map(item => item.url).filter(Boolean);
  trainLists.value = [...trainLists.value];
};

// 9. 增删列表项
const addCertificateListHandler = () => {
  certificateLists.value.push({
    name: "", date: "", photoList: [], authority: "", number: "", listenerId: null
  });
};
const addEducationListsHandler = () => {
  educationLists.value.push({
    startTime: null, endTime: null, schoolName: null, idNumber: null,
    photoList: [], code: null, degree: null
  });
};
const addTrainListsHandler = () => {
  trainLists.value.push({
    startTime: null, endTime: null, schoolName: null, idNumber: null,
    photoList: [], code: null, career: ''
  });
};
const removeCertificateListHandler = (index) => {
  certificateLists.value.splice(index, 1);
};
const removeEducationListsHandler = (index) => {
  educationLists.value.splice(index, 1);
};
const removeTrainListsHandler = (index) => {
  trainLists.value.splice(index, 1);
};

// 10. 提交与数据刷新
const emit = defineEmits(["commited"]);
const props = defineProps({
  consultantType: Number,
  modelValue: Object,
});

const refreshData = () => {
  // 资质列表
  if (props.modelValue?.certificateList?.length) {
    certificateLists.value = props.modelValue.certificateList.map(e => ({
      ...e, photoList: parseStrToImgArr(e.photos), selectIndex: -1, qualificationValue: ''
    }));
  } else {
    certificateLists.value = [{ name: null, date: null, photoList: [], authority: null, number: null, listenerId: null }];
  }
  // 教育背景
  if (props.modelValue?.educationList?.length) {
    educationLists.value = props.modelValue.educationList.map(e => ({
      ...e, photoList: parseStrToImgArr(e.photo)
    }));
  } else {
    educationLists.value = [];
  }
  // 伦理培训
  if (props.modelValue?.careerList?.length) {
    trainLists.value = props.modelValue.careerList.map(e => ({
      ...e, photoList: parseStrToImgArr(e.photos)
    }));
  } else {
    trainLists.value = [];
  }
};

const fromDataCertificate = ref({});
const submit = async () => {
  if (props.consultantType === 1 && certificateLists.value.length === 0) {
    uni.showToast({ title: "请上传至少一张资质证书", icon: "error" });
    return;
  }
  // 处理图片列表转字符串
  certificateLists.value.forEach(e => e.photos = parseImgArrToStr(e.photoList));
  educationLists.value.forEach(e => e.photo = parseImgArrToStr(e.photoList));
  trainLists.value.forEach(e => e.photos = parseImgArrToStr(e.photoList));

  const data = {
    certificateList: certificateLists.value,
    educationList: educationLists.value,
    careerList: trainLists.value,
    consultantType: props.consultantType,
  };
  fromDataCertificate.value = data;
  try {
    const res = props.consultantType === 1 
      ? await registerConsultantStep3({ ...props.modelValue, ...data }) 
      : await registerListenerStep3({ ...props.modelValue, ...data });
    if (res.code == 0) {
      uni.showToast({ title: "提交成功" });
      emit("commited", "");
    }
  } catch (err) {
    console.error("提交失败：", err);
    uni.showToast({ title: "提交失败", icon: "error" });
  }
};

// 11. 生命周期
onMounted(() => {
  refreshData();
  getQualificationApi();
});
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