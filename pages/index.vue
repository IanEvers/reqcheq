<template>
  <v-app>

    <div class="bg-gray-200 min-h-screen">
      <div class=" max-w-7xl px-12 m-auto pt-12">
        <h1 class="text-3xl xl:text-5xl font-bold inter">Back Office</h1>
    
        <v-data-table
          :headers="categoryHeaders"
          :items="categories"
          :items-per-page="5"
          class="elevation-1 mb-24 mt-12"          
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title> Categorías </v-toolbar-title>
            
              <v-spacer></v-spacer>
              <v-dialog
                v-model="categoryDialog"
                max-width="700px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    + Nueva Categoría
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitleCategory }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-text-field
                            v-model="editedCategory.name"
                            label="Nombre"
                          ></v-text-field>
                        </v-col>
                      
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="closeCategory"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="saveCategory"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="categoryDialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">Seguro? Segurísimo?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDeleteCategory">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirmCategory">OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                  <v-subheader v-if="errorDeleteCategory"> No se puede borrar una categoría mientras haya elementos de esa categoría.</v-subheader>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.imagen="{ item }">
            <img :src="item.image"  alt="" class="w-12">
          </template>
       
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editCategory(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteCategory(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          
        </v-data-table>
    
        <h2 class="text-xl inter mt-6 ">Filtros</h2>
        <div class="border border-black bg-white my-2 p-3 rounded-lg gap-3 inter">
          <div class="lg:flex flex-wrap items-center gap-24">
            <v-text-field
              label="Título"
              v-model="titleFilter"
              class=""
            ></v-text-field>
            <div class="flex items-center">
              <v-subheader>Precio</v-subheader>
              <v-range-slider
              
                thumb-label="always"
                max="1000"
                min="0"
                v-model="priceFilter"
                class="mt-6 px-2"
              >
              <template v-slot:prepend>
                <v-text-field
                  :value="priceFilter[0]"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 60px"
                  @change="$set(priceFilter, 0, $event)"
                ></v-text-field>
              </template>
              <template v-slot:append>
                <v-text-field
                  :value="priceFilter[1]"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 60px"
                  @change="$set(priceFilter, 1, $event)"
                ></v-text-field>
              </template>
              </v-range-slider>
            </div>
      
            <v-select
              v-model="select"
              :items="categories"
              item-text="name"
              item-value="id"
              label="Categoria"
              class=""
            >
            </v-select>
            
          </div>
          <button  class="bg-blue-600 text-white relative rounded-lg py-1 px-2 mt-5 hover:bg-blue-500 w-full" @click="filterProducts()"> Filtrar </button>
        </div>

        <v-data-table
          :headers="headers"
          :items="products"
          :items-per-page="5"
          class="elevation-1 mb-24"          
        >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title> Productos </v-toolbar-title>
           
            <v-spacer></v-spacer>
            <v-dialog
              v-model="dialog"
              max-width="700px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  + Nuevo Producto
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedProduct.title"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-textarea
                          v-model="editedProduct.description"
                          label="Descripción"
                        ></v-textarea>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedProduct.price"
                          label="Precio"
                        ></v-text-field>
                      </v-col>
                     
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">Seguro? Segurísimo?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.imagen="{ item }">
          <div class="flex gap-2">
            <img v-for="i in item.images" :src="i"  alt="" class="w-12">
          </div>
        </template>
        <template v-slot:item.description="{ item }">
          <div style="max-width: 350px;"> {{ item.description }}</div>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
          
        </v-data-table>

      </div>
    </div>
  </v-app>

</template>


<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',
  beforeCreate () {
    if (process.browser) {
      if(!localStorage.getItem('token')) {
        this.$router.push({
          path: '/login'
        })
      }
    }
  },
  data () {
    return {
      dialog: false,
      dialogDelete: false,
      categoryDialog: false,
      categoryDialogDelete: false,
      
      titleFilter: '',
      priceFilter: [0, 5000],
      select: '',

      headers: [
        {
          text: 'id',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'Imagenes', value: 'imagen' },
        { text: 'Nombre', value: 'title' },
        { text: 'Descripción', value: 'description' },
        { text: 'categoría', value: 'category.name' },
        { text: 'Precio', value: 'price' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      products: [{}],
      categoryHeaders: [
        {
          text: 'id',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'Imagenes', value: 'imagen' },
        { text: 'Nombre', value: 'name' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],

      editedIndex: -1,
      editedProduct: {
        id: 0,
        images: [],
        title: '',
        description: '',
        category: { name: '', id: '' },
        price: 0,
      },
      defaultItem: {
        id: 0,
        images: [],
        title: '',
        description: '',
        category: { name: '', id: '' },
        price: 0,
      },

      editedCategory: {
        id: 0,
        images: '',
        name: '',
      },
      defaultCategory: {
        id: 0,
        images: '',
        name: '',
      },
      errorDeleteCategory: false
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Producto' : 'Editar Producto'
    },
    formTitleCategory() {
      return this.editedIndex === -1 ? 'Nueva Categoría' : 'Editar Categoría'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  methods: {
    async filterProducts() {
      let url = new URL('https://api.escuelajs.co/api/v1/products');

      url.searchParams.set('title', this.titleFilter);
      url.searchParams.set('categoryId', this.select);
      url.searchParams.set('price_min', String(this.priceFilter[0]));
      url.searchParams.set('price_max', String(this.priceFilter[1]));
      
      const response = await fetch(url).then((response) => response.json())
      this.products = response
    },

    editItem (item: any) {
      this.editedIndex = this.products.indexOf(item)
      this.editedProduct = Object.assign({}, item)

      this.dialog = true
    },

    deleteItem (item: any) {
      this.editedIndex = this.products.indexOf(item)
      this.editedProduct = Object.assign({}, item)
      this.dialogDelete = true
    },

    editCategory (item: any) {
      this.editedIndex = this.categories.indexOf(item)
      this.editedCategory = Object.assign({}, item)

      this.categoryDialog = true
    },

    deleteCategory (item: any) {
      this.editedIndex = this.categories.indexOf(item)
      this.editedCategory = Object.assign({}, item)
      this.categoryDialogDelete = true
    },

    async deleteItemConfirm() {
      let url = new URL('https://api.escuelajs.co/api/v1/products/'+this.editedProduct.id);
      
      await fetch(url, { method: 'DELETE' })
      this.products.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedProduct = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedProduct = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save () {
      const imagen = "https://api.lorem.space/image/fashion?w=640&h=480&r=7910"
      if (this.editedIndex > -1) {
        const newProduct = {...this.editedProduct, category: {name: this.categories.find((category: any) => category.id == this.editedProduct.category)?.name, id: this.editedProduct.category}}
        Object.assign(this.products[this.editedIndex], newProduct)
        await fetch('https://api.escuelajs.co/api/v1/products/'+ newProduct.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.editedProduct)
        }).then((response) => response.json())
      } else {
        const newProduct = {...this.editedProduct, categoryId: 1, images: [imagen, imagen, imagen]}
        const product = await fetch('https://api.escuelajs.co/api/v1/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct)
        }).then((response) => response.json())

        this.products.push(product)
      }
      this.close()
    },

    async deleteItemConfirmCategory() {
      let url = new URL('https://api.escuelajs.co/api/v1/categories/'+this.editedCategory.id);
      
      const response = await fetch(url, { method: 'DELETE' }).then((response) => response.json())
      if(response.code == "SQLITE_CONSTRAINT_FOREIGNKEY") {
        this.errorDeleteCategory = true
      } else {
        this.categories.splice(this.editedIndex, 1)
        this.closeDeleteCategory()
      }
    },

    closeCategory () {
      this.categoryDialog = false
      this.$nextTick(() => {
        this.editedCategory = Object.assign({}, this.defaultCategory)
        this.editedIndex = -1
      })
    },

    closeDeleteCategory () {
      this.errorDeleteCategory = false
      this.categoryDialogDelete = false
      this.$nextTick(() => {
        this.editedCategory = Object.assign({}, this.defaultCategory)
        this.editedIndex = -1
      })
    },

    async saveCategory () {
      const imagen = "https://api.lorem.space/image/fashion?w=640&h=480&r=7910"

      if (this.editedIndex > -1) {
        Object.assign(this.categories[this.editedIndex], this.editedCategory)
        await fetch('https://api.escuelajs.co/api/v1/categories/'+ this.editedCategory.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.editedCategory)
        }).then((response) => response.json())
      } else {
        
        await fetch('https://api.escuelajs.co/api/v1/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({...this.editedCategory, image: imagen})
        }).then((response) => response.json())

        this.categories.push({...this.editedCategory, image: imagen})
      }
      this.closeCategory()
    },
  },

  async asyncData({ $http }) {
    const products = await $http.$get('https://api.escuelajs.co/api/v1/products')
    const categories = await $http.$get('https://api.escuelajs.co/api/v1/categories')
    return { products, categories }
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;800&display=swap');

.inter {
  font-family: 'Inter', sans-serif;
}
</style>
