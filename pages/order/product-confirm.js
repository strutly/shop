var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    product: {},
    num:1
  },
  
  onLoad(options) {
    that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    Api.getProductDetail({
      id:that.data.options.id
    }).then(res=>{
      that.setData({
        product:res.data,
        sumPrice:res.data.price
      })
    },err=>{
      that.showTips(err.msg);
    });
    Api.getDeliveryAddressDefault().then(res=>{
      that.setData({
        address:res.data
      })
    },err=>{
      that.showTips(err.msg);
    })
  },

  numChange(e) {
    console.log(e);
    let product = that.data.product;
    let num = that.data.num;
    console.log(num)
    let dataset = e.currentTarget.dataset;
    num += parseInt(dataset.num);
    that.setData({
      num: num,
      sumPrice:num*product.price
    })    
  },
  async submit(e){
    console.log(e);
    let data = e.detail.value;
    let product = that.data.product;
    let formData = {...data,cartList:[{
      "id": product.id,
      "num": that.data.num,
      "pic": product.pics[0],
      "price": product.price,
      "title": product.title
    }]};

    let orderResp = await Api.addOrder(formData);
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
      console.log(error)
      that.setData({
        disabled:false
      })
      that.showTips(error.msg);
    } 



  }

  
})