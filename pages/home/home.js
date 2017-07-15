// detail.js
var Util = require('../../utils/util.js');
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '我的',
    user: {},
    logged: false
  },
  onMySold: function () {
    var url = '../mySold/mySold';

    wx.navigateTo({
      url: url
    })
  },
  onMyBought: function () {
    var url = '../myBought/myBought';

    wx.navigateTo({
      url: url
    })
  },
  onMyPublish: function () {
    var url = '../myPublish/myPublish';

    wx.navigateTo({
      url: url
    })
  },
  fetchDetail: function(id) {
   
  },
  touchStartElement: function (e) {
    console.log("start", e);
    var id = e.currentTarget.id;
    this.setData({
      activeHoverIndex: id

    })
  },
  touchEndElement: function (e) {
    console.log("end", e);

    var that = this;
    setTimeout(function () {
      that.setData({
        //warnning undefined==""=="0"==0
        activeHoverIndex: "none"

      })
    }, 500)

  },
  touchMoveElement: function (e) {
    console.log("move", e);

    this.setData({
      activeHoverIndex: "none"

    })
  },
  popLogin: function (e) {
    var that = this;

    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          var jscode = res.code
          console.log("start....")
          wx.getUserInfo({
            withCredentials: true,
            fail: function(res) {
                console.log(res);
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
              var l = getApp().config.host +'/jscode_to_secrets';
              wx.request({
                url: l,
                data: params,
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
                // header: {}, // 设置请求的 header    
                success: function (res) {
                  console.log("jscode_to_secrets....")
                  console.log(res);
                  var obj = {};
                  that.setData({
                    user: res.data.data
                  })
                  obj.openid = res.data.openid;
                  obj.expires_in = Date.now() + res.data.expires_in;
                  //console.log(obj);  
                  wx.setStorageSync('user', res.data.data);//存储openid    
                }
              });
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }    });
  },
  onLoad: function (options) {
    var gUser = getApp().globalData.userInfo
    if (gUser.id>0) {
      this.setData({
        user: gUser
      })

    } else {
      this.popLogin()
    }
  
  },
  onMyAccount: function () {
    var url = '../myAccount/myAccount';

    wx.navigateTo({
      url: url
    })
  }
})
