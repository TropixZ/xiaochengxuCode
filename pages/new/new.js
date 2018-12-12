var postsData=require('../../data/posts-data.js')
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
    this.setData({
      post_key: postsData.postList
    });
  },
  //点击之后跳转
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'new-detail/new-detail?id='+postId,
    })
  },
  
  //点击轮播图后跳转
  onSwiperTap: function (event){
    //target获取的是当前点击的组件 currentTarget指的是事件捕获的组件
    //target这里指的是image currentTarget指的是swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'new-detail/new-detail?id=' + postId,
    })
  },  
  
})
