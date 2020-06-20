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
  pageReset(state){
    state.pagecount=1;
  },
  pageMaxset(state,pagein){
    state.maxpage=pagein;
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