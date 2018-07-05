//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    inmoney: 1000.00,
    cost: 1200.00,
    little: -200.00,
    row1: "",
    row2: 380,
    row3: 95,
    begin: true,
    end: false,
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  toFirst: function() {
    wx.navigateTo({
      url: '../firstout/firstout',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  voicebegin: function() {
    this.setData({
      begin: false,
      end: true
    })
    var s = this;
    console.log("start");
    wx.startRecord({
      success: function(res) {
        console.log(res);
        var tempFilePath = res.tempFilePath;
        s.setData({
          recodePath: tempFilePath,
          isRecode: true
        });
      },
      fail: function(res) {
        console.log("fail");
        console.log(res);
        //录音失败
      }
    });
  },
  totextpage:function(){
    wx.navigateTo({
      url: '../textPage/textPage',
    })
  },

  voiceend: function() { //结束录音 
    this.setData({
      begin: true,
      end: false
    })
    var s = this;
    console.log("end");
    wx.stopRecord();
    s.setData({
      isRecode: false
    });
    wx.showToast();
    setTimeout(function() {
      // var urls = app.globalData.urls + "/Web/UpVoice";
      console.log(s.data.recodePath);
      wx.uploadFile({
        url: urls,
        filePath: s.data.recodePath,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        success: function(res) {
          var str = res.data;
          var data = JSON.parse(str);
          if (data.states == 1) {
            var cEditData = s.data.editData;
            cEditData.recodeIdentity = data.identitys;
            s.setData({
              editData: cEditData
            });
          } else {
            wx.showModal({
              title: '提示',
              content: data.message,
              showCancel: false,
              success: function(res) {

              }
            });
          }
          wx.hideToast();
        },
        fail: function(res) {
          console.log(res);
          wx.showModal({
            title: '提示',
            content: "网络请求失败，请确保网络是否正常",
            showCancel: false,
            success: function(res) {

            }
          });
          wx.hideToast();
        }
      });
    }, 1000)

  },
  onLoad: function() {
    var row = this.data.row2 - this.data.row3;
    this.setData({
      row1: row
    })
    console.log(this.data.row1)
  }
})