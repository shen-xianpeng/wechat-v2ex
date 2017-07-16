
Page({
    data: {
      tabs: ["书币", "余额"],
      tabCat: ["coin", "balance"],
        activeIndex: 0,
        sliderWidth: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        dataSet: {
          0: { offset: "", infos: [] },
          1: { offset: "", infos: [] },
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
      var account_type = this.data.tabCat[tab||0];
      params["account_type"] = account_type;
      wx.request({
        url: getApp().config.host + "/account_log_list",
        data: params,
        method: "GET",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": getApp().globalData.userInfo.token
        },
        success: function (res) {

      

          var datas = data.concat(res.data.data.infos);
          console.log(res, tab)
          that.setData({
                coin: res.data.data.coin,
                balance: res.data.data.balance,
          })
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
         
          if (callback) {
            callback();
          }

        }
      })
    },
});