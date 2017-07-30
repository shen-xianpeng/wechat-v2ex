//app.js
var util = require('/utils/md5.js')    


App({
  MD5: function (password) {
    return util.hexMD5(password); 
  },
  getLocation: function(callback) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        console.log(latitude, longitude)
        that.globalData.latitude = latitude;
        that.globalData.longitude = longitude;

        // wx.openLocation({
        //   latitude: latitude,
        //   longitude: longitude,
        //   scale: 28
        // })
        if (callback) {
          callback();
        }
      }
    })
  },
  onLaunch: function () {
    var that = this;
    this.setUserInfo();
    this.getChoiceList();

    var that = this
    var user = wx.getStorageSync('user') || {};
    this.globalData.openid = wx.getStorageSync('openid') || "";
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((1 || !user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (res) {
          console.log(res);
          if (res.code) {
            var jscode = res.code
            console.log("start....")
            wx.getUserInfo({
              withCredentials: true,
              fail: function (res) {
                that.getOpenid(jscode)

                console.log(res, "fail")
              },
              complete: function (res) {
                console.log(res, "complete")
              },
              success: function (res) {
                var objz = {};
                console.log("sssss....")

                console.log(res); objz.avatarUrl = res.userInfo.avatarUrl;
                objz.nickName = res.userInfo.nickName;
                //console.log(objz);  
                // wx.setStorageSync('userInfo', objz);//存储userInfo  

                var params = {};
                params["code"] = jscode
                params["encrypt"] = res.encryptedData
                params["iv"] = res.iv
                var l = that.config.host + '/jscode_to_secrets';
                wx.request({
                  url: l,
                  data: params,
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
                  // header: {}, // 设置请求的 header    
                  success: function (res) {
                    var obj = {};
                    obj.openid = res.data.openid;
                    obj.expires_in = Date.now() + res.data.expires_in;
                    //console.log(obj);  
                    wx.setStorageSync('user', res.data.data);//存储openid    

                    getApp().globalData.userInfo = res.data.data
                  }
                });
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
    // wx.reLaunch({
    //   url: '/pages/paySuccess/paySuccess?id=1'
    // })
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  getOpenid: function(code) {
    var that=this;
    if (that.globalData.openid) {
      return that.globalData.openid;
    }
    var params = {};
    var l = that.config.host + '/jscode_to_openid'
    params["code"] = code
    wx.request({
      url: l,
      data: params,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
      // header: {}, // 设置请求的 header    
      success: function (res) {
        if (res.data.code==0) {
          that.globalData.openid = res.data.data.openid;
          wx.setStorageSync('openid', res.data.data.openid);//存储openid    

        }
      
        }
    });
  },
  globalData: {
    userInfo: null,
    choices: {},
  },
  config: {
    amapKey: "cbd35e0e051954c68624956df462aceb",
    host: "https://www.shuhuanhuan.com/api",
     //host: "http://127.0.0.1:10001/api",
  },
  setUserInfo: function () {
    var user = wx.getStorageSync('user');
    if (user) {
      this.globalData.userInfo = user;

    }
  },
  getNameList: function (infos) {
    var res = [];
    for (var i = 0; i < infos.length; i++) {
      res.push(infos[i].name);
    }
    return res;
  },
  getIdList: function (infos) {
    var res = [];
    for (var i = 0; i < infos.length; i++) {
      res.push(infos[i].id);
    }
    return res;
  },
  getChoiceList: function (callback) {
    var that = this;

    if (that.globalData.choices.length>0) {
      if (callback) {
        callback();
      }
      return
    }
    console.log("getChoiceList")
    wx.request({
      url: that.config.host + '/get_choice_list',
      method: 'GET',
      header: {
      },
      success: function (res) {
        that.globalData.choices = res.data.data
        if (callback) {
          callback();
        }
      },
      complete: function () {
        if (callback) {
          callback();
        }
      }
    });
  }
})
