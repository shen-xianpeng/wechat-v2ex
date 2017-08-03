// latest.js
var Api = require('../../utils/api.js');
function initSubMenuHighLight() {
  return [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['','','']
  ];
}
function initSubMenuDisplay() {
  return ['hidden', 'hidden', 'hidden'];
}
var initSubMenuHighLight = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '']
];
Page({
  data: {
    lastScrollTop:0,
    currentCatNmae: "全部分类",
    currentSortName: "推荐排序",
    sortList: ["离我最近", "最新发布", "人气最高"],
    mainMenuList: ["全部分类","推荐排序"],
    toView: "scrollmenu",
    subMenuDisplay: initSubMenuDisplay(),
    title: '最新话题',
    latest: [],
    datalist: [],
    menuClass: "",
    hidden: false,
    scrollTop: 0,
    scrollHeight: 0,
    banners: [],
    alarms: [],
    indicatorDots: false,
    autoplay: false,
    activeCat: 0,
    activeSort: 0,
    interval: 5000,
    duration: 1000
  },
  goMap: function(e) {
    var id = e.currentTarget.id;
    console.log(id);
    var url = '../amap/amap?id=' + id;

    wx.navigateTo({
      url: url
    })
  },
  goLogin: function (e) {
 
    var url = '../login/login'  ;

    wx.navigateTo({
      url: url
    })
  },
  goMyAddr: function (e) {
    var id = e.currentTarget.id;
    console.log(id);
    var url = '../myAddr/myAddr?id=' + id;

    wx.navigateTo({
      url: url
    })
  },
  tapMainMenu: function (e) {
    //    获取当前显示的一级菜单标识
    var index = parseInt(e.currentTarget.dataset.index);
    // 生成数组，全为hidden的，只对当前的进行显示
    var newSubMenuDisplay = initSubMenuDisplay();
    //    如果目前是显示则隐藏，反之亦反之。同时要隐藏其他的菜单
    if (this.data.subMenuDisplay[index] == 'hidden') {
      newSubMenuDisplay[index] = 'show';
    } else {
      newSubMenuDisplay[index] = 'hidden';
    }
    // 设置为新的数组
    this.setData({
      subMenuDisplay: newSubMenuDisplay
    });
  },
  tapSubMenu: function (e) {
    this.tabLock = true; //locking时不改变menu 固定样式
    var temp = this.data.lastScrollTop;
    this.setData({
      subMenuHighLight: initSubMenuHighLight,
      // toView: "item-list",
      // menuClass: "sticked",  //数据变少时存在bug

    });
    this.data.lastScrollTop = temp;
    var indexArray = e.currentTarget.dataset.index.split('-');
    if (indexArray[0]==0) {
      this.data.activeCat = indexArray[1];
      if (this.data.activeCat==0) {
        this.data.mainMenuList[0] = "全部分类"

      } else {
        this.data.mainMenuList[0] = this.data.categoryList[this.data.activeCat-1]

      }
      this.setData(
        {
          mainMenuList: this.data.mainMenuList
        }
      )
    } else {
      this.data.activeSort = indexArray[1];
      if (this.data.activeSort == 0) {
        this.data.mainMenuList[1] = "推荐排序"

      } else {
        this.data.mainMenuList[1] = this.data.sortList[this.data.activeSort - 1]

      }
      this.setData(
        {
          mainMenuList: this.data.mainMenuList
        }
      )
    }
    this.onPullDownRefresh();
    // 隐藏所有一级菜单
    this.setData({
      subMenuDisplay: initSubMenuDisplay()
    });
    // 处理二级菜单，首先获取当前显示的二级菜单标识
    // 初始化状态
    // var newSubMenuHighLight = initSubMenuHighLight;
    for (var i = 0; i < initSubMenuHighLight.length; i++) {
      // 如果点中的是一级菜单，则先清空状态，即非高亮模式，然后再高亮点中的二级菜单；如果不是当前菜单，而不理会。经过这样处理就能保留其他菜单的高亮状态
      if (indexArray[0] == i) {
        for (var j = 0; j < initSubMenuHighLight[i].length; j++) {
          // 实现清空
          initSubMenuHighLight[i][j] = '';
        }
        // 将当前菜单的二级菜单设置回去
      }
    }

    var that = this;
    setTimeout(function () {
      that.setData({
        // menuClass: "sticked",

      });
      that.tabLock = false;

    }, 100)
    //确保在界面滚动后执行
 
    // 与一级菜单不同，这里不需要判断当前状态，只需要点击就给class赋予highlight即可
    initSubMenuHighLight[indexArray[0]][indexArray[1]] = 'highlight';
    this.setData({
      subMenuHighLight: initSubMenuHighLight,

    });
    // 设置为新的数组

  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
        that.setData({
          toView: "scrollmenu",
        });
        that.fetchData();

      }
    });
    getApp().getLocation(
      function() {
        that.data.offset="";
        that.fetchData()
      }
    )
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
  fetchData: function( callback) {
    var that = this;
    var params = {};
    var data = [];
    if (this.data.offset) {
      data = this.data.datalist
      params["offset"] = this.data.offset
    }
    var activeSort = this.data.activeSort;
    var activeCat = this.data.activeCat;
    if (activeSort>0) {
      params["sort"] = activeSort
    }
    if (activeCat > 0) {
      params["category_id"] = this.data.categoryIdList[activeCat-1];
    }
    var longitude = getApp().globalData.longitude;
    var latitude = getApp().globalData.latitude;
    if (longitude && latitude) {
      params["lnglat"] = longitude + "," + latitude
    }

    wx.request({
      url: "https://www.xianpeng.org/book_list",
      url: getApp().config.host + "/book_list",      data: params,
      success: function(res) {
          console.log(res);
          var datas = data.concat(res.data.data.infos);
          that.setData({
            hidden: true,
            datalist: datas,
            loadingBottom: false,
            banners: res.data.data.banners,
            alarms: res.data.data.alarms,
            hasMore: res.data.data.has_more,
            offset: res.data.data.offset,
          })
          if (callback) {
            callback();
          }

      }
    })
  },
  onShow: function () {
    var that = this;


    getApp().getChoiceList(function () {
      that.setData({
        categoryList: getApp().getNameList(getApp().globalData.choices.category_list),
        categoryIdList: getApp().getIdList(getApp().globalData.choices.category_list),
      })
    })

    if (getApp().globalData.needFresh) {
      getApp().globalData.needFresh=false;
      this.onPullDownRefresh();

    }

  },
 onPullDownRefresh: function (cat, sort) {
   console.log("下拉刷新");
   var that=this;
   wx.stopPullDownRefresh();

   that.setData({
     hidden: true,
     hasMore: undefined,
     offset: undefined,
     //datalist: []
   })
  wx.showNavigationBarLoading()

   that.fetchData( function () {
     that.stopPullDownRefresh();
   })
  
  },
  stopPullDownRefresh: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh({
      complete: function (res) {

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
  },
  scroll: function (e) {
    //必须先临时变量 不然滑动式 这里会并发 没发固定顺序
    var current = e.detail.scrollTop;
    var last = this.data.lastScrollTop;
    this.data.lastScrollTop = current;

    console.log("lastScrollTop", last, current, this.tabLock)

    if (this.tabLock) {

      return
    }
    if (last>0 && current > last) {
      console.log("scroll down")
      if (current >= 248 ) {
        this.setData({
          menuClass: "sticked",
        })
        console.log("stick.... ", e.detail.scrollTop)

      }
      if (e.detail.scrollHeight - e.detail.scrollTop < 800) {
        this.onReachBottom()
      }
    } else if(current<last) {
      console.log("scroll up")
      if (current <= 248){           this.setData({
          menuClass: "",
        })
      }
    } 
    
 
  },
  bindUpper: function(e) {
 
  },
  swiperchange: function(e) {

  },
  handletouchmove : function(e) {
    console.log(e, "handletouchmove");
  }
})