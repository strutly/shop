var that;
import Api from '../../config/api';
import WxValidate from '../../utils/WxValidate';
import CustomPage from '../../CustomPage';
CustomPage({

  data: {

  },

  onLoad(options) {
    that = this;
  },

  onReady() {
    Api.getOrderDetail({ id: that.data.options.id }).then(res => {
      console.log(res);
      let order = res.data;
      console.log(order);
      order.des.data.forEach(item => {
        item.rating = 5;
        item.comment = "";
        item.pics = [];
      })
      that.setData({
        order: order
      })
    }, err => {

    })
  },
  inputChange(e) {
    console.log(e);
    let dataset = e.currentTarget.dataset;
    let order = that.data.order;
    order.des.data[dataset.index].comment = e.detail.value;
    that.setData({ order })
  },
  rating(e) {
    console.log(e)
    let dataset = e.currentTarget.dataset;
    let order = that.data.order;
    order.des.data[dataset.index].rating = dataset.rating;
    that.setData({ order })
  },
  addPic(e){
    let index = e.currentTarget.dataset.index;
    let order = that.data.order;
    wx.chooseMedia({
      mediaType:['image'],
      sizeType:['compressed']
    }).then(res=>{
      console.log(res);
      let tempFiles = res.tempFiles;
      Promise.all(tempFiles.map(item=>Api.uploadFile(item.tempFilePath,false))).then(res=>{
        console.log(res);
        let pics = res.map(i=>i.data);
        order.des.data[index].pics = order.des.data[index].pics.concat(pics);
        that.setData({
          order
        });
      },err=>{
        console.log(err);
      })
    },err=>{
      console.log(err)
    })
  },
  remove(e){
    let index = e.currentTarget.dataset.index;
    let order = that.data.order;
    let i = e.currentTarget.dataset.i;
    order.des.data[index].pics.splice(i,1);
    that.setData({
      order
    })
  },
  submit() {
    console.log("评论")
    let order = that.data.order;
    let comments = order.des.data.map(item => {
      return {
        productId: item.id,
        orderId: order.id,
        comment: item.comment,
        rating: item.rating,
        pics:item.pics
      };
    });
    Api.addComment(JSON.stringify(comments)).then(res => {
      that.showTips("评论成功", "success");
      let curPages = getCurrentPages();      
      //上一页面
      let prevPage = curPages[curPages.length - 2];
      // 修改数据
      prevPage.reload();
      wx.navigateBack();
    }, err => {
      that.showTips(err.msg);
    })
  }
})