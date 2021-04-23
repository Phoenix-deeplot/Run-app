//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //设置一个时间函数，过了一天就清零
    var date=new Date();
    var tempdate=wx.getStorageSync('date') || ""
    if(date>tempdate){
      wx.setStorageSync('date', tempdate);
      this.globalData={
        plan:0,
        task:0,
        currenttime:"0:00:00",
        finished:"0.00"
      }//调用全局函数需要在onlaunch里定义value
    }
    
    
  },


  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
    
  }
})