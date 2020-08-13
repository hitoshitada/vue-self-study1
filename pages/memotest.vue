<template>
  <section>
    <div class="login" @click="doLogin">[login:{{username}}]</div>
    <h1>{{title}}</h1>
    <p class="message">{{message}}</p>
    <div v-if="this.status">     
       <nuxt-link to="/edit">Go to Edit Page</nuxt-link>
      
        <table>
       <tr>
       <td class="numberDisp" @click="this.pageMinus">prevPage</td>
          <td>{{ $store.state.pagecount }}</td>
          <td class="numberDisp" @click="this.pagePlus">nextPage</td>
          <td class="numberDisp" @click="this.pageReset_num">Reset</td>
          <td class="numberDisp" v-if="this.data_mode===true" @click="this.modechange">Trush Box</td>
          <td class="numberDisp" v-if="this.data_mode===false" @click="this.modechange">Out Trush Box</td>
          <td v-if="this.search_maxpage===false"><input type="text"  class="inputText" size="32"  v-model="searchData"></td>
          <td v-if="this.search_maxpage===true"><input type="text" class="inputText" size="32"  v-model="searchData" readonly></td>
          <div v-if="this.search_maxpage===false">
          <td @click="this.serchModeChange">
          <div v-if="this.search_mode===true" class="numberDisp">AND</div>
          <div v-else class="numberDisp">OR</div>
          </td></div>
          <td v-if="this.search_maxpage===true" class="numberDisp" @click="this.searchEnd">Stop Search</td>  
          <td v-if="this.search_maxpage===false"><input type="submit" class="button2" value="Search" @click="this.searchDisp"></td>       
          <td v-if="this.search_maxpage===true"><input type="submit" class="button3" value="Search next" @click="this.searchDisp"></td>
          <td v-if="this.search_maxpage===false"><input type="submit" value="Clear" class="button2" @click="this.searchClear"></td>
        
        </tr> 
      </table>  
  <hr>
    </div>

   <div v-if="this.data_mode===true">
    <ul v-for="(data,key) in array_data">
     <li>
       <tr>
      <div class="list1">
      <!--<td>{{parseInt($store.state.pagecount)+key}}</td>-->
     <td>{{data.num}}</td>
     <td @click="select(data.num)">{{data.title}}</td>
     <td><button class="trash" @click="trash(data.num)">ゴミ箱へ</button></td>
     </div>
       </tr>
     <div class="list2">{{data.posted}}</div>
     </li>
   </ul>
   </div>
   <div v-else>
      <ul v-for="(data,key) in array_data">
    <li>
       <tr>
　　　　<div class='list1-r'>
      <!--<td>{{parseInt($store.state.pagecount)+key}}</td>-->
      <td>{{data.num}}</td>
     <td @click="select(data.num)">{{data.title}}</td>
     </div>
      <td><button class="restore" @click="trash(data.num)">復帰</button></td>
     <td><button class="delete1" @click="del(data.num)">消去</button></td>
       </tr>
     <div class="list2">{{data.posted}}</div>
     </li>
   </ul>
   </div>
   <p v-if="this.array_data.length===0" class="message">There is no DATA.</p>
  </section>
</template>

<script>
 
 import firebase, { functions } from "firebase";
const axios=require('axios');
import Vuex from 'vuex'
import { mapState, mapActions ,mapMutations } from 'vuex';


