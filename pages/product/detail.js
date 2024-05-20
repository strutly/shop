var that, IntersectionObserver;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    product:{}
  },
  onLoad(options) {
    that = this;
  },
  onReady() {
    Api.getProductDetail({id:that.options.id}).then(res=>{
      that.setData({
        product:res.data
      })
    },err=>{

    })
  },
  addCart(e){
    let cart = wx.getStorageSync('userCart')||{};
    let dataset = e.currentTarget.dataset;
    if(cart[dataset.id]){
      cart[dataset.id].num+=1;
    }else{
      dataset.num = 1;
      cart[dataset.id] = dataset;
    }
    wx.setStorageSync('userCart', cart);
    wx.showToast({
      title: '购物车添加成功',
      icon:'none'
    })
  }
})