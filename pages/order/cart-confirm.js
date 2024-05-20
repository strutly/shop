var that;
import Api from '../../config/api';
import WxValidate from '../../utils/WxValidate';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    carts: []
  },
  onLoad(options) {
    that = this;
    that.initValidate();
  },
  initValidate() {
    let rules = {
      deliveryAddressId: {
        required: true
      },      
      cartList: {
        size:1
      }
    }, messages = {
      deliveryAddressId: {
        required: "请选择收货地址"
      },      
      cartList: {
        size:"购买商品不能为空"
      }      
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  onReady() {
    let userCart = wx.getStorageSync('userCart');
    let carts = Object.values(userCart).filter(item => item.check);
    let sumPrice = 0;
    carts.forEach(item => {
      sumPrice += parseInt(item.num) * parseInt(item.price)
    });
    that.setData({
      carts: Object.values(userCart).filter(item => item.check),
      sumPrice: sumPrice
    });
    Api.getDeliveryAddressDefault().then(res=>{
      that.setData({
        address:res.data
      })
    },err=>{
      that.showTips(err.msg);
    })
  },
  async submit(e){
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }
    let orderResp = await Api.addOrder(data);
    try {
      if(orderResp.code==0){
        let payRes = await wx.requestPayment({
          timeStamp: orderResp.data.timeStamp + "",
          nonceStr: orderResp.data.nonceStr,
          package: orderResp.data.packageValue,
          signType: orderResp.data.signType + "",
          paySign: orderResp.data.paySign
        })
        console.log(payRes)
        if(payRes.errMsg=="requestPayment:ok"){
          let userCart = wx.getStorageSync('userCart');
          Object.keys(userCart).forEach(key=>{
            if(userCart[key].check){
              delete userCart[key]
            }
          })
          wx.setStorageSync('userCart', userCart);

          that.showTips("支付成功~","success");
          setTimeout(() => {
            that.back()
          }, 1500);
        }else{
          that.showTips(payRes.errMsg);
        }
      }else{
        that.setData({
          disabled:false
        })
        that.showTips(res.msg);
      } 
    } catch (error) {
      that.setData({
        disabled:false
      })
      that.showTips(error.msg);
    } 

  }
})