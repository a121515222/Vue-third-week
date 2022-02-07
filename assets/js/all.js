"use strict";

var myModal = "";
var app = Vue.createApp({
  data: function data() {
    return {
      isNew: true,
      postId: "",
      user: {
        "username": "",
        "password": ""
      },
      apiInfo: {
        url: 'https://vue3-course-api.hexschool.io/v2',
        path: 'chun-chia'
      },
      products: [],
      productTemp: {},
      inputProduct: {
        title: "",
        category: "",
        origin_price: null,
        price: null,
        unit: "",
        description: "",
        content: "",
        is_enabled: "",
        imageUrl: "",
        imagesUrl: []
      }
    };
  },
  methods: {
    openModal: function openModal(data) {
      var _this = this;

      myModal.show(); //把id寫入postId
      //把products的資料取出傳到inputProudct

      if (this.isNew === false) {
        Object.keys(data).forEach(function (item) {
          Object.keys(_this.inputProduct).forEach(function (i) {
            if (item === i) {
              _this.inputProduct[i] = data[item];
            }

            ;
          });
        });
        this.postId = data.id;
        console.log(this.products);
      } else {
        return;
      }

      ;
    },
    closeModal: function closeModal() {
      myModal.hide(); //每次關閉都會重製inputProduct

      this.resetModal();
    },
    showProduct: function showProduct(data) {
      this.productTemp = data; // if (e.target.nodeName === 'BUTTON') {
      //   const index = e.target.dataset.index;
      //   this.productTemp = this.products[index];
      // }
      // else { return }
    },
    activeProduct: function activeProduct(e) {
      var index = e.target.dataset.index;

      if (this.products[index].is_enabled === 0) {
        this.products[index].is_enabled = 1;
      } else {
        this.products[index].is_enabled = 0;
      } //console.log(this.products[index].is_enabled)

    },
    login: function login() {
      console.log(this.user);

      if (this.user.username !== '' && this.user.password !== '') {
        axios.post("".concat(this.apiInfo.url, "/admin/signin"), this.user).then(function (res) {
          //console.log(res.data)
          //把token存到cookie
          document.cookie = "myHextoken1=".concat(res.data.token, "; expires=").concat(new Date(res.data.expired)); //轉跳頁面到產品資料頁
          //或是用window.location="Vue first week-2.html"

          location.href = "./Admin produlist.html";
        })["catch"](function (err) {
          alert(err.response.data.message);
        });
      } else {
        alert("請輸入帳號與密碼");
      }
    },
    sendToken: function sendToken() {
      var myToken = document.cookie.replace(/(?:(?:^|.*;\s*)myHextoken1\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = myToken;
    },
    getProduct: function getProduct() {
      var _this2 = this;

      //console.log(location.pathname)
      //判斷目前頁面是否為"/Vue first week-2.html"可以先用console.log(location.pathname)確認
      //傳到git hub上面時要去看git hub上面的location.pathname，在網頁的console 輸入location.pathname
      if (location.pathname === '/Vue-third-week/Admin%20produlist.html') {
        //取得所存在cookie的token
        this.sendToken();
        axios.get("".concat(this.apiInfo.url, "/api/").concat(this.apiInfo.path, "/admin/products")).then(function (res) {
          _this2.products = res.data.products; //console.log(this.products)
          //console.log(res.data)
        })["catch"](function (err) {
          alert("".concat(err.response.data.message, ",\u81EA\u52D5\u8F49\u8DF3\u81F3\u767B\u5165\u9801"));

          if (err.response.data.message === '驗證錯誤, 請重新登入') {
            location.href = "./Vue-third-week/index.html";
          }
        });
      }
    },
    inputPlaceholder: function inputPlaceholder(data) {
      return "\u8ACB\u8F38\u5165".concat(data);
    },
    porductStatus: function porductStatus(data) {
      var result = null;

      switch (data) {
        case 0:
          result = "未上架";
          break;

        case 1:
          result = "已上架";
          break;

        case 2:
          result = "缺貨中";
          break;

        case 3:
          result = "補貨中";
          break;

        case 4:
          result = "促銷中";
          break;

        case 5:
          result = "待下架";
          break;
      }

      ;
      return result;
    },
    sendDataPrepare: function sendDataPrepare() {
      var sendData = {
        data: {
          title: "",
          category: "",
          origin_price: null,
          price: null,
          unit: "",
          description: "",
          content: "",
          is_enabled: null,
          imageUrl: "",
          imagesUrl: []
        }
      }; // this.inputProduct.is_enabled=parseInt(this.inputProduct.is_enabled);

      sendData.data = JSON.parse(JSON.stringify(this.inputProduct));
      return sendData;
    },
    resetModal: function resetModal() {
      this.inputProduct = {
        title: "",
        category: "",
        origin_price: null,
        price: null,
        unit: "",
        description: "",
        content: "",
        is_enabled: "",
        imageUrl: "",
        imagesUrl: []
      };
    },
    editPorductList: function editPorductList() {
      var _this3 = this;

      //新增商品
      if (this.isNew === true) {
        var sendData = this.sendDataPrepare();
        this.sendToken();
        axios.post("".concat(this.apiInfo.url, "/api/").concat(this.apiInfo.path, "/admin/product"), sendData).then(function (res) {
          alert(res.data.message);

          _this3.getProduct();

          _this3.resetModal();
        })["catch"](function (err) {
          alert(err.response.data.message);
          console.log(err.response);
        });
      } //編輯商品
      else if (this.isNew === false) {
        var _sendData = this.sendDataPrepare();

        this.sendToken();
        axios.put("".concat(this.apiInfo.url, "/api/").concat(this.apiInfo.path, "/admin/product/").concat(this.postId), _sendData).then(function (res) {
          alert(res.data.message);

          _this3.getProduct();

          _this3.closeModal(); //清空postId


          _this3.postId = "";
        })["catch"](function (err) {
          alert(err.response.data.message);
          console.log(err.response);
        });
      }
    },
    deleteProduct: function deleteProduct() {
      var _this4 = this;

      console.log(this.postId);
      var confrim = prompt("請輸入delete");

      if (confrim === 'delete') {
        axios["delete"]("".concat(this.apiInfo.url, "/api/").concat(this.apiInfo.path, "/admin/product/").concat(this.postId)).then(function (res) {
          alert(res.data.message);

          _this4.getProduct();
        })["catch"](function (err) {
          alert(err.response.data.message);
          console.log(err.response);
        });
      } else {
        alert('輸入錯誤，不進行刪除');
      }
    },
    addImg: function addImg() {
      this.inputProduct.imagesUrl.push('');
    },
    deleteImg: function deleteImg() {
      this.inputProduct.imagesUrl.pop();
    }
  },
  computed: {},
  watch: {},
  mounted: function mounted() {
    myModal = new bootstrap.Modal(document.querySelector('#modalInputData'));
    this.getProduct();
  }
});
app.mount("#app");
//# sourceMappingURL=all.js.map
