

var markersData = [];
Page({
  data: {
    selectCity: 0,
    selectProvince: 0,
    currentProvince: { name: "" },
    currentCity: { name: "" },
    showAddr: false,
    selectAddr: 0,
    sheng: [],//获取到的所有的省
    allShi: [],//选择的该省的所有市
    shi: [],//选择的该省的所有市
    sheng_index: 0,//picker-view省项选择的value值
    shi_index: 0,//picker-view市项选择的value值
    qu_index: 0,//picker-view区县项选择的value值
    shengshi: null,//取到该数据的所有省市区数据
    jieguo: {},//最后取到的省市区名字
    animationData: {}
  },
  //点击事件，点击弹出选择页
  dianji: function () {
    console.log("dianji....")
    //这里写了一个动画，让其高度变为满屏
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.bottom('0rpx').step()
    this.setData({
      animationData: animation.export()
    })

  },
  //取消按钮
  quxiao: function () {
    //这里也是动画，然其高度变为0
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    console.log("quxiao")
    this.animation = animation
    animation.bottom( '-500rpx').step()
    this.setData({
      animationData: animation.export()
    });
    //取消不传值，这里就把jieguo 的值赋值为{}
    this.setData({
      jieguo: {}
    });
    console.log(this.data.jieguo);
  },
  //确认按钮
  queren: function () {
    var that = this;
    //一样是动画，级联选择页消失，效果和取消一样
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.bottom('-500rpx').step()
    this.setData({
      animationData: animation.export()
    });
    //打印最后选取的结果
    that.getChoosenArea();

    console.log(this.data.jieguo);
  },
  bindChange: function (e) {
    //这里是获取picker-view内的picker-view-column 当前选择的是第几项
    console.log("bindChange", e.detail.value)
    this.setDefaultProvince(e.detail.value[0], e.detail.value[1])

  },
  setDefaultProvince: function(p, c) {
    var that = this;
    var shi = [];
    for (var i = 0; i < that.data.allShi.length; i++) {
      if (that.data.allShi[i].parent_index == p) {
        shi.push(that.data.allShi[i]);
      }
    }
    this.setData({
      selectProvince: p,
      selectCity: c,
      shi: shi
    })
  },
  onLoad: function (e) {
    this.fetchData();
    this.getChoiceList();
  },
  fetchData: function (callback) {
    var that = this;
    console.log("get_addr_list")
    getApp().doRequest({
      // url:  + "/book_list", data: params,
      url: getApp().config.host + "/get_addr_list",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {


        that.setData({
          addrList: res.data.data.infos

        });
      }
    })
  },
  setSelected: function () {
    var that = this;
    if (that.data.selectAddr > 0) {
      for (var i = 0; i < that.data.addrList.length; i++) {
        console.log("setSelected", that.data.selectAddr, that.data.addrList[i].id)
        if (that.data.addrList[i].id == that.data.selectAddr) {
          console.log("setSelected equal")
          that.setData(
            {
              "chooseAddr": that.data.addrList[i]
            }
          )
          return
        }
      }

    }

    that.setData(
      {
        "chooseAddr": {}
      }
    )
  },
  addAddr: function (e) {
    var that = this;
    console.log("get_addr_list")
    var data = {};
    data["name"] = e.detail.value.name;
    data["detail"] = e.detail.value.detail;
    data["phone"] = e.detail.value.phone;

    if (that.data.currentCity.id>0) {
      data["area_id"] = that.data.currentCity.id
    }
    
    var url = getApp().config.host + "/add_addr";
    if (that.data.selectAddr > 0) {
      data["id"] = that.data.selectAddr
      url = getApp().config.host + "/edit_addr";
    }

    getApp().doRequest({
      // url:  + "/book_list", data: params,
      url: url,
      method: "POST",
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
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
        that.fetchData();
        that.toggleModal();
        return


      }
    })
  },
  initSelectIndexFromId: function(pId, cId){
    var that = this;
    var province = {};
    var city = {};
    for (var i = 0; i < that.data.sheng.length; i++) {
      if (that.data.sheng[i].id == pId) {
        province = that.data.sheng[i];
      }
    }
    for (var i = 0; i < that.data.allShi.length; i++) {
      if (that.data.allShi[i].id == cId) {
        city = that.data.allShi[i];
      }
    }

    that.setData(
      {
        "currentProvince": province,
        "currentCity": city,
      }
    )
  },
  delAddr: function (e) {
    var that = this;
    console.log("get_addr_list")
    var data = {};
    if (that.data.selectAddr == 0) {
      wx.showToast({
        title: "请选择地址",
        icon: 'error',
        duration: 1000
      })
      return
    }
    data["id"] = that.data.selectAddr
    getApp().doRequest({
      // url:  + "/book_list", data: params,
      url: getApp().config.host + "/delete_addr",
      method: "POST",
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
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
        that.fetchData();

        that.toggleModal();
        return


      }
    })
  },
  setDefaultAddr: function (e) {
    var that = this;
    var data = {};
    var id = e.currentTarget.dataset.key;
  that.data.selectAddr = id;
    if (id == 0) {
      wx.showToast({
        title: "请选择地址",
        icon: 'error',
        duration: 1000
      })
      return
    }
    data["id"] = id
    getApp().doRequest({
      // url:  + "/book_list", data: params,
      url: getApp().config.host + "/set_default_addr",
      method: "POST",
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
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

        for (var i = 0; i < that.data.addrList.length; i++) {
          if (that.data.addrList[i].id == id) {
            that.data.addrList[i].is_default = 1

          } else {
            that.data.addrList[i].is_default = 0

          }
        }
        that.setData(
          {
            "addrList": that.data.addrList
          }
        )
        var pages = getCurrentPages();
        that.setSelected();
        setTimeout(function(){
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.setData({
            chooseAddr: that.data.chooseAddr
          })
          console.log(that.data.chooseAddr);
        wx.navigateBack();
        }, 500)
        return


      }
    })
  },
  toggleModal: function (e) {
    var that=this;
    console.log(e);
    var addrId = 0
    if (e) {
      if (e.currentTarget.dataset.key > 0) {
        addrId = e.currentTarget.dataset.key;
        var cId = e.currentTarget.dataset.cid;
        var pId = e.currentTarget.dataset.pid;
        that.initSelectIndexFromId(pId, cId)

      }

    }

    this.setData({
      selectAddr: addrId,
      showAddr: !this.data.showAddr
    })


    this.setSelected();
  },
  getChoiceList: function () {
    console.log("getChoiceList")
    var that = this;
    getApp().doRequest({
      url: getApp().config.host + '/get_area_list',
      method: 'GET',
      header: {
      },
      success: function (res) {

        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 10000
          })
          return
        }
        that.setData(
          {
            "sheng": res.data.data.infos[0],
            "allShi": res.data.data.infos[1],
          }
        )


        that.setDefaultProvince(0,0);

      }
    });
  },
  getChoosenArea: function() {
    var that = this;
    var province = {};
    var city = {};
    for (var i = 0; i < that.data.sheng.length; i++) {
      if (that.data.sheng[i].index == that.data.selectProvince) {
        province = that.data.sheng[i];
      } 
    }
    for (var i = 0; i < that.data.shi.length; i++) {
      if (that.data.shi[i].index == that.data.selectCity) {
        city = that.data.shi[i];
      }
    }

    that.setData(
      {
        "currentProvince": province,
        "currentCity": city,
      }
    )

  }


})