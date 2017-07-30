// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    datalist: [],
    hidden: false,
    scrollTop: 0,
    scrollHeight: 0,
    edit: 0
  },
  onLoad: function (options) {
    var that = this;
    that.data.user_book_ids = options.user_book_ids;
    that.setData({
      edit: options.edit
    })


    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
        that.fetchData();

      }
    });
  },  
  bindDownLoad: function () {
  },
  scroll: function (event) {
  },
  refresh: function (event) {

  },
  removeBook: function(e) {
    var book_id = e.currentTarget.dataset.book;
    var that = this;
    var params = {};
    params["user_book_id"] = book_id
    params["status"] = 0;
    wx.request({
      url: getApp().config.host + "/add_to_cart",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      data: params,
      success: function (res) {

        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 1000
          })
          that.fetchData();
          return
        }
        that.data.user_book_ids = that.data.user_book_ids.replace(book_id + ",", "")
        that.data.user_book_ids = that.data.user_book_ids.replace("," + book_id, "")
        that.data.user_book_ids = that.data.user_book_ids.replace( book_id, "")
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 1000
        })
   
        that.fetchData();
      }
    })
  },
  // 事件处理函数
  goBookDetail: function(e) {
    var id = e.currentTarget.id;
    console.log(id);
    var url = '../bookDetail/bookDetail?id=' + id;
      
    wx.navigateTo({
      url: url
    })
  },
  fetchData: function(callback) {
    var that = this;
    var params = {};
    params["user_book_ids"] = that.data.user_book_ids
    wx.request({
      url: getApp().config.host +"/choose_book_list",
      data: params,
      success: function(res) {
     
          var datas = res.data.data.infos;
          that.setData({
            hidden: true,
            datalist: datas,
            loadingBottom: false,
            hasMore: res.data.data.has_more,
            offset: res.data.data.offset,
          })
          if (callback) {
            callback();
          }

      }
    })
    
  }




})