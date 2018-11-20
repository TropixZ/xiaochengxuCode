var postsData = require('../../../data/posts-data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取数据
    var postId=options.id;
    var postData = postsData.postList[postId];
    this.setData({
      postData:postData,
      currentPostId:postId
    })
    //获取缓存
    var postsCollected = wx.getStorageSync('postsCollected')
    if (postsCollected) {
      var postsCollected = postsCollected[postId];
      this.setData({
        collected: postsCollected
      })
    }else{
      var postsCollected={}
      postsCollected[postId]=false
      wx.setStorageSync('postsCollected', postsCollected)
    }
  },

  //点击是否收藏
  onCollectionTap:function(event){
    var postsCollected = wx.getStorageSync("postsCollected");
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected=!postCollected;
    postsCollected[this.data.currentPostId]=postCollected;
    this.showToast(postCollected, postsCollected);
  },

  //弹出选择框
  showModal: function (postCollected, postsCollected){
    var that=this;
    wx.showModal({
      content: postCollected?'是否收藏':'是否取消',
      success:function(res){
        if(res.confirm){
          wx.setStorageSync("postsCollected", postsCollected);
          that.setData({
            collected: postCollected
          })
          that.showToast(postCollected, postsCollected);
        }
        
      }
    })
  },
  //弹出toast层
  showToast: function (postCollected, postsCollected){
    wx.showToast({
      title: postCollected?'收藏成功':'取消成功',
      duration:800,
    })
    wx.setStorageSync("postsCollected", postsCollected);
    this.setData({
      collected: postCollected
    })
  },
  //分享按钮
  onShareTap:function(event){
    var itemList= [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList:itemList,
      itemColor:"#405f80",
      success:function(res){
        //res.canal用户是不是点击了取消
        //res.tapIndex 数组元素的序号 从0开始
        wx.showModal({
          title: itemList[res.tapIndex],
        })
      }
    })
  }
  


})