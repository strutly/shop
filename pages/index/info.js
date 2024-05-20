var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({

  data: {
    userInfo: wx.getStorageSync('userInfo') || {},
    sexArr: [{ title: "男", value: 1 }, { title: "女", value: 2 }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    that = this;
  },
  onReady() {

  },
  onShow() {

  },
  pickerChange(e) {
    console.log(e)
    let sexArr = that.data.sexArr;
    let index = e.detail.value;
    let type = e.currentTarget.dataset.type;
    let userInfo = that.data.userInfo;
    userInfo[type] = sexArr[index].value;
    that.setData({
      userInfo: userInfo
    })
    Api.updateUserInfo({
      "gender": sexArr[index].value
    }).then(res => {
      console.log(res);
      wx.setStorageSync('userInfo', userInfo);
    }, err => {
      that.showTips(err.msg);
    })

  },
  inputChange(e) {
    let nickName = e.detail.value;
    if (nickName) {
      Api.updateUserInfo({
        nickName
      }).then(res => {
        console.log(res);
        let userInfo = that.data.userInfo;
        wx.setStorageSync('userInfo', { ...userInfo, nickName });
      }, err => {
        that.showTips(err.msg);
      })
    }

  },
  getPhoneNumber(e) {
    console.log(e);
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      Api.getPhoneNumber({
        code: e.detail.code
      }).then(res => {
        console.log("success", res);
        let userInfo = that.data.userInfo;
        userInfo.phone = res.data;
        that.setData({
          userInfo
        })
        wx.setStorageSync('userInfo', userInfo);
      }, err => {
        console.log("err", err);
      })
    }
  },
  chooseAvatra(e) {
    console.log(e);
    Api.uploadFile(e.detail.avatarUrl, false).then(res => {
      console.log(res);
      Api.updateUserInfo({
        "avatarUrl": res.data
      }).then(r => {
        let userInfo = that.data.userInfo;
        userInfo.avatarUrl = res.data;
        that.setData({
          userInfo
        })
        wx.setStorageSync('userInfo', userInfo);
      }, e => {
        that.showTips(e.msg);
      })
    }, err => {
      that.showTips(err.msg);
    })
  },
})