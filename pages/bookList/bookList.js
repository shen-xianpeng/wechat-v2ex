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
    toView: "scrollmenu",
    subMenuDisplay: initSubMenuDisplay(),
    title: '最新话题',
    latest: [],
    datalist: [],
    menuClass: "",
    hidden: false,
    scrollTop: 0,
    scrollHeight: 0,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
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
      toView: "item-list",
      menuClass: "sticked",

    });
    this.data.lastScrollTop = temp;
  
    this.onPullDownRefresh();
    // 隐藏所有一级菜单
    this.setData({
      subMenuDisplay: initSubMenuDisplay()
    });
    // 处理二级菜单，首先获取当前显示的二级菜单标识
    var indexArray = e.currentTarget.dataset.index.split('-');
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
        menuClass: "sticked",

      });
      that.tabLock = false;

    }, 100)
    //确保在界面滚动后执行
 
    // 与一级菜单不同，这里不需要判断当前状态，只需要点击就给class赋予highlight即可
    initSubMenuHighLight[indexArray[0]][indexArray[1]] = 'highlight';
    // 设置为新的数组

  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight*2-120
        });
        that.setData({
          toView: "scrollmenu",
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
    var data = [];
    if (this.data.offset) {
      data = this.data.datalist
      params["offset"] = this.data.offset
    }
    wx.request({
      url: "https://www.xianpeng.org/book_list",
      url: getApp().config.host + "/book_list",      data: params,
      success: function(res) {
     
          var datas = data.concat(res.data.infos);
          that.setData({
            hidden: true,
            datalist: datas,
            loadingBottom: false,
            hasMore: res.data.has_more,
            offset: res.data.offset,
          })
          if (callback) {
            callback();
          }

      }
    })
  },
  onShow: function () {
    if (getApp().globalData.needFresh) {
      getApp().globalData.needFresh=false;
      this.onPullDownRefresh();

    }

  },
 onPullDownRefresh: function () {
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

   that.fetchData(function () {
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