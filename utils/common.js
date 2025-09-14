export function uploadFile(url, filePath, formData = {}, name = "file") {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url:  url,  // 统一走代理
      filePath: filePath,
      name: name,
      formData: formData,
      header: {
        'token': uni.getStorageSync("token") || "",
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          resolve(data)
        } catch (e) {
          resolve(res.data)
        }
      },
      fail: (err) => reject(err)
    })
  })
}
