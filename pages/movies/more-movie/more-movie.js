var app = getApp();
var util = require("../../../utils/stars.js");
// pages/movies/more-movie/more-movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarTitleText: "",
    totalCount:0,
    isEmpty:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    this.data.navigationBarTitleText = category;
    var dataurl;
    switch (category) {
      case "正在热映":
        dataurl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataurl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "经典之作":
        dataurl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl=dataurl;
    util.http(dataurl, this.processDoubandata);
  },
  //下拉刷新
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl +"?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubandata);
    wx.showNavigationBarLoading();
  },
  //数据进行处理
  processDoubandata: function (moviesDouban) {

    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      var starnum = util.converToStarsArray(subject.rating.stars);
      if (title.length > 4) {
        title = title.substring(0, 4) + "...";
      }
      var temp = {
        stars: starnum,
        title: title,
        rating: subject.rating,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var totalMovies={}

    //实现动态加载数据
    //如果要绑定新加载的数据，那么需要同旧数据合并在一起
    if(!this.data.isEmpty){
      totalMovies=this.data.movies.concat(movies)
    }else{
      totalMovies = movies;
      this.data.isEmpty=false
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigationBarTitleText
    })
  },
})