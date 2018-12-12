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

module.exports = {
  converToStarsArray: converToStarsArray,
  http:http
}