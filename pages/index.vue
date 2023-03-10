<template>
  <v-app>

    <header class="bg-gray-300 ">
      <div class="flex justify-between m-auto items-center p-5">
        <div>
          <span class="font-bold text-lg">{{ user.name }}</span>
          <span class="italic px-3">{{ user.role }}</span>
        </div>
        <img :src="user.avatar" alt="" class="w-12 h-12 rounded-full object-cover">
      </div>  
    </header>

    <div class="bg-gray-200 min-h-screen">
      <div class=" max-w-7xl px-12 m-auto pt-12">
        <h1 class="text-3xl xl:text-5xl font-bold inter">Back Office</h1>
    
        <v-data-table
          :headers="categoryHeaders"
          :items="filteredCategories"
          :items-per-page="5"
          class="elevation-1 mb-24 mt-12"          
        >
          <template v-slot:header.name="{ header }">
            {{ header.text }}
            <v-menu offset-y :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon small :color="categoryNameFilter ? 'primary' : ''">
                    mdi-filter
                  </v-icon>
                </v-btn>
              </template>
              <div style="background-color: white; width: 280px">
                <v-text-field
                  v-model="categoryNameFilter"
                  class="pa-4"
                  type="text"
                  label="Buscar por Nombre"
                  :autofocus="true"
                ></v-text-field>
                <v-btn
                  @click="categoryNameFilter = ''"
                  small
                  text
                  color="primary"
                  class="ml-2 mb-2"
                >limpiar</v-btn>
              </div>
            </v-menu>
          </template>
          
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
                      <v-form
                        ref="formCategory"
                        v-model="validCategoryForm"
                        lazy-validation
                      >
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-file-input
                              truncate-length="25"
                              
                              accept="image/*"
                              disabled
                              label="(no disponible)"
                              @change="() => handleFileUploadCategory(editedCategory.image)"
                            >
                            </v-file-input>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedCategory.name"
                              label="Nombre"
                              :rules="[(v: any) => !!v || 'Campo obligatorio.']"
                            ></v-text-field>
                          </v-col>
                        
                        </v-row>
                      </v-form>
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
                min="1"
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
          :items="filteredProducts"
          :items-per-page="5"
          :loading="productTableLoading"
          class="elevation-1 mb-24"          
        >
          <template v-slot:header.title="{ header }">
            {{ header.text }}
            <v-menu offset-y :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon small :color="productsFilters.title ? 'primary' : ''">
                    mdi-filter
                  </v-icon>
                </v-btn>
              </template>
              <div style="background-color: white; width: 280px">
                <v-text-field
                  v-model="productsFilters.title"
                  class="pa-4"
                  type="text"
                  label="Buscar por Nombre"
                  :autofocus="true"
                ></v-text-field>
                <v-btn
                  @click="productsFilters.title = ''"
                  small
                  text
                  color="primary"
                  class="ml-2 mb-2"
                >limpiar</v-btn>
              </div>
            </v-menu>
          </template>
          <template v-slot:header.description="{ header }">
            {{ header.text }}
            <v-menu offset-y :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon small :color="productsFilters.description ? 'primary' : ''">
                    mdi-filter
                  </v-icon>
                </v-btn>
              </template>
              <div style="background-color: white; width: 280px">
                <v-text-field
                  v-model="productsFilters.description"
                  class="pa-4"
                  type="text"
                  label="Buscar por Descripción"
                  :autofocus="true"
                ></v-text-field>
                <v-btn
                  @click="productsFilters.description = ''"
                  small
                  text
                  color="primary"
                  class="ml-2 mb-2"
                >limpiar</v-btn>
              </div>
            </v-menu>
          </template>
       
          <template v-slot:header.price="{ header }">
            {{ header.text }}
            <v-menu offset-y :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon small :color="productsFilters.price ? 'primary' : ''">
                    mdi-filter
                  </v-icon>
                </v-btn>
              </template>
              <div style="background-color: white; width: 280px">
                <v-text-field
                  v-model="productsFilters.price"
                  class="pa-4"
                  type="text"
                  label="Buscar por Precio"
                  :autofocus="true"
                ></v-text-field>
                <v-btn
                  @click="productsFilters.price = ''"
                  small
                  text
                  color="primary"
                  class="ml-2 mb-2"
                >limpiar</v-btn>
              </div>
            </v-menu>
          </template>
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
                  <v-form
                    ref="formProducts"
                    v-model="validProductsForm"
                    lazy-validation
                  >
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
                            :rules="[(v: any) => !!v || 'El título es obligatorio']"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="20"
                          sm="10"
                          md="10"
                        >
                          <v-textarea
                            v-model="editedProduct.description"
                            label="Descripción"
                            :rules="[(v: any) => !!v || 'La descripción es obligatoria']"
                          ></v-textarea>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-file-input
                            truncate-length="25"
                            accept="image/*"
                            disabled
                            label="(no disponible)"
                          >
                          </v-file-input>
                        </v-col>
                        <v-col
                          v-if="editedIndex == -1"
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-select
                            v-model="editedProduct.category.id"
                            :items="categories"
                            item-text="name"
                            item-value="id"
                            label="Categoría"
                            :rules="[(v: any) => !!v || 'Seleccione una catgoría']"

                          ></v-select>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-text-field
                            v-model="editedProduct.price"
                            label="Precio"
                            type="number"
                            :rules="[(v: any) => !!v || 'El precio es obligatorio']"
                          ></v-text-field>
                        </v-col>
                    
                      </v-row>
                    </v-container>
                  </v-form>
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
  async middleware(context) {
    // If the user is not authenticated
    const response = await fetch("https://api.escuelajs.co/api/v1/auth/profile", 
    {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    }
    ).then((response) => response.json())

    if (response.statusCode == 401) {
      return context.redirect('/login')
    } else {
      context.store.state.user = response
    }
  },
  data () {
    return {
      user: {},

      dialog: false,
      dialogDelete: false,
      categoryDialog: false,
      categoryDialogDelete: false,

      fileCategory: null,
      validCategoryForm: true,
      validProductsForm: true,

      categoryNameFilter: '',

      productsFilters: {
        title: '',
        description: '',
        category: '',
        price: '',
      },
      
      titleFilter: '',
      priceFilter: [1, 5000],
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
        { text: 'Categoría', value: 'category.name' },
        { text: 'Precio', value: 'price' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      products: [{}],
      productTableLoading: false,
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
        image: null,
        name: '',
      },
      defaultCategory: {
        id: 0,
        image: null,
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

    filteredCategories() {
      if(this.categoryNameFilter == '') return this.categories

      return this.categories.filter((category: any) => {
        console.log(category.name.toLowerCase(), this.categoryNameFilter.toLowerCase())
        return category.name.toLowerCase().includes(this.categoryNameFilter.toLowerCase());
      })
        
    },
    filteredProducts() {
      // no es el método más óptimo...

      const titleFiltered = this.productsFilters.title == '' ? this.products : this.products.filter((product) => product.title.toLowerCase().includes(this.productsFilters.title.toLowerCase()));
      const descriptionFiltered = this.productsFilters.description == '' ? titleFiltered : titleFiltered.filter((product) => product.description.toLowerCase().includes(this.productsFilters.description.toLowerCase()));
      const priceFiltered = this.productsFilters.price == '' ? descriptionFiltered : descriptionFiltered.filter((product) => product.price == this.productsFilters.price.toLowerCase());
      
      return priceFiltered
        
    }
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
      this.productTableLoading = true
      let url = new URL('https://api.escuelajs.co/api/v1/products');

      url.searchParams.set('title', this.titleFilter);
      url.searchParams.set('categoryId', this.select);
      url.searchParams.set('price_min', String(this.priceFilter[0]));
      url.searchParams.set('price_max', String(this.priceFilter[1]));
      
      const response = await fetch(url).then((response) => response.json())
      this.productTableLoading = false

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

    async handleFileUploadCategory(file: any) {
      // este código no va a ser usado porque la API de Platzi devuelve error 500 en este método
      if(file) {

        const reader = new FileReader();
        
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
          const binary = reader.result;
          
          // const response = await fetch("https://api.escuelajs.co/api/v1/files/upload",
          //   {
          //     method: 'POST',
          //     body: {
          //       file: binary
          //     }
          //   }
          // ).then((response) => response.json())

          // this.editedCategory.image = response.location
        }
      }
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

      if((this.$refs.formProducts as Vue & { validate: () => boolean }).validate() == false) {
        return
      }

      const imagen = "https://api.lorem.space/image/fashion?w=640&h=480&r=7910"
      let edit = false
      if(this.editedIndex > -1) edit = true

      if (edit) {
        const newProduct = this.editedProduct
        Object.assign(this.products[this.editedIndex], newProduct)
        await fetch('https://api.escuelajs.co/api/v1/products/'+ newProduct.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.editedProduct)
        }).then((response) => response.json())
      } else {
        const newProduct = {...this.editedProduct, categoryId: this.editedProduct.category.id, images: [imagen, imagen, imagen]}
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

      if((this.$refs.formCategory as Vue & { validate: () => boolean }).validate() == false) {
        return
      }

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

  async asyncData({ $http, store }) {
    const products = await $http.$get('https://api.escuelajs.co/api/v1/products')
    const categories = await $http.$get('https://api.escuelajs.co/api/v1/categories')
    const user = store.state.user
    return { products, categories, user }
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;800&display=swap');

.inter {
  font-family: 'Inter', sans-serif;
}
</style>
