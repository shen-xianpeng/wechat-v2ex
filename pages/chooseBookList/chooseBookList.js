// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    datalist: [],
    hidden: false,
    scrollTop: 0,
    scrollHeight: 0,
  },
  onLoad: function (options) {
    var that = this;
    that.data.user_book_ids = options.user_book_ids;


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