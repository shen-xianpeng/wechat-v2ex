// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '最新话题',
    latest: [],
    datalist: [],
    hidden: false,
    scrollTop: 0,
    scrollHeight: 0,
  },
  onLoad: function () {
    var that = this;
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
  redictDetail: function(e) {
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
      
    wx.navigateTo({
      url: url
    })
  },
  fetchData: function(callback) {
    var that = this;
    var params = {};
    var data = [];
    if (this.data.offset) {
      data = this.data.datalist
      params["offset"] = this.data.offset
    }
    wx.request({
      url: "http://118.184.11.37:10000/book_list",
      data: params,
      success: function(res) {
          if (callback) {
            callback();
          }
          var datas = data.concat(res.data.infos);
          that.setData({
            hidden: true,
            datalist: datas,
            loadingBottom: false,
            hasMore: res.data.has_more,
            offset: res.data.offset,
          })


      }
    })
  },
 onPullDownRefresh: function () {
   console.log("下拉刷新");
   var that=this;

   that.setData({
     hidden: true,
     hasMore: undefined,
     offset: undefined,
     //datalist: []
   })
   wx.showToast({
     title: '加载中...',
     icon: 'loading'
   })
   that.fetchData(function () {
     that.stopPullDownRefresh();
   })
  
  },
  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
        console.log(res, new Date())
      }
    })
  },
  onReachBottom: function () {
    console.log("上拉加载更多...");
    if (this.data.hasMore==false) {
      console.log("没有更多了")
      return
    }
    this.setData({
      loadingBottom: true,
    })
    this.fetchData();
  },
  onShareAppMessage: function () {
    return {
      title: '换书',
      path: '/pages/bookList/bookList',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})