var app=getApp();
// pages/movies/movies.js
var util=require ("../../utils/stars.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{},
    containerShow:true,
    searchPannelShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheaterUrl = app.globalData.doubanBase+"/v2/movie/in_theaters"+"?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieData(inTheaterUrl,"inTheater","正在热映");
    this.getMovieData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieData(top250Url,"top250","经典之作")
  },
  //取消搜索
  onCancelImageTap:function(){
    this.setData({
      containerShow: true,
      searchPannelShow: false,
      searchResult:{}
    })
  },
  //输入搜索框触发的函数
  onBindChange:function(event){
    var text=event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q="+text;
    this.getMovieData(searchUrl,"searchResult","");
  },

  //跳转到更多页面
  onMoreTap:function(event){
    var category=event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //获取到数据
  getMovieData:function(url,type,categoryTitle){
    var that=this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      success: function (res) {
        that.processDoubandata(res.data, type, categoryTitle)
      },
    })
  },
  //把获取的数据进行处理
  processDoubandata: function (moviesDouban, type, categoryTitle){
    var movies=[];
    var num=0;
    for (var idx in moviesDouban.subjects){
      var subject=moviesDouban.subjects[num++];
      var title=subject.title;
      var starnum = util.converToStarsArray(subject.rating.stars);
      if(title.length>4){
        title=title.substring(0,4)+"...";
      }
      var temp={
        stars:starnum,
        title:title,
        rating: subject.rating,
        coverageUrl:subject.images.large,
        movieId:subject.id
      }
      movies.push(temp)
    }
    var readydata={};
    readydata[type]={
      movies: movies,
      categoryTitle: categoryTitle
    };
    this.setData(readydata)
  },

  //输入框聚集焦点
  onBindFocus:function(event){
      this.setData({
        containerShow: false,
        searchPannelShow: true,
      })
  },
  //页面跳转详细页
  movieDetail:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId,
    })
  }

})