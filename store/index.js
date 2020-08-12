//Vuexのstore　一覧

import Vuex from 'vuex'
import { auth } from '~/plugins/firebase'

//export const namespaced = true

export const state = () => ({
        pagecount: 1,
        maxpage:0,
        status:"",
        token: localStorage.getItem('token') || '',
        username: ""


      })

export const getters = {
        isLoggedIn: state => state.status === "loggedIn"
      }
      
export const actions = {
        gotUser({ commit }, user){
            commit("setUser",user)
        },
        logout({ commit }){
          auth.signOut().then(() => {
            commit("logout")
          })
        },
        pageMax(context,pagein){
            context.commit('pageMaxset',pagein)
        },
        pageinSetMaxpage(context,pagein){
          context.commit('pageinSetMaxpage',pagein)
        },
        pageset(context,pagein){
          context.commit('pageset',pagein)
        },
        pageIncrease(context,perpage){
          context.commit('pageIncrease',perpage)
        },
        pageDecrease(context,perpage){
          context.commit('pageDecrease',perpage)
        },
        
      }     

export const mutations = {
  pagePlus(state){
    if (state.pagecount<state.maxpage){
    state.pagecount++;
    }
  },
  pageMinus(state){
    if (state.pagecount>1){
    state.pagecount--;
    }
  },
  pageIncrease(state,perpage){
    if (state.pagecount+perpage<=state.maxpage){
      state.pagecount=state.pagecount+perpage;
    } 
  },
  pageDecrease(state,perpage){
    if (state.pagecount-perpage<1){
      state.pagecount=1
    } else {
      state.pagecount=state.pagecount-perpage;
    }
  },
  
  pageReset(state){
    state.pagecount=1;
  },
  pageset(state,pagein){
    state.pagecount=pagein;
  },
  pageMaxset(state,pagein){
    state.maxpage=pagein;
  },
  pageinSetMaxpage(state,pageid){
    state.pagecount=pageid;
 },


  setUser(state,user){
    state.status = "loggedIn"
    state.username = user.displayName
  },
  logout(state){
    state.status = "loggedOut"
    state.username=""
  }
}