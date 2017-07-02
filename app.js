//app.js
App({
  onLaunch: function () {
    this.setUserInfo();
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        console.log(latitude, longitude)
        // wx.openLocation({
        //   latitude: latitude,
        //   longitude: longitude,
        //   scale: 28
        // })
      }
    })
      var that = this  
     var user=wx.getStorageSync('user') || {};    
     var userInfo=wx.getStorageSync('userInfo') || {};   
     if((1 || !user.openid || (user.expires_in || Date.now()) < (Date.now() + 600))&&(!userInfo.nickName)){   
        wx.login({    
        success: function(res){   
            console.log(res);
            if(res.code) {  
                var jscode  = res.code
                console.log("start....")
                wx.getUserInfo({  
                  withCredentials:true,
                    success: function (res) {  
                        var objz={};  
                        console.log("sssss....")

  console.log(res);                          objz.avatarUrl=res.userInfo.avatarUrl;  
                        objz.nickName=res.userInfo.nickName;  
                        //console.log(objz);  
                       // wx.setStorageSync('userInfo', objz);//存储userInfo  

                        var params = {};
                        params["code"] = jscode
                        params["encrypt"] = res.encryptedData
                        params["iv"] = res.iv
                        var l = that.config.host+'/jscode_to_secrets';
                        wx.request({
                          url: l,
                          data: params,
                          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
                          // header: {}, // 设置请求的 header    
                          success: function (res) {
                            var obj = {};
                            obj.openid = res.data.openid;
                            obj.expires_in = Date.now() + res.data.expires_in;
                            //console.log(obj);  
                            wx.setStorageSync('user', res.data.data);//存储openid    
                            
                            getApp().globalData.userInfo = res.data.data
                          }
                        });  
                    }  
                });  
            }else {  
                console.log('获取用户登录态失败！' + res.errMsg)  
            }            
        }    
      });   
    }  
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  globalData:{
    userInfo:null
  },
  config: {
     host:"https://www.xianpeng.org/api",
    //host:"http://127.0.0.1:10001/api",
  },
  setUserInfo: function(){
    var user = wx.getStorageSync('user');   
    if(user) {
      this.globalData.userInfo = user;

    }
  }
})
