var that;
import Api from '../../config/api';
import WxValidate from '../../utils/WxValidate';
import CustomPage from '../../CustomPage';
CustomPage({

  data: {
    tabIndex:0,
    navs:[{title:'全部',status:''},{title:'待付款',status:'UNPAID'},{title:'待发货',status:''},{title:'待收货',status:''},{title:'已完成',status:''},]
  },
  onLoad(options) {
    that = this;
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
  onShareAppMessage() {

  }
})