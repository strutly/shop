var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({

  /**
   * 页面的初始数据
   */
  data: {
    address: []
  },

  onLoad(options) {
    that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow() {
    Api.getDeliveryAddressList().then(res => {
      that.setData({
        address: res.data
      })
    }, err => {
      that.showTips(err.msg);
    })
  },
  delete(e) {
    that.setData({
      deleteId: e.currentTarget.dataset.id,
      modaldelete: true
    })
  },
  yes(e) {
    Api.deleteDeliveryAddress(JSON.stringify(e.currentTarget.dataset.id)).then(res => {
      console.log(res);
      that.showTips("删除成功", "success");
      that.setData({
        modaldelete: false
      })
      that.onShow();
    }, err => {
      that.showTips(err.msg);
    })
  },
  chooseAddress(e) {
    console.log(e);
    let curPages = getCurrentPages();
    console.log(curPages)
    //当前页
    let address = that.data.address;
    //上一页面
    let prevPage = curPages[curPages.length - 2];    
    // 修改数据
    prevPage.setData({
      address: address[e.currentTarget.dataset.index]
    })
    wx.navigateBack();

  }


})