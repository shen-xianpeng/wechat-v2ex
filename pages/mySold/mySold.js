
Page({
  data: {
    tabs: ["全部", "待交货", "已交货", "已完成", "已取消"],
    activeIndex: 0,
    sliderWidth: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    dataSet: {
      0: { offset: "", infos: [] },
      1: { offset: "", infos: [] },
      2: { offset: "", infos: [] },
      3: { offset: "", infos: [] },
      4: { offset: "", infos: [] },
    }
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var sliderWidth = res.windowWidth / that.data.tabs.length - 30;
        that.setData({
          sliderWidth: sliderWidth,
          scrollHeight: res.windowHeight * 2 - 220,

          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
        that.fetchData(0);
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.fetchData(e.currentTarget.id)
  },
  goOrderDetail: function (e) {
    var order_no = e.currentTarget.dataset.order;

    var url = '../orderDetail/orderDetail?order_no=' + order_no;

    wx.navigateTo({
      url: url
    })
  },
  // 事件处理函数
  goBookDetail: function (e) {
    var id = e.currentTarget.id;
    console.log(id);
    var url = '../bookDetail/bookDetail?id=' + id;

    wx.navigateTo({
      url: url
    })
  },
  onCancel: function (e) {
    var that = this;
    var order_no = e.currentTarget.dataset.order;
    console.log(order_no);

    var params = {}
    params["order_no"] = order_no
    wx.request({
      method: 'POST',
      url: getApp().config.host + "/cancel_order_after_pay",
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
          return
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 1000
        })
        that.fetchData(that.data.activeIndex);

      }
    });

  },
  onConfirmDelivery: function (e) {
    var that = this;
    var order_no = e.currentTarget.dataset.order;
    console.log(order_no);

    var params = {}
    params["order_no"] = order_no
    wx.request({
      method: 'POST',
      url: getApp().config.host + "/confirm_delivery",
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
          return
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 1000
        })
        that.fetchData(that.data.activeIndex);

      }
    });

  },
  fetchData: function (tab, callback) {
    var that = this;
    var params = {};
    var data = [];
    var current_data = this.data.dataSet[tab]
    if (current_data.offset) {
      data = current_data.infos
      params["offset"] = current_data.offset
    }
    params["cat"] = that.data.activeIndex
    wx.request({
      url: getApp().config.host + "/my_sold_list",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      data: params,
      success: function (res) {

        var datas = data.concat(res.data.data.infos);
        console.log(res, tab)
        if (tab == 0) {
          that.setData({
            hidden: true,
            'dataSet.0.infos': datas,
            'dataSet.0.offset': res.data.data.offset,
            'dataSet.0.hasMore': res.data.data.has_more,
            loadingBottom: false,
          })
        }
        if (tab == 1) {
          that.setData({
            hidden: true,
            'dataSet.1.infos': datas,
            loadingBottom: false,
            'dataSet.1.hasMore': res.data.data.has_more,
            'dataSet.1.offset': res.data.data.offset,
          })
        }
        if (tab == 2) {
          that.setData({
            hidden: true,
            'dataSet.2.infos': datas,
            loadingBottom: false,
            'dataSet.2.hasMore': res.data.data.has_more,
            'dataSet.2.offset': res.data.data.offset,
          })
        }
        if (tab == 3) {
          that.setData({
            hidden: true,
            'dataSet.3.infos': datas,
            loadingBottom: false,
            'dataSet.3.hasMore': res.data.data.has_more,
            'dataSet.3.offset': res.data.data.offset,
          })
        }
        if (tab == 4) {
          that.setData({
            hidden: true,
            'dataSet.4.infos': datas,
            loadingBottom: false,
            'dataSet.4.hasMore': res.data.data.has_more,
            'dataSet.4.offset': res.data.data.offset,
          })
        }

        if (callback) {
          callback();
        }

      }
    })
  },
  scroll: function (e) {
    //必须先临时变量 不然滑动式 这里会并发 没发固定顺序
    console.log("scroll", e.detail.scrollHeight, e.detail.scrollTop)
      if (e.detail.scrollHeight - e.detail.scrollTop < 1000) {
        if (this.data.loadingBottom==true) {
          console.log("isloading.....")
          return;
        }
        this.setData({
          loadingBottom: true,
        })
        this.fetchData(this.data.activeIndex);
      }
 


  },
  goChooseBookList: function (e) {
    var bookIds = e.currentTarget.dataset.books;
    var url = '../chooseBookList/chooseBookList?user_book_ids=' + bookIds;

    wx.navigateTo({
      url: url
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
  }
});