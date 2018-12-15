function converToStarsArray(starnum){
  //取整数
  var num=(starnum/10).toFixed();
  //var num=starnum.toString().substring(0,1);
  var array=[];

  for(var i=1;i<=5;i++){
    if(i<=num){
      array.push(1)
    }else{
      array.push(0)
    }
  }
  return array;
}

function http(url, processDoubandata) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "application/xml"
    },
    success: function (res) { 
      processDoubandata(res.data);
    },
  })
}

function converToCastString(casts){
  var castsjoin=""

  for(var idx in casts){
    castsjoin=castsjoin+casts[idx].name+" / "
  }
  return castsjoin.substring(0,(castsjoin.length)-2)
}

function converToCastInfos(casts){
  var castsArray=[]

  for(var idx in casts){
    var cast={
      img:casts[idx].avatars?casts[idx].avatars.large:"",
      name:casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  converToStarsArray: converToStarsArray,
  http:http,
  converToCastString: converToCastString,
  converToCastInfos: converToCastInfos
}