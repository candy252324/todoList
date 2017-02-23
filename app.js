import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'SHrBqgJHc7P6f6tu4VjoK5mL-gzGzoHsz';
var APP_KEY = 'w92qDIpeyODwiROm1Ad5c12D';
// 初始化
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

// 验证 LeanCloud SDK 安装成功
// var TestObject = AV.Object.extend('TestObject');
// var testObject = new TestObject();
// testObject.save({
//   words: 'Hello World!'
// }).then(function(object) {
//   console.log('LeanCloud Rocks!');
// })


var app = new Vue({
    el: '#app',
    data: {
        actionType: 'signUp',
        formData: {
            username: '',
            password: ''
        },
        newTodo: '',
        todoList: [],   // [{"title":"逛街","createdAt":"2017-02-7 21:01:44","done":false},{"title":"吃饭","createdAt":"2017-02-7 21:03:55","done":false}]
        currentUser: null,
    },

    created: function(){
        this.currentUser = this.getCurrentUser();
        this.fetchTodos();
    },
    methods: {
        //fetchTodos函数用于读取todoList
        fetchTodos:function(){
            if(this.currentUser){
                var query = new AV.Query('AllTodos');
                query.find()
                   .then((todos) => {
                    //console.log(todos)   //是一个数组，因为每次添加或删除todo都会生成一个新的AllTodos
                    let avAllTodos = todos[0] // 因为理论上 AllTodos 只有一个，所以我们取结果的第一项
                    let id = avAllTodos.id
                    this.todoList = JSON.parse(avAllTodos.attributes.content) 
                    this.todoList.id = id // 给 todoList 这个数组对象设置 id属性
                }, function(error){
                    console.error(error) 
                })
            }
        },
        updateTodos: function(){
            // 如何更新对象，https://leancloud.cn/docs/leanstorage_guide-js.html#更新对象
            let dataString = JSON.stringify(this.todoList) 
            let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
            avTodos.set('content', dataString)
            // console.log(avTodos.attributes.content)  //即todoList
            avTodos.save().then(()=>{
                console.log('更新成功')
            })
        },
        saveTodos: function(){
            let dataString = JSON.stringify(this.todoList)
            var AVTodos = AV.Object.extend('AllTodos');
            var avTodos = new AVTodos();
             // 新建一个 ACL 实例
            var acl = new AV.ACL()
            acl.setReadAccess(AV.User.current(),true) // 只有这个 user 能读
            acl.setWriteAccess(AV.User.current(),true) // 只有这个 user 能写
            // 将 ACL 实例赋予 avTodos 对象
            avTodos.set('content', dataString);
            avTodos.setACL(acl) // 设置访问控制
            avTodos.save().then((todo) =>{
                // console.log(todo)  //打印的是一个新用户第一次添加的todo
            this.todoList.id = todo.id  // 把 id 挂到 this.todoList 上，否则下次就不会调用 updateTodos 了
                console.log('保存成功');
            }, function (error) {
                console.log('保存失败');
            });
          },
        saveOrUpdateTodos: function(){
            if(this.todoList.id){
                this.updateTodos()
            }else{
                this.saveTodos()
            }
          },
        addTodo: function(){
            var date=new Date();
            var year=date.getFullYear(),
                month=parseInt(date.getMonth()+1),
                day=date.getDate(),
                hours=date.getHours(),
                min=date.getMinutes(),
                sec=date.getSeconds();
            var time=year+"-"
                +(month<10?"0":"")+month+"-"
                +(date<10?"0":"")+day+" "
                +(hours<10?"0":"")+hours+":"
                +(min<10?"0":"")+min+":"
                +(sec<10?"0":"")+sec;
            this.todoList.push({
                title: this.newTodo,
                createdAt:time,
                done: false 
            })
            this.newTodo = ''
            this.saveOrUpdateTodos() 
        },
        removeTodo: function(todo){
            let index = this.todoList.indexOf(todo) 
            this.todoList.splice(index,1) 
            this.saveOrUpdateTodos() 
        },
        signUp: function () {
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) =>{  //将 function 改成箭头函数，方便使用 this
                   
                     this.currentUser = this.getCurrentUser()
                }, function (error) {
                    alert("注册失败")
            });
        },
        login: function () {
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) =>{
                // console.log(loginedUser);
                 this.currentUser = this.getCurrentUser()
                 this.fetchTodos() // 登录成功后读取 todos
            }, function (error) {
                alert("登陆失败")
            });
        },
        getCurrentUser: function () { 
            //AV.User.current() 可以获取当前登录的用户,attributes 是我们传给数据库的 username
            //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
            let current = AV.User.current()
            if (current) {
                let {id, createdAt, attributes: {username}} = current
                return {id, username, createdAt} 
            } else {
                return null
            }
        },
        logout: function () {
            AV.User.logOut()
            this.currentUser = null
            window.location.reload()
        }

    },


   

})