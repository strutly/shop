var that, IntersectionObserver;
import Api from '../../config/api';
import WxValidate from '../../utils/WxValidate';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    tabIndex: 0,
    navs: [{ title: '全部', status: '' }, { title: '待付款', status: 'UNPAID' }, { title: '待发货', status: 'PAID' }, { title: '待收货', status: 'SENDING' }, { title: '已完成', status: 'END' }, { title: '退款', status: 'REFUND' }],
    orders: [[], [], [], [], [], []],
    pageNums: [0, 0, 0, 0, 0, 0]
  },
  onLoad(options) {
    that = this;
    that.initValidate();
  },
  initValidate() {
    let rules = {
      amount: {
        required: true,
        min:0.01
      },      
      reason: {
        required:true
      }
    }, messages = {
      amount: {
        required: "请输入退款金额",
        min:"金额错误"
      },      
      reason: {
        required:"请输入退款原因"
      }      
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  onReady() {
    that.setData({
      tabIndex: that.data.options.tabIndex || 0
    })
    that.observe();
  },
  onShow() {

  },
  observe() {
    IntersectionObserver = wx.createIntersectionObserver().relativeToViewport({ bottom: 20 });
    console.log(IntersectionObserver)
    IntersectionObserver.observe('#loading', (ret) => {
      console.log(ret);
      if (ret.intersectionRatio > 0) {
        that.getOrder();
      }
    })
  },
  tabSelect(e) {
    console.log(e)
    that.setData({
      tabIndex: e.currentTarget.dataset.index
    });
    that.observe();
  },
  getOrder() {
    let tabIndex = that.data.tabIndex;
    console.log(tabIndex)
    let navs = that.data.navs;
    let pageNums = that.data.pageNums;
    let orders = that.data.orders;
    Api.getOrderList({
      pageNum: ++pageNums[tabIndex],
      status: navs[tabIndex].status,
      pageSize: 10
    }).then(res => {
      console.log(res);
      orders[tabIndex] = orders[tabIndex].concat(res.data.content);
      that.setData({
        orders: orders,
        end: res.data.last
      })
      if (res.data.last) {
        IntersectionObserver.disconnect()
      }
    }, err => {
      console.log(err);
    })
  },
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.tnum,
      success(res) {
        console.log(res);
      }
    })
  },
  reload() {
    let tabIndex = that.data.tabIndex;
    let pageNums = that.data.pageNums;
    let orders = that.data.orders;
    orders[tabIndex] = [];
    pageNums[tabIndex] = 0;
    that.setData({
      orders: orders,
      pageNums:pageNums,
      end: false
    })
    that.observe();
  },
  pay(e) {
    Api.orderPay({ id: e.currentTarget.dataset.id }).then(res => {
      wx.requestPayment({
        timeStamp: res.data.timeStamp + "",
        nonceStr: res.data.nonceStr,
        package: res.data.packageValue,
        signType: res.data.signType + "",
        paySign: res.data.paySign
      }).then(payRes => {
        console.log("payRes", payRes)
        if (payRes.errMsg == "requestPayment:ok") {
          that.showTips("支付成功", "success");
          that.reload();
        }
      }, payErr => {
        console.log("payErr", payErr)
        that.showTips("支付失败");
      })
    }, err => {
      that.showTips(err.msg);
    })
  },
  update(e) {
    Api.orderStatus({...e.currentTarget.dataset }).then(res => {
      that.showTips("操作成功", "success");
      that.reload();
    }, err => {
      that.showTips(err.msg);
    })
  },
  refund(e){
    console.log(e);
    that.setData({
      modalrefund:true,
      ...e.currentTarget.dataset
      
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
    Api.orderRefund(data).then(res=>{
      console.log(res);
      that.setData({
        modalrefund:false
      })
      that.showTips(res.msg,"success");
      that.reload();
    },err=>{
      that.showTips(err.msg);
    })
  }
})