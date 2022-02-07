let myModal="";

const app = Vue.createApp({
  data() {
    return {
      isNew: true,
      postId:"",
      user: {
        "username": "",
        "password": ""
      }, apiInfo: {
        url: 'https://vue3-course-api.hexschool.io/v2',
        path: 'chun-chia'
      }, products: [],
      productTemp: {},
      inputProduct: {
        title: "",
        category: "",
        origin_price: null,
        price: null,
        unit: "",
        description: "",
        content: "",
        is_enabled:"",
        imageUrl: "",
        imagesUrl:[],
      },
    }
  },
  methods: {
    openModal(data) {
      myModal.show();
      //把id寫入postId
      //把products的資料取出傳到inputProudct
      if (this.isNew === false) {
        Object.keys(data).forEach((item)=>{
          Object.keys(this.inputProduct).forEach((i)=>{
            if(item===i){
              this.inputProduct[i]=data[item]
            };
          });
        });
        this.postId=data.id
        console.log(this.products)
      } else {
        return
       };
      
    },
    closeModal() {
      myModal.hide();
      //每次關閉都會重製inputProduct
      this.resetModal();
    },
    showProduct(data) {
      this.productTemp = data
      // if (e.target.nodeName === 'BUTTON') {
      //   const index = e.target.dataset.index;
      //   this.productTemp = this.products[index];

      // }
      // else { return }
    },
    activeProduct(e) {
      const index = e.target.dataset.index;
      if (this.products[index].is_enabled === 0) {
        this.products[index].is_enabled = 1;
      } else {
        this.products[index].is_enabled = 0;
      }
      //console.log(this.products[index].is_enabled)
    },
    login() {
      console.log(this.user);
      if (this.user.username !== '' && this.user.password !== '') {
        axios.post(`${this.apiInfo.url}/admin/signin`, this.user).then((res) => {
          //console.log(res.data)
          //把token存到cookie
          document.cookie = `myHextoken=${res.data.token}; expires=${new Date(res.data.expired)}`;
          //轉跳頁面到產品資料頁
          //或是用window.location="Vue first week-2.html"
          location.href = "./Admin produlist.html"
        }).catch((err) => {
          
          alert(err.response.data.message)
        })
      } else { alert("請輸入帳號與密碼") }
    },
    sendToken() {
      const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)myHextoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = myToken;
      
    },

    getProduct() {
      //console.log(location.pathname)
      //判斷目前頁面是否為"/Vue first week-2.html"可以先用console.log(location.pathname)確認
      //傳到git hub上面時要去看git hub上面的location.pathname，在網頁的console 輸入location.pathname
      if (location.pathname === '/Admin%20produlist.html') {
        //取得所存在cookie的token
        this.sendToken();
        axios.get(`${this.apiInfo.url}/api/${this.apiInfo.path}/admin/products`).then((res) => {
          this.products = res.data.products;
          //console.log(this.products)
          //console.log(res.data)
        }).catch((err) => {
          alert(`${err.response.data.message},自動轉跳至登入頁`)
          if(err.response.data.message==='驗證錯誤, 請重新登入'){
            location.href = "./index.html"
          }
        });
      }
    },
    inputPlaceholder(data) {
      return `請輸入${data}`
    },
    porductStatus(data) {
      let result = null;
      switch (data) {
        case 0: result = "未上架"
          break;
        case 1: result = "已上架"
          break;
        case 2: result = "缺貨中"
          break;
        case 3: result = "補貨中"
          break;
        case 4: result = "促銷中"
          break;
        case 5: result = "待下架"
          break;
      };
      return result;
    },
    sendDataPrepare(){
      const sendData = {
        data:
        {
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
      };
      // this.inputProduct.is_enabled=parseInt(this.inputProduct.is_enabled);
      sendData.data=JSON.parse(JSON.stringify(this.inputProduct));
      return sendData;
    },
    resetModal(){
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
    editPorductList() {
      //新增商品
      if (this.isNew === true) {
       const sendData = this.sendDataPrepare();
        this.sendToken();
        axios.post(`${this.apiInfo.url}/api/${this.apiInfo.path}/admin/product`, sendData).then((res) => {
          alert(res.data.message);
          this.getProduct();
          this.resetModal();
        }).catch((err) => {
          alert(err.response.data.message);
          console.log(err.response);
        });
      }
      //編輯商品
      else if (this.isNew === false) {
        const sendData = this.sendDataPrepare();
        this.sendToken();
        axios.put(`${this.apiInfo.url}/api/${this.apiInfo.path}/admin/product/${this.postId}`, sendData).then((res) => {
          alert(res.data.message);
          this.getProduct();
          this.closeModal();
          //清空postId
          this.postId="";
          
          
        }).catch((err) => {
          alert(err.response.data.message);
          console.log(err.response);
        });
      }
    },
    deleteProduct(){
      console.log(this.postId)
      const confrim = prompt("請輸入delete")
      if(confrim==='delete'){
        axios.delete(`${this.apiInfo.url}/api/${this.apiInfo.path}/admin/product/${this.postId}`).then((res) => {
          alert(res.data.message);
          this.getProduct();
        }).catch((err) => {
          alert(err.response.data.message);
          console.log(err.response);
        });
      }else{
        alert('輸入錯誤，不進行刪除')
      }
    },
    addImg(){
      this.inputProduct.imagesUrl.push('');
    },
    deleteImg(){
      this.inputProduct.imagesUrl.pop();
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    myModal = new bootstrap.Modal(document.querySelector('#modalInputData'));
    this.getProduct();
  },
})
app.mount("#app")

