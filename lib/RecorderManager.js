
// #ifdef H5
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';

// import Recorder from './recorder.mp3.min.js';
// #endif

export default class RecorderManager {
    recorder = null;
    //录音开始时间
    uniStartTime = null;
    //语音录音中
    recording = false;
    onRecordingComplete = null;

    constructor() {
        // #ifdef H5
        this.recorder = Recorder({
            type : 'mp3',
            sampleRate:16000,//录音的采样率，越大细节越丰富越细腻
            bitRate:16,//录音的比特率，越大音质越好
            onProcess : function () {}
        });
        // #endif

        // #ifndef H5
        this.recorder = uni.getRecorderManager();
        // #endif
    }

    onRecordComplete(callBack) {
      this.onRecordingComplete = callBack;
      // #ifndef H5
      this.initUniRecorder();
      // #endif
    }

    initUniRecorder() {
        //录音结束后，发送
        this.recorder.onStop((res) => {
            const duration = Date.now() - this.uniStartTime;
            res.duration = duration;
            this.onRecordingComplete(res, duration);
        });
    }

    authorize() {
        return new Promise((resolve,reject) => {
            // #ifdef H5
            this.recorder.open(() => {
                resolve();
            }, (e) => {
                this.recorder.close();
                reject(e);
            });
            // #endif

            // #ifdef APP
            if (plus.os.name === "iOS") {
              var avaudiosession = plus.ios.import("AVAudioSession");
              var avaudio = avaudiosession.sharedInstance();
              var permissionStatus = avaudio.recordPermission();
              if (permissionStatus === 1684369017 || permissionStatus === 1970168948) {
                console.log("麦克风权限没有开启");
              }
              plus.ios.deleteObject(avaudiosession);
              resolve()
            } else {
              plus.android.requestPermissions(
                ['android.permission.RECORD_AUDIO'],
                (resultObj) => {
                  resultObj.granted.length ? resolve() : reject("已拒绝");
                },
                (error) => {
                  console.error(`申请权限错误：${error.code} = ${error.message}`);
                  reject();
                }
              );
            }
            // #endif

            // #ifdef MP
            if (uni.authorize) {
                uni.authorize({
                    scope: 'scope.record',
                    success() {
                        resolve()
                    },
                    fail: (e) => {
                        reject(e)
                    }
                });
            }
            // #endif
        });
    }

    start() {
        this.recording = true;

        // #ifdef H5
        this.recorder.start();
        // #endif

        // #ifndef H5
        try {
            // 更多配置参考uniapp：https://uniapp.dcloud.net.cn/api/media/record-manager.html#getrecordermanager
            this.recorder.start({
                duration: 600000 // 指定录音的时长,单位 ms
            });
            this.uniStartTime = Date.now();
        } catch (e) {
            console.log(e);
        }
        // #endif
    }

    stop() {
        this.recording = false;

        // #ifdef H5
        this.recorder.stop((blob, duration) => {
            const file = new File([blob], 'audio.mp3', {type: blob.type});
            file.tempFilePath = URL.createObjectURL(blob);
            file.duration = duration;
            this.onRecordingComplete(file, duration);
        }, (msg) => {
            console.log('录音失败：',msg)
        })
        // #endif

        // #ifndef H5
        try {
            this.recorder.stop();
        } catch (e) {
            console.log(e);
        }
        // #endif
    }

}
