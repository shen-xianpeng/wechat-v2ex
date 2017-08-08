// detail.js
var Util = require('../../utils/util.js');
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '我的',
    showEdit: false,
    user: {},
    logged: false
  },
  goMyAddr: function (e) {

    var url = '../myAddr/myAddr';

    wx.navigateTo({
      url: url
    })
  },
  goBindPhone:  function(e) {

    var url = '../bind/bind';

    wx.navigateTo({
      url: url
    })
  },
  goLogin: function (e) {

    var url = '../login/login';

    wx.navigateTo({
      url: url
    })
  },
  fetchUserInfo: function () {
    var that = this;
    getApp().doRequest({
      url: getApp().config.host + "/get_user_info",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {
        that.setData({
          user: res.data.data.user,
          addrInfo: res.data.data.addr_info
        })

      }
    })
  },
  uploadAvatar: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        var tempFilePaths = res.tempFilePaths

        wx.uploadFile({
          url: getApp().config.host + '/upload_avatar', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "token": getApp().globalData.userInfo.token
          },
          name: 'file',

          success: function (res) {
            console.log(res)
            res.data = JSON.parse(res.data)

            if (res.data.code != 0) {
              wx.showToast({
                title: res.data.msg,
                icon: 'error',
                duration: 1000
              })
              return
            }
            wx.showToast({
              title: res.data.msg,
              icon: 'error',
              duration: 1000
            })
            that.fetchUserInfo();
            getApp().globalData.needRefreshHome = true;
          },
          fail: function (e) {
            console.log(e);
          },
          complete: function () {
            console.log("complete");
          }
        })

      }

    }
    )
  },
  onTabNickname: function (e) {

    console.log(e);
    var that = this;

    this.setData(
      {
        showEdit: !this.data.showEdit
      }
    )


  },
  bindGenderChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setGender(e.detail.value);
  },
  setGender: function(gender) {
    var that=this;
    var data = {};
    data["gender"] = gender
    getApp().doRequest({
      url: getApp().config.host + '/edit_user_info',
      data: data,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {
        console.log(res, "ssssuccess");
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 1000
          })
          return
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 1000
        })
        that.fetchUserInfo();
        getApp().globalData.needRefreshHome = true;


      }
    })
  },
  confirmEdit: function (e) {
    var that = this;
    var nickname = e.detail.value.nickname;

    var data = {};
    data["nickname"] = nickname
    getApp().doRequest({
      url: getApp().config.host + '/edit_user_info',
      data: data,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {
        console.log(res, "ssssuccess");
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 1000
          })
          return
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 1000
        })
        that.onTabNickname();
        that.fetchUserInfo();
        getApp().globalData.needRefreshHome = true;

      }
    })
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

  onLoad: function (options) {

    this.fetchUserInfo();

  },
  onShow: function () {
    if (this.data.chooseAddr) {
      this.setData(
        {
          addrInfo: this.data.chooseAddr
        }
      )
    }
  },
  onMyAccount: function () {
    var url = '../myAccount/myAccount';

    wx.navigateTo({
      url: url
    })
  }
})
