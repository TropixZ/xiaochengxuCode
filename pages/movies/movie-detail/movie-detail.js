var app=getApp();
var util = require("../../../utils/stars.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieid=options.id;
    var url = app.globalData.doubanBase+"/v2/movie/subject/"+movieid;

    util.http(url, this.processDoubandata);
  },

  processDoubandata:function(data){
    console.log(data)
    var director={
      avatar:"",
      name:"",
      id:"",
    };
    if(data.directors[0]!=null){
    if (data.directors[0].avatars != null){
      director.avatar =data.directors[0].avatars.large
    }
      director.name = data.directors[0].name
      director.id = data.directors[0].id
    }
    var movie={
      movieImg:data.images?data.images.large:"",
      country: data.countries[0],
      title:data.title,
      originaltitle: data.original_title,
      summary: data.summary,
      year:data.year,
      genres:data.genres.join(","),
      stars: util.converToStarsArray(data.rating.stars),
      director: director,
      casts: util.converToCastString(data.casts),
      castsInfo: util.converToCastInfos(data.casts),
      score:data.rating.average,
    }
    this.setData({
      movie:movie
    })
  }
})