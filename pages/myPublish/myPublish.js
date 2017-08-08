
Page({
  data: {
    tabs: ["全部", "在售的", "已下架", "已卖出"],
    activeIndex: 0,
    sliderWidth: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    dataSet: {
      0: { offset: "", infos: [] },
      1: { offset: "", infos: [] },
      2: { offset: "", infos: [] },
      3: { offset: "", infos: [] },
    }
  },
  scroll: function (e) {
    //必须先临时变量 不然滑动式 这里会并发 没发固定顺序
    console.log("scroll", e.detail.scrollHeight, e.detail.scrollTop)
    if (e.detail.scrollHeight - e.detail.scrollTop < 1000) {
      if (this.data.loadingBottom == true) {
        console.log("isloading.....")
        return;
      }
      this.setData({
        loadingBottom: true,
      })
      this.fetchData(this.data.activeIndex);
    }



  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var sliderWidth = res.windowWidth / that.data.tabs.length - 30;
        that.setData({
          sliderWidth: sliderWidth,
          scrollHeight: res.windowHeight,

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
  // 事件处理函数
  goBookDetail: function (e) {
    var id = e.currentTarget.id;
    console.log(id);
    var url = '../bookDetail/bookDetail?id=' + id;

    wx.navigateTo({
      url: url
    })
  },
  onSetStatus: function (e) {
    var that=this;
    var status = e.currentTarget.dataset.status;
    var user_book_id = e.currentTarget.dataset.book;
    console.log(status);

    var params = {}
    params["status"] = status
    params["user_book_id"] = user_book_id
    getApp().doRequest({
      method: 'POST',
      url: getApp().config.host + "/set_book_status",
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
    if (tab>0) {
      params["cat"] = tab

    }

    getApp().doRequest({
      url: getApp().config.host + "/my_book_list",
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
        var datas = data.concat(res.data.data.infos);
        if (tab == 0) {
          that.setData({
            hidden: true,
            'dataSet.0.infos': datas,
            'dataSet.0.offset': res.data.data.offset,
            loadingBottom: false,
            'dataSet.0.hasMore': res.data.data.hasMore,
          })
        }
        if (tab == 1) {
          that.setData({
            hidden: true,
            'dataSet.1.infos': datas,
            'dataSet.1.offset': res.data.data.offset,
            loadingBottom: false,
            'dataSet.1.hasMore': res.data.data.hasMore,
          })
        }
        if (tab == 2) {
          that.setData({
            hidden: true,
            'dataSet.2.infos': datas,
            'dataSet.2.offset': res.data.data.offset,
            loadingBottom: false,
            'dataSet.2.hasMore': res.data.data.hasMore,
          })
        }
        if (tab == 3) {
          that.setData({
            hidden: true,
            'dataSet.3.infos': datas,
            'dataSet.3.offset': res.data.data.offset,
            loadingBottom: false,
            'dataSet.3.hasMore': res.data.data.hasMore,
          })
        }

        if (callback) {
          callback();
        }

      }
    })
  },
});