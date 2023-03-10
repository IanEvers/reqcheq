export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'reqcheq',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/i18n', '@nuxt/http'
  ],
  i18n: {
    locales: ['en', 'fr', 'es'],
    defaultLocale: 'es',
    vueI18n: {
      fallbackLocale: 'es',
      messages: {
        en: {
          imagen: 'Image',
          nombre: 'Name',
          precio: 'Price',
          categoria: 'categoria',
          all_categories: 'all_categories',
          filter_category: 'filter_category',
          filter_name: 'filter_name',
          products: 'products',
          descripcion: 'descripcion',
        },
        fr: {
          imagen: 'Imagen',
          nombre: 'Nombre',
          precio: 'Precio',
          categoria: 'categoria',
          all_categories: 'all_categories',
          filter_category: 'filter_category',
          filter_name: 'filter_name',
          products: 'products',
          descripcion: 'descripcion',
          
        },
        es: {
          imagen: 'Image',
          nombre: 'Nom',
          precio: 'Prix',
          categoria: 'categoria',
          all_categories: 'all_categories',
          filter_category: 'filter_category',
          filter_name: 'filter_name',
          products: 'products',
          descripcion: 'descripcion',
          
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