export default{
     
     data: function(){
       return{
          title:'Fire-Memo',
          message:'テキストメモ。投稿の一覧表示ページ',
          msg:'',
          page:0,
          searchData:"",
          num_per_page:5, //1ページ当たりの表示数
          array_data:[],
          maxpagedata:0,//firebaseに登録されているデータの最後のページ数
          data_mode:true,//通常のデータはtrue,ゴミ箱に入ったデータはfalse
          searchWordreg:"",
          search_mode:true,
          search_maxpage:false,
          search_page:0,
       };
     },
    computed: mapState(['pagecount','status','maxpage']),  
    created:function(){
      this.getMaxpage();
      this.pageRead();
      
    },

    computed: {
     ...mapState(['username']),
     ...mapState(['status'])
    } ,   

     methods:{
       ...mapActions(['logout']),
       ...mapActions(['getUser']),
       ...mapMutations(['pageReset']),

       pagePlus: function(){
         this.search_maxpage=false;
         this.$store.dispatch('pageIncrease',parseInt(this.num_per_page));
         this.pageRead();
       },
       pageMinus: function(){
         this.search_maxpage=false;
         this.$store.dispatch('pageDecrease',parseInt(this.num_per_page));
         this.pageRead();
       },
       pageReset_num: function(){
       this.search_maxpage=false;
       this.pageReset();
       this.pageRead();
       },


       doLogin: function(){
         if (this.status != "loggedIn"){
           this.login();
         } else {
           this.logout();
            this.message='ログアウトしました';
         }
       },

    getMaxpage: function(){
    let Ref=firebase.database().ref('fire-memo');
    let pagein =1;
   
    let retMaxpage = () => {
    let self = this;
    let maxpage=0;
    Ref.orderByChild('num').limitToLast(1).once('value',function(snapshot){
    let data = snapshot.val();
    maxpage = Object.values(data);
    //console.log(maxpage);
    self.maxpagedata=maxpage[0].num;
    self.$store.dispatch('pageMax',self.maxpagedata);
    //console.log(self.$store.state.maxpage);
    });
    };
    retMaxpage();
   },

   pageRead: function(){
     //console.log(this.$store.state.maxpage);
     let Ref=firebase.database().ref('fire-memo'); 

     let retpagedata = () => {
      let self = this;
      let page = self.$store.state.pagecount;
      self.array_data=[];
      let arraydata=[];
    
      let myPromise = Promise.resolve();
      myPromise=myPromise.then(task1.bind(this,page)).then(looperas).then((val)=>{ 
       console.log(val);
       self.array_data=val[1];
       console.log('finished!');
       console.log(self.array_data);
      })
      
 
//****************************** 

async function looperas(val) {
       console.log(val);
       console.log(self.$store.state.maxpage);
       let a=0;      
       while (val[2]<5){        
       if (val[0]>self.$store.state.maxpage){break;} 
       await Ref.orderByChild('num').startAt(val[0]).endAt(val[0]).once('value',function(snapshot){
       console.log(val[0]);
       let getarraydata=Object.values(snapshot.val());
       
       val[0]++;             
       if (getarraydata[0].dataflag===self.data_mode){
         val[2]++;
       val[1]=val[1].concat(getarraydata);
       }
       console.log(val); 
      })       
       }
      return val;
      }
//*****************************   

       function task1(val){ // 引数pageを受け取る
       return new Promise(function(resolve, reject) {
      
      let a=0;      
      console.log(self);
      console.log(self.data_mode);
      Ref.orderByChild('num').startAt(val).endAt(val).once('value',function(snapshot){
      let getarraydata=Object.values(snapshot.val());
       console.log(val);
       console.log(getarraydata[0].dataflag);
       console.log(self.data_mode);
       console.log(getarraydata[0].dataflag===self.data_mode);
       val++; 
       if (getarraydata[0].dataflag===self.data_mode){
         a++
         } else {getarraydata=[];}

       console.log(getarraydata);
       
       resolve([val,getarraydata,a]);
        })          
      }); 
     } 
    
     };
      retpagedata();
    },

    modechange: function(){
      this.data_mode=!this.data_mode;
      this.pageRead();
    },
    trash: async function(number){
      this.search_maxpage=false;
      let result=true;
     if (this.data_mode===true){
         result = window.confirm('このページをゴミ箱に移しますか？');
       } else {
         result = window.confirm('このページをゴミ箱から戻しますか？'); 
       }
     if (result==false){
        return
      }
      let Ref=firebase.database().ref('fire-memo');
      let self=this;
      
     
      await Ref.orderByChild('num').equalTo(number).once('value',function(snapshot){
      let keyData=Object.keys(snapshot.val());
      console.log(snapshot.val());
      console.log(keyData[0]);
      console.log(self.data_mode);
      firebase.database().ref('fire-memo/'+keyData[0]).update({dataflag:!self.data_mode});
      })  
      
      this.pageRead();
    },

    del:async function(number){
     let result = window.confirm('データを完全に消去してもいいですか？');
　　　if (result==false) {
 　　　　return
     }
     let Ref=firebase.database().ref('fire-memo');
      let self=this;
      
      await Ref.orderByChild('num').equalTo(number).once('value',function(snapshot){
      let keyData=Object.keys(snapshot.val()); 
      console.log(keyData);
      firebase.database().ref('fire-memo/'+keyData[0]).remove();
      });

      for (let i=number+1;i<=this.maxpagedata;i++ )
      {
      await Ref.orderByChild('num').startAt(i).endAt(i).once('value',function(snapshot){
      let keyData=Object.keys(snapshot.val()); 
      let data=Object.values(snapshot.val());
      console.log('num='+data[0].num);
      console.log('new num='+(i-1));
      console.log('key='+keyData[0]);
      firebase.database().ref('fire-memo/'+keyData[0]).update({num:(i-1)});
      });
      }
      this.getMaxpage();
     this.pageRead();
    },

    select:function(number){

    this.$store.dispatch('pageset',number);
    this.$router.push('/edit');
    },
    searchClear:function(){
      this.searchData="";
    },
    serchModeChange:function(){
      this.search_mode=!this.search_mode;
    },


   //検索実行メソッド
    searchDisp:async function(){ 
      
      
      let self = this;

      //キーワードを正規表現に置き換える関数*************
　　　 let searchWordMake=() => {
      let searchword=this.searchData.trim();
　　　 let kugiri=/[, 　]+/g;
      console.log(searchword);
      if (searchword===""){return};
      if (this.search_mode===true){
      this.searchWordreg='^(?=.*'+searchword.split(kugiri).join(')(?=.*')+')';
      console.log(this.searchWordreg);
      } else {
      this.searchWordreg = searchword.replace(kugiri,'|');
      console.log(this.searchWordreg);
      
      }
      console.log(this.searchWordreg);
     }
     //キーワードを正規表現に置き換える関数終了************
     
     
     let page=0;
　　　if (this.search_maxpage===false){
     searchWordMake();
     console.log(this.searchWordreg);
     if (this.searchWordreg===""){return};
     this.search_maxpage=true;
     page = this.$store.state.pagecount;  
     } else {
     page=this.search_page;
     }
      
      let Ref=firebase.database().ref('fire-memo');          

      let maxpage = self.maxpagedata;
      self.array_data=[];//表示するデータの配列
      let arraydata=[];//検索したデータを一時的に保管する配列
      
      while (arraydata.length<5){

      await Ref.orderByChild('num').startAt(page).endAt(page).once('value',function(snapshot){
      let getarraydata=Object.values(snapshot.val());
      let getTitle=getarraydata[0].title;
      let getMsg=getarraydata[0].msg;
      let getDataflag=getarraydata[0].dataflag;
      //console.log(typeof getTitle);
      //console.log(getMsg);
      let indexTitle="";
      let indexMsg="";
        let regelement=new RegExp(self.searchWordreg,'i');
        indexTitle=regelement.test(getTitle);
        indexMsg=regelement.test(getMsg);
        console.log(indexTitle);
        console.log(indexMsg);
        //console.log(getDataflag);
        //console.log(self.data_mode);
        //console.log(getDataflag===self.data_mode);
        if ((indexTitle||indexMsg)&&(getDataflag===self.data_mode)){
          arraydata=arraydata.concat(getarraydata);
        }
        console.log(arraydata);
        self.array_data=arraydata;
      //});　
      })
      page++;
      console.log(self.array_data);
      if (page>=self.maxpagedata){
        self.search_maxpage=false;      
        break;}      
      }
       this.search_page=page;
      

      },
　　　　//検索実行メソッド終わり
　　　searchEnd:function(){
      this.search_maxpage=false;
     },

    },

     }

