<template>
  <v-responsive>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      :search="search"
      item-key="uid"
      :loading="loading"
      loading-text="Loading... Please wait."
      :options.sync="options"
      :server-items-length="totalCount"
      show-select>
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog class="mx-1" v-model="dialog" max-width="500px">
            <template v-slot:activator="{on}">
              <v-btn color="primary" v-on="on">添加员工</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{formTitle}}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form
                    ref="form"
                    v-model="valid">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.uid"
                        label="工号"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.name"
                        :rules="rules.name"
                        label="姓名"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="editedItem.department"
                        :items="departments"
                        item-text="name"
                        item-value="id"
                        :rules="rules.department"
                        label="部门"
                        return-object
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="editedItem.position"
                        :items="positions"
                        item-text="name"
                        item-value="id"
                        :rules="rules.position"
                        label="职位"
                        return-object
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                <v-btn color="blue darken-1" text @click="save" :disabled="!valid">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

              <v-btn class="mx-1" color="error">删除选定员工</v-btn>
              <v-btn class="mx-1" color="teal">Excel 导入</v-btn>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="搜索"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{item}">
        <v-icon small @click="editItem(item)" class="mr-2">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)" class="mr-2">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-responsive>
</template>

<script>
export default {
  name: "EmployeeManage",
  data () {
      return {
        dialog:false,
        valid:true,
        loading:false,
        search:"",
        options: {},
        totalCount:0,
        selected:[],
        headers: [
          {
            text: '工号',
            align: 'start',
            value: 'uid'
          },
          {text:'姓名',value:'name'},
          {text:'部门',value:'department.name'},
          {text:'职位',value:'position.name'},
          {text:'操作',value:'actions'}
        ],
        items:[],
        editedIndex: -1,
        editedItem:{
          uid: 0,
          name: "",
          department:null,
          position:null
        },
        defaultItem:{
          uid: 0,
          name: "",
          department:null,
          position:null
        },
        departments:[
          {id: 1, name:"销售部"},
          {id:2,name:"售后部"},
          {id:3,name:"维修部"}
        ],
        rules:{
          "name":[v=>!!v || "请输入姓名"],
          "department":[v=>!!v || "请选择部门"],
          "position":[v=>!!v || "请选择职位"]
        }
      }
    },
  computed: {
    formTitle(){
      return this.editedIndex === -1?"新增员工":"编辑员工";
    },
    positions(){
      if(this.$store.getters.userType === 1)
        return [
          {name:"部门主管",id:2},
          {name:"员工",id:3}
        ];
      else
        //TODO: restrict condition when login module works
        return [
          {name:"员工",id:3}
        ];
    }
  },
  watch: {
    options:{
      handler(){
        this.getDataFromApi()
          .then(data =>{
            this.items = data.items;
            this.totalCount = data.count;
          });
      }
    },
    deep:true,
    dialog (val){
      val || this.close();
    }
  },
  mounted() {
    this.getDataFromApi()
      .then(data =>{
        this.items = data.items;
        this.totalCount = data.count;
      });
  },
  methods:{
    getDataFromApi(){
      this.loading = true;
      return new Promise((resolve,reject)=>{
        const {sortBy, sortDesc, page, itemsPerPage} = this.options;

        let items = this.getItems();
        const count = items.length;

        if (sortBy.length === 1 && sortDesc.length === 1) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy[0]]
            const sortB = b[sortBy[0]]

            if (sortDesc[0]) {
              if (sortA < sortB) return 1
              if (sortA > sortB) return -1
              return 0
            } else {
              if (sortA < sortB) return -1
              if (sortA > sortB) return 1
              return 0
            }
          })
        }

        if (itemsPerPage > 0) {
          items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
        }

        setTimeout(() => {
          this.loading = false
          resolve({
            items,
            count,
          })
        }, 1000);
      });
    },
    getItems(){
      return [
        {
          uid:1,
          name:"Alex",
          department:{
            "id": 1,
            "name": "销售部"
          },
          position:{
            "id": 3,
            "name": "员工"
          }
        },
        {
          uid:2,
          name:"Bob",
          department:{
            "id": 1,
            "name": "销售部"
          },
          position:{
            "id": 3,
            "name": "员工"
          }
        },
        {
          uid:3,
          name:"Celia",
          department:{
            "id": 1,
            "name": "销售部"
          },
          position:{
            "id": 3,
            "name": "员工"
          }
        },
        {
          uid:4,
          name:"David",
          department:{
            "id": 1,
            "name": "销售部"
          },
          position:{
            "id": 3,
            "name": "员工"
          }
        },
        {
          uid:5,
          name:"Ella",
          department:{
            "id": 1,
            "name": "销售部"
          },
          position:{
            "id": 3,
            "name": "员工"
          }
        },
        {
          uid:6,
          name:"Ford",
          department:{
            "id": 1,
            "name": "销售部"
          },
          position:{
            "id": 3,
            "name": "员工"
          }
        },
        {
          uid:7,
          name:"Gaussian",
          department:{
            "id": 1,
            "name": "销售部"
          },
          position:{
            "id": 3,
            "name": "员工"
          }
        },
        {
          uid:8,
          name:"Helen",
          department:{
            "id": 1,
            "name": "销售部"
          },
          position:{
            "id": 3,
            "name": "员工"
          }
        },
        {
          uid:9,
          name:"Ivan",
          department:{
            "id": 1,
            "name": "销售部"
          },
          position:{
            "id": 3,
            "name": "员工"
          }
        },
        {
          uid:10,
          name:"Jessica",
          department:{
            "id": 1,
            "name": "销售部"
          },
          position:{
            "id": 3,
            "name": "员工"
          }
        },
        {
          uid:11,
          name:"Kevin",
          department:{
            "id": 1,
            "name": "销售部"
          },
          position:{
            "id": 3,
            "name": "员工"
          }
        }
      ]
    },
    editItem (item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem (item) {
      const index = this.items.indexOf(item);
      confirm('Are you sure you want to delete this item?') && this.items.splice(index, 1);
    },
    close () {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        this.items.push(this.editedItem);
      }
      this.close();
    }

  }
};
</script>

<style scoped></style>
