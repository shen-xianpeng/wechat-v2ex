
Page({
    data: {
        tabs: ["书币", "余额"],
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
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
              var sliderWidth = res.windowWidth / that.data.tabs.length - 30;
                that.setData({
                  sliderWidth: sliderWidth,
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
  fetchData: function (tab, callback) {
      var that = this;
      var params = {};
      var data = [];
      var current_data = this.data.dataSet[tab]
      if (current_data.offset) {
        data = current_data.infos
        params["offset"] = current_data.offset
      }
      wx.request({
        url: getApp().config.host + "/book_list",
        data: params,
        success: function (res) {

          var datas = data.concat(res.data.infos);
          if (tab==0) {
            that.setData({
              hidden: true,
              'dataSet.0.infos': datas,
              loadingBottom: false,
              hasMore: res.data.has_more,
              offset: res.data.offset,
            })
          }
          if (tab == 1) {
            that.setData({
              hidden: true,
              'dataSet.1.infos': datas,
              loadingBottom: false,
              hasMore: res.data.has_more,
              offset: res.data.offset,
            })
          }
          if (tab == 2) {
            that.setData({
              hidden: true,
              'dataSet.2.infos': datas,
              loadingBottom: false,
              hasMore: res.data.has_more,
              offset: res.data.offset,
            })
          }
          if (tab == 3) {
            that.setData({
              hidden: true,
              'dataSet.3.infos': datas,
              loadingBottom: false,
              hasMore: res.data.has_more,
              offset: res.data.offset,
            })
          }
     
          if (callback) {
            callback();
          }

        }
      })
    },
});