</script>


<style>
.container {
  padding: 5px 10px;
}

.login {
  font-weight: bold;
  font-size: 12pt;
  cursor: pointer;
}
.list1 {
  text-align: left;
  font-size: 16pt;
  cursor: pointer;
  color:black;
}
.list1-r {
  text-align: left;
  font-size: 16pt;
  cursor: pointer;
  color:red;
}


.list2 {
  text-align: right;
  font-size: 10pt;
  
}
.trash {
  position: relative;
  width:80px;
  height:35px;
  top:50%;
  left:50%;
  margin-left: 200px;
  margin-top: 0px;
  right: 20px;
  cursor: pointer;
  appearance: none;
  border: 0;
  border-radius: 5px;
  background: purple;
  color: #fff;
  padding: 4px 16px;
  font-size: 12px;
}
.delete1 {
  position: relative;
  width:80px;
  height:35px;
  top:50%;
  left:50%;
  margin-left: 200px;
  margin-top: 0px;
  right: 20px;
  cursor: pointer;
  appearance: none;
  border: 0;
  border-radius: 5px;
  background: red;
  color: #fff;
  padding: 4px 16px;
  font-size: 12px;
}
.restore {
  position: relative;
  width:80px;
  height:35px;
  top:50%;
  left:50%;
  margin-left: 200px;
  margin-top: 0px;
  right: 20px;
  cursor: pointer;
  appearance: none;
  border: 0;
  border-radius: 5px;
  background:blue;
  color: #fff;
  padding: 4px 16px;
  font-size: 12px;
}

.button2 {
  padding: 5px 5px;
  border: none;
  outline: none;
  font-size: 14pt;
  color:black;
  cursor: pointer;
  
}
.button2:active {
  transform: translateY(4px);
  border: none;
 
}
.button3 {
  padding: 5px 5px;
  border: none;
  outline: none;
  font-size: 14pt;
  color:red;
  cursor: pointer;
  
}
.button3:active {
  transform: translateY(4px);
  border: none;
 
}

h1 {
  font-size: 60pt;
  color: #345980;
}
p {
  padding-top: 5px;
  margin: 10px 0px;
  font-size: 20pt;
}
.message {
  font-size: 16pt;
}
div {
  font-size: 14pt;
}
ul {
  margin: 0px 10px;
  background-color: aliceblue;
}
li {
  padding: 10px;
  font-size: 14pt;
}
tr th {
  width: 120px;
  background-color: darkblue;
  color:white;
  font-size: 16pt;
}

.numberDisp {
  padding: 5px 10px;
  background-color: #eef;
  font-size: 14pt;
  cursor: pointer;
}
.numberDisp:active {
  transform: translateY(4px);
  border: none;
}

tr td {
  padding: 5px 10px;
  background-color: #eef;
  font-size: 14pt;

}

hr {
  margin: 10px 0px;
}
input {
  font-size: 14pt;
}
button{
  font-size: 14pt;
}
</style>