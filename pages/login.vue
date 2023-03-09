<template>
  <v-app>
    <div class="grid h-screen">
      <div class='container max-w-4xl m-auto'>
        <h2 class="text-5xl font-bold m-4 basicFont mb-12 text-center"> Login </h2>
        <form @submit="(e) => login(e)">
          <div class="lg:border-l lg:border-r lg:border-gray-500 max-w-4xl m-auto rounded-3xl p-3">
            <div class="login flex flex-col max-w-xl m-auto ">
              <input v-model="email" type="text" class="border-black border p-4 m-5 my-1  rounded-lg" placeholder="Email" />
              <input v-model="password" type="password" class="border-black border p-4 m-5 my-1 mb-6 rounded-lg" placeholder="Contraseña" />
              <button class="bg-black border border-black rounded-lg p-3 m-5 mb-0 text-white hover:bg-gray-300 hover:text-black transition-all">
                Iniciar Sesión
              </button>
    
              <p v-if="error" class="text-red-600 text-lg m-5" type="button"> Credenciales inválidas. </p>
    
            </div>
          </div>
        </form>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import { access } from 'fs'
import Vue from 'vue'

export default Vue.extend({
  name: 'LoginPage',
 
  data() {
    return {
      error: false,
      email: '',
      password: ''
    }
  },

  methods: {
    async login(e: any) {
      e.preventDefault()
      const response = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: this.email, password: this.password})
      }).then((response) => response.json())
      
      if(response?.access_token) {
        localStorage.setItem('token', response.access_token)
        this.$router.push({
          path: '/'
        })
      } else {
        this.error = true
      }
    }
  }
})
</script>
