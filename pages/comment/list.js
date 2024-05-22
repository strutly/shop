var that;
import Api from '../../config/api';
import WxValidate from '../../utils/WxValidate';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    comments:[]
  },
  onLoad(options) {
    that = this;
  },
  onReady() {
    that.getList(0);
  },
  getList(pageNo) {
    let param = {};
    param.pageNum = pageNo;
    param.pageSize = 10;
    param.productId = that.data.options.id;
    let comments = that.data.comments;
    Api.getCommentList(param).then(res=>{
      that.setData({
        comments: comments.concat(res.data.content),
        endline: res.data.last,
        pageNo: pageNo
      })
    },err=>{
      that.showTips(err.msg);
    })   
  },
  onReachBottom() {
    let endline = that.data.endline;
    if (!endline) {
      let pageNo = that.data.pageNo + 1;
      that.getList(pageNo);
    }
  },
})