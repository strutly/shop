var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    carts: [],
    checkAll: false,
    sumPrice: 0
  },

  onLoad(options) {
    that = this;
  },
  onReady() {

  },
  onShow() {
    let userCart = wx.getStorageSync('userCart') || {};
    console.log(userCart);
    that.setData({
      carts: userCart
    })
    that.updatePrice();
  },
  updatePrice() {
    let sumPrice = 0;
    let userCart = that.data.carts;
    let checkAll = true;
    Object.values(userCart).forEach((item) => {
      if (item.check) {
        sumPrice += parseInt(item.price) * parseInt(item.num);
      } else {
        checkAll = false;
      }
    });
    that.setData({
      sumPrice: sumPrice,
      checkAll: checkAll,
      length:Object.keys(userCart).length
    })    
    wx.setStorageSync('userCart', userCart);
  },
  itemChange(e) {
    console.log(e);
    let userCart = that.data.carts;
    let checks = e.detail.value;
    let checkAll = true;
    Object.keys(userCart).forEach(function (key) {
      let check = checks.indexOf(key) > -1;
      userCart[key].check = check;
      if (!check) checkAll = false;
    });
    that.setData({
      carts: userCart,
      checkAll: checkAll,
    })
    that.updatePrice();
  },
  numChange(e) {
    console.log(e);
    let userCart = that.data.carts;
    let dataset = e.currentTarget.dataset;
    userCart[dataset.id].num += parseInt(dataset.num);
    that.setData({
      carts: userCart
    })
    that.updatePrice();
    
  },
  remove(e){
    let userCart = that.data.carts;
    let id = e.currentTarget.dataset.id;
    delete userCart[id];
    console.log(userCart)
    that.setData({
      carts:userCart
    })
    that.updatePrice();
  },
  checkAll(e){
    let checkAll = that.data.checkAll;
    
    let userCart = that.data.carts;
    console.log(userCart)
    Object.keys(userCart).forEach(key=>{
      userCart[key].check = !checkAll;
    })
    that.setData({
      checkAll:!checkAll,
      carts:userCart
    })
    that.updatePrice();
  }
})