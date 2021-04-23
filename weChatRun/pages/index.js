const util = require("../utils/util");
const app = getApp();
var task=app.globalData.task;
var plan=app.globalData.plan;
var arraylist=[];
var lastdatalist={};
Page({
  data: {
    time:"0:00:00",
    meters:"0.00",
    total:10,
    plan:plan,
    finished:0,
    index:0,
    array:[],
    task:task,
    changeview:true,
    changeview1:1,
    minutes:0,
    recentdata:[],
    lastdatalist:{},
    pageNames: [
   {
        id: 'run',
        name: '跑步',
      },
    ],
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [
      {
        "pagePath": "/pages/index",
        "text": "跑步",
        "iconPath": "/resources/paobu.png",
        "selectedIconPath": "/resources/paobu.png"
      },
      {
        "pagePath": "/pages/userinfo/index",
        "text": "个人中心",
        "iconPath": "/resources/yonghu.png",
        "selectedIconPath": "/resources/yonghu.png"
      },
    ]
  },
   attached() {
  },
  changeValue(e) {
    this.setData({
      index: e.detail.value
    })
    var  array = this.data.array;
    //data.index=parseInt(e.detail.value);
    plan=array[e.detail.value].id+1;
    this.setData({
      plan: plan
    })
    app.globalData.plan=plan;
    var  url="run/run";
    wx.navigateTo({url});
    
  },
  changeviewtext:function(){
    var view=this.data.changeview;
    var that=this;
    var lastdatalist=this.data.lastdatalist;
   
      if(view){
          this.setData({
            changeview:false,
          })
      }else{
        this.setData({
          changeview:true,
        })
       
      }
    setTimeout(hide,5000)
    function hide(){
      var view=that.data.changeview;
      if(!view){
        console.log(view);
        that.setData({
          changeview:true
        })
      }
    }
   
  },
  methods: {
    // switchTab(e) {
    //   const data = e.currentTarget.dataset
    //   const url = data.path
    //   //切换tab时，改变路由地址
    //   console.log(url);
    //   wx.switchTab({url})
    //   // wx.navigateTo({
    //   //  url
    //   // })
    //   this.setData({
    //     //切换tab时，改变当前激活的序号，改变tab颜色图标等样式  
    //     selected: data.index
    //   })
    // }

  },
  
  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log(res.target)
  //   }
  //   wx.showShareMenu({
  //     withShareTicket: true,
  //     menus: ['shareAppMessage', 'shareTimeline']
  //   })
  //   var shareObj = {
  //     　　　　title: "即时跑步",   
  //            desc: '即时跑步',     // 默认是小程序的名称(可以写slogan等)
  //     　　　　path: '/pages/index',        // 默认是当前页面，必须是以‘/’开头的完整路径
  //     　　　　imageUrl: '/resources/rundemo.png',    
  //     　　　　success: function(res){
  //     　　　　　　// 转发成功之后的回调
  //     　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
  //     　　　　　　}
  //     　　　　},
  //     　　　　fail: function(){
  //     　　　　　　// 转发失败之后的回调
  //     　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
  //     　　　　　　　　// 用户取消转发
  //     　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
  //     　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
  //     　　　　　　}
  //     　　　　},
  //     　　};


  //   return  shareObj;
  // },
//在上面基础上加
// ﻿onShareTimeline: function () {
//   return {
//       title: '即时跑步',
//       query: {
//         key: '/pages/index'
//       },
//       imageUrl: '/resources/rundemo.png'
//     }
// },

  onLoad: function (options) {
    var that = this;
    for(var i=1;i<21;i++){
      arraylist.push({
        id:i-1,
        name:i+"km"
      })
    }
    this.setData({
      array:arraylist
    })
    var total=(arraylist[this.data.index].id+1)*1000;//按米计算
    var finished=(this.data.task/total)*100;//百分比
    var data={
      total:total,
      num:this.data.task
    }
    this.setData({
      total:total,
      finished:finished
    })
    wx.showShareMenu({
      withShareTicket: true,  
      menus: ['shareAppMessage', 'shareTimeline']
  });
    that.drawCircleBg('canvas',data);
    util.returnTopage();
    //得到最近活动得最后一个
     var  lastdatalist=wx.getStorageSync('datalist');
     lastdatalist=this.getrecentdata(lastdatalist);
     this.setData({
      lastdatalist:lastdatalist
     })
     var changeview1=Object.keys(lastdatalist).length;
     this.setData({
      changeview1:changeview1,
     })
  },
  onShow:function(options){
    var  lastdatalist=wx.getStorageSync('datalist');
     lastdatalist=this.getrecentdata(lastdatalist);
     this.setData({
      lastdatalist:lastdatalist
     })
     var changeview1=Object.keys(lastdatalist).length;
     this.setData({
      changeview1:changeview1,
     })
  },
  //缓存数据格式化
  getrecentdata:function(lastdatalist){
    var  lastdata={}
    if(lastdatalist.length!=0){
      lastdata=lastdatalist.pop();
    //剩余
    var Torunmeters=lastdata.aimmeters-lastdata.finishedmeter;
    //时间
    var time=(new Date()-new Date(lastdata.endTime))/1000;
    lastdata.Torunmeters=Torunmeters;
    var timeString="";
    if(time<60){
      timeString="刚刚";
    }else{
      timeString=Math.floor(time/60)+"min前";
      
    }
    lastdata.timeString=timeString;
  }
  return lastdata;
  },
  //绘制白色圆形背景
  drawCircleBg: function (prefix, data) {
    var that = this;
    //创建并返回绘图上下文context对象。
    let cxt_arc = wx.createCanvasContext(prefix);
    cxt_arc.setLineWidth(4); //线条的宽度
    cxt_arc.setStrokeStyle('#FFFFFF');//边框颜色
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    // 参数分别：圆心的x坐标；圆心的y坐标；圆半径；起始弧度，单位弧度（在3点钟方向）；终止弧度；弧度的方向是否是逆时针
    cxt_arc.arc(82, 55, 55, 0, 2 * Math.PI, false);//创建一条弧线
    cxt_arc.stroke(); //对当前路径进行描边
    cxt_arc.draw();
    this.drawCirclePg(prefix, data);
  },
  //绘制橙色进度条
  drawCirclePg: function (prefix, data) {
    console.log(data);
    var that = this;
    //创建并返回绘图上下文context对象。
    let cxt_arc = wx.createCanvasContext(prefix + '_p');
    var value = (data.num / data.total) * 2;
    console.log(value);
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#FFC000');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(82, 87, 55, -0.6 * Math.PI, Math.PI * (value - 0.6), false);
    cxt_arc.stroke();
    cxt_arc.draw();
  },


});

