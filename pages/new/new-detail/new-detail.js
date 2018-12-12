var postsData = require('../../../data/posts-data.js')
var app=getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isplayingMusic:false,
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
        collected: postsCollected,
      })
    }else{
      var postsCollected={};
      postsCollected[postId]=false;
      wx.setStorageSync('postsCollected', postsCollected);
    }
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId===postId){
      this.setData({
        isplayingMusic: true,
      })
    }
    this.setMusicMonitor();
  },

  //设置音乐切换页面的播放
  setMusicMonitor:function(){
    //监听音乐播放与暂停
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isplayingMusic: true,
      }),
      app.globalData.g_isPlayingMusic=true;
      app.globalData.g_currentMusicPostId=that.data.currentPostId;
    }),

    wx.onBackgroundAudioPause(function () {
      that.setData({
        isplayingMusic: false,
      })
      app.globalData.g_isPlayingMusic=false;
      app.globalData.g_currentMusicPostId=null;
    })
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
    ];
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
  },
  //播放音乐
  onMusictap:function(){
    var currentPostId = this.data.currentPostId;
    var postData=postsData.postList[currentPostId];
    var isplayingMusic=this.data.isplayingMusic;
    //判断是否播放
    if (isplayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({
        isplayingMusic:false,
      })
    }else{
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
        })
      this.setData({
        isplayingMusic: true,
      })
    }
  }


})