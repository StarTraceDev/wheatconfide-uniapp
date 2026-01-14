export const serviceTyep = (type) => {
  const SERVICE_TYEP = {
    1: "语音",
    2: "视频",
    3: "文字",
  }
  return SERVICE_TYEP[type]
};