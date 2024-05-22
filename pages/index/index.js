var that, IntersectionObserver;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    num: 0,
    tabIndex: 0,

  },
  onLoad() {
    that = this;
  },
  onShow() {
    getApp().watch(function (value) {
      console.log(value);
    })
  },
  onReady() {
    console.log("ready");
    Api.getCategoryList().then(res => {
      console.log(res);
      let categories = res.data;
      let pageNums = [];
      let products = [];
      for (let i = 0; i < categories.length; i++) {
        pageNums.push(0);
        products.push([]);
      }
      that.setData({
        categories, pageNums, products
      })
      that.observe();
    }, err => {
      console.log(err);
    })
  },
  observe(){
    IntersectionObserver = wx.createIntersectionObserver().relativeToViewport({ bottom: 20 });
    console.log(IntersectionObserver)
    IntersectionObserver.observe('#loading', (ret) => {
      console.log(ret);
      if (ret.intersectionRatio > 0) {
          that.getProduct();
      }
    })
  },  
  getProduct() {
    let tabIndex = that.data.tabIndex;
    console.log(tabIndex)
    let categories = that.data.categories;
    let pageNums = that.data.pageNums;
    let products = that.data.products;
    Api.getProductList({
      pageNum:++pageNums[tabIndex],
      categoryId:categories[tabIndex].id,
      pageSize:10
    }).then(res=>{
      console.log(res);
      products[tabIndex] = products[tabIndex].concat(res.data.content);
      that.setData({
        products:products,
        end:res.data.last
      })
      if(res.data.last){
        IntersectionObserver.disconnect()
      }
    },err=>{
      console.log(err);
    })
  },
  tabSelect(e){
    console.log(e)
    that.setData({
      tabIndex:e.currentTarget.dataset.index
    });
    that.observe();
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
