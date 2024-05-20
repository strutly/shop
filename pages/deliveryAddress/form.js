var that;
import Api from '../../config/api';
import WxValidate from '../../utils/WxValidate';
import CustomPage from '../../CustomPage';
CustomPage({

  /**
   * 页面的初始数据
   */
  data: {
    address:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    that = this;
    that.initValidate();
  },
  initValidate() {
    let rules = {
      name: {
        required: true
      },
      
      phone: {
        tel:true,
        required: true
      },
      district: {
        required: true
      },
      address: {
        required: true
      }
    }, messages = {
      name: {
        required: "请输入姓名"
      },
      
      phone: {
        tel:"请输入正确的手机号",
        required: "请输入正确的手机号"
      },
      
      district: {
        required: "请选择省市区"
      },
      address: {
        required: "请输入详细地址"
      },
      
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  onReady() {
    Api.getdeliveryAddressDetail({id:that.options.id}).then(res=>{
      console.log(res);
      that.setData({
        address:res.data||{}
      })
    },err=>{
      that.showTips(err.msg);
    })
  },
  inputChange(e){
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]:e.detail.value
    })
  },
  regionChange(e){
    console.log(e);
    let address = that.data.address;
    address.province = e.detail.value[0];
    address.city = e.detail.value[1];
    address.district = e.detail.value[2];
    that.setData({
      address:address
    })
  },
  defaultFlagChange(e){
    console.log(e);
    that.setData({
      ['address.defaultFlag']:e.detail.value
    })
  },
  submit(e){
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }
    if(data.id){
      Api.updateDeliveryAddress(data).then(res=>{
        wx.navigateBack();
      },err=>{
        that.showTips(err.msg);
      })
    }else{
      Api.addDeliveryAddress(data).then(res=>{
        wx.navigateBack();
      },err=>{
        that.showTips(err.msg);
      })
    }
    
  }
})