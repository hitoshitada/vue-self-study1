<template lang="pug">
 #firebaseui-auth-container
</template>

<script>
import { auth,authProviders } from '~/plugins/firebase'
import * as firebaseui from 'firebaseui'

export default{
  name: 'FirebaseAuth',
  mounted(){
    auth.onAuthStateChanged(user => {
      if (!user){
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)

        const config = {
          signInOptions: [
            authProviders.Email,
            authProviders.Google,
            authProviders.Facebook
          ],
          callbacks: {
            signInSuccessWithAuthResult:(authResult) => {
              window.location.href="/memotest"
              return false
            }
          },
          signInSuccessUrl: '/memotest',
          signInFlow: 'popup',
        }
        ui.start('#firebaseui-auth-container',config)
      }
    })
  }
}

</script>