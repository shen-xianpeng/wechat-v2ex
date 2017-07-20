var amapFile = require('../../libs/amap-wx.js');
var lonlat;
var city;
Page({
  data: {
    tips: {}
  },
  onLoad: function(e){
    lonlat = e.lonlat;
    city = e.city;
  },
  bindInput: function(e){
    var that = this;
    var keywords = e.detail.value; 
    var key = getApp().config.amapKey;
    var myAmapFun = new amapFile.AMapWX({key: key});
    myAmapFun.getInputtips({
      keywords: keywords,
      location: lonlat,
      city: city,
      success: function(data){
        if(data && data.tips){
          that.setData({
            tips: data.tips
          });
        }
      }
    })
  },
  bindSearch: function(e){
    var keywords = e.target.dataset.keywords;
    var url = '../amap/amap?keywords=' + keywords;
    wx.redirectTo({
      url: url
    })
  }
})