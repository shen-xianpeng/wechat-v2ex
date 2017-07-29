// topicList.js
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '添加图书',
    book: {},
    degreeList: [],
    addressInfo: {},
    categoryList: [],
    newOldIndex: 0,
    categoryIndex: 0,
    hidden: false,
    addBookToast: {
      hidden: true,
      msg: "",
    },
    book_photos: [
      { id: 1, label: "封面" }, { id: 2, label: "背面" }, { id: 3, label: "更多(可选多张)" }
    ],
    showSuccessModal: false,
    showErrorModal: false,
    errMsg: ""
  },
  goMap: function (e) {
    var id = e.currentTarget.id;
    console.log(id);
    var url = '../amap/amap?id=' + id;

    wx.navigateTo({
      url: url
    })
  },
  // 事件处理函数
  bindOldNewChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      newOldIndex: e.detail.value
    })
  },
  bindCategoryChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      categoryIndex: e.detail.value
    })
  },
  resetForm: function () {
    this.setData({
      form: {},
      book: {},
      book_photos: [
        { id: 1, label: "封面" }, { id: 2, label: "背面" }, { id: 3, label: "更多(可选多张)" }]
    });
  },
  showToast: function (msg) {
    var that = this;
    that.setData({
      "addBookToast.msg": msg,
      "addBookToast.hidden": false,
    })
    setTimeout((function callback() {
      that.setData({ "addBookToast.hidden": true });
    }).bind(that), 1000);
  },
  checkImages: function () {
    for (var i = 0; i < this.data.book_photos.length; i++) {
      var p = this.data.book_photos[i];
      if (p.path && p.path.length > 0) {
        if (p.src.length > 0 == false) {
          return false
        }
      }
    }

    return true
  },
  getImages: function () {
    var imageList = [];
    for (var i = 0; i < this.data.book_photos.length; i++) {
      var p = this.data.book_photos[i];
      if (p.path && p.path.length > 0) {
        if (p.src.length > 0 == false) {
          return ""
        }
        imageList.push(p.src);
      }
    }
    return imageList.join(",")
  },
  onAddUserBook: function (e) {
    var that = this;
    var data = {}
    if (that.data.book.id > 0) {
      data["book_id"] = that.data.book.id
    }

    data["title"] = e.detail.value.bookTitle;
    data["author"] = e.detail.value.bookAuthor;
    data["publisher"] = e.detail.value.bookPublisher;
    data["summary"] = e.detail.value.bookSummary || "";
    data["price"] = e.detail.value.bookPrice || 0;
    data["express_fee"] = e.detail.value.bookExpress || 0;
    data["old_degree_id"] = that.data.degreeIdList[e.detail.value.oldDegree || 0];
    data["category_id"] = that.data.categoryIdList[e.detail.value.category || 0];
    data["description"] = e.detail.value.bookDescription || "";
    data["location"] = e.detail.value.bookLocation || "";
    data["address"] = that.data.addressInfo.address || "";
    data["lnglat"] = that.data.addressInfo.lnglat || "";
    data["adcode"] = that.data.addressInfo.adcode || "";
    data["address_name"] = that.data.addressInfo.name || "";

    console.log(e.detail.value.oldDegree);
    console.log(that.data.categoryList[e.detail.value.category])
    console.log(that.data.degreeList[e.detail.value.oldDegree])
    console.log(data);
    if (that.checkImages() == false) {
      that.showToast("图片上传中...")
      return
    }
    if (!(that.data.book_photos[0].src && that.data.book_photos[0].src.length > 0)) {
      that.showToast("请上传封面")
      return
    }
    if (!(that.data.book_photos[1].src && that.data.book_photos[1].src.length > 0)) {
      that.showToast("请上传背面")
      return
    }
    data["images"] = that.getImages();
    wx.request({
      url: getApp().config.host + '/add_book',
      data: data,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {
        console.log(res, "ssssuccess");
        // if (res.data.code && res.data.code > 0) {
        //   console.log(res.data.msg);
        //   that.setData({
        //     showErrorModal: true,
        //     errMsg: res.data.msg
        //   })
        //   return;
        // }
        if (res.data.code && res.data.code > 0) {
          that.showToast(res.data.msg)
          return
        }
        that.book_id = res.data.data.id;
        getApp().globalData.needFresh = true;
        that.resetForm();


        wx.navigateTo({
          url: '/pages/addSuccess/addSuccess?book_id=' + that.book_id
        })

        
        // that.setData({
        //   showSuccessModal: true
        // })

      },
      fail: function (res) {
        that.setData({
          showErrorModal: true
        })
        console.log(res);
      }

    })
  },
  onTabAdd: function (e) {
    var that = this;

    wx.scanCode({
      success: (res) => {
        console.log(res);
        if (res.result.length == "") {
          alter("获取不到图书信息，请手动添加");
          return
        }
        console.log(res.result);
        console.log(res.scanType);
        var bookIsbn = res.result;
        var params = {};
        params["barcode"] = bookIsbn;
        params["code_type"] = res.scanType;
        console.log("start")
        wx.request({
          url: getApp().config.host + '/add_book_by_barcode',
          data: params,
          method: 'GET',
          success: function (res) {
            console.log(res);
            if (res.data.code && res.data.code > 0) {
              that.showToast(res.data.msg)
              return
            }
            // if (res.data.code && res.data.code > 0) {
            //   console.log(res.data.msg);
            //   that.setData({
            //     showErrorModal: true,
            //     errMsg: res.data.msg
            //   })
            //   return;
            // }
            res.data.authors = res.data.author
            that.setData({
              book: res.data
            })
            // that.book_id = res.data.id;
            // that.setData({
            //   showSuccessModal: true
            // })

          },
          fail: function (res) {
            that.setData({
              showErrorModal: true
            })
            console.log(res);
          }

        })
      }
    })
  },
  resetImage: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.id);
    var data = that.data.book_photos;
    data[e.currentTarget.dataset.id - 1].src = "";
    data[e.currentTarget.dataset.id - 1].path = "";
    that.setData({
      book_photos: data
    })

  },
  chooseImages: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.id);
    var count = 9;
    if (e.currentTarget.dataset.id < 3) {
      count = 1;
    } else {
      count = 9 + 1 - e.currentTarget.dataset.id;
    }
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        that.setData({
          image_list: tempFilePaths
        });
        for (var i = 0; i < tempFilePaths.length; i++) {
          console.log("start....", tempFilePaths[i], e.currentTarget.dataset.id + i)
          var tmpData = that.data.book_photos;
          if (tmpData.length < e.currentTarget.dataset.id + i) {
            tmpData.push({
              id: e.currentTarget.dataset.id + i
            })
          }

          tmpData[e.currentTarget.dataset.id + i - 1].path = tempFilePaths[i];
          that.setData({ book_photos: tmpData });
          function as(tmpI) {
            console.log("upload....", tmpI)
            wx.uploadFile({
              url: getApp().config.host + '/upload_file', //仅为示例，非真实的接口地址
              filePath: tempFilePaths[tmpI],
              name: 'file',
              formData: {
              },
              success: function (res) {
                console.log(res)
                var data = res.data
                var tmpData = that.data.book_photos;
                console.log("set", e.currentTarget.dataset.id + tmpI - 1, tmpData.length, tmpI)
                tmpData[e.currentTarget.dataset.id + tmpI - 1].src = data;
                that.setData({ book_photos: tmpData });
              },
              fail: function (e) {
                console.log(e);
              },
              complete: function () {
                console.log("complete");
              }
            })
          };
          as(i)
        }
        var tmpData = that.data.book_photos;

        if (e.currentTarget.dataset.id > 2 && tmpData.length < 9) {
          tmpData.push({
            id: tmpData.length + 1
          })
        }
        that.setData({ book_photos: tmpData });


      }
    })
  },
  fetchData: function (id) {

  },
  onCancelModal: function () {
    this.setData({
      showSuccessModal: false
    })
  },
  onConfirmModal: function () {
    this.setData({
      showSuccessModal: false
    })
    var url = '../bookDetail/bookDetail?id=' + this.book_id;

    wx.navigateTo({
      url: url
    })
    return
    this.setData({
      showSuccessModal: false
    })
    wx.switchTab({
      url: '../bookList/bookList',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  onErrorConfirmModal: function () {
    this.setData({
      showErrorModal: false
    })
  },
  onShow: function () {
    this.setData({
      categoryList: getApp().getNameList(getApp().globalData.choices.category_list),
      categoryIdList: getApp().getIdList(getApp().globalData.choices.category_list),
      degreeList: getApp().getNameList(getApp().globalData.choices.old_degree_list),
      degreeIdList: getApp().getIdList(getApp().globalData.choices.old_degree_list)
    })

  },
  onLoad: function (options) {
    this.fetchData(options.id);
    // wx.showActionSheet({
    //   itemList: ['A', 'B', 'C'],
    //   success: function(res) {
    //     console.log(res.tapIndex)
    //   },
    //   fail: function(res) {
    //     console.log(res.errMsg)
    //   }
    // })
  }
})
