<template>
  <el-container id="app">
    <el-header>
      <el-menu mode="horizontal">
        <el-menu-item>首页</el-menu-item>
        <el-menu-item>登录</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="12" :offset="6">
          <el-form>
            <el-form-item>
              <el-input :autosize="{minRows: 4}" type="textarea" v-model="content"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="newpost">发布</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="5" :offset="19">
          <el-card v-loading="!signload">
            <el-form v-if="signload === 1">
              <el-form-item label="nickname">
                <el-input v-model="nickname"></el-input>
              </el-form-item>
              <el-form-item label="password">
                <el-input v-model="password" type="password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="signup">注册</el-button>
                <el-button @click="signin">登录</el-button>
              </el-form-item>
            </el-form>
            <div v-if="signload === 2">
              <span>{{nickname}}</span><hr>
              <el-button @click="logout">注销</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
import api from "./lib/graphql";
export default {
  data () {
    return {
      signload: 0,
      nickname: 'admin',
      password: 'admin',
      content: '输入发布内容'
    }
  },
  methods: {
    startHacking() {
      this.$notify({
        title: "It works!",
        type: "success",
        message:
          "We've laid the ground work for you. It's time for you to build something epic!",
        duration: 5000
      });
    },
    async signin () {
      try {
      const ret = await api.signin(this.nickname, this.password)
      if (ret.signin.code === 1) {
        this.signload = 2
      } else {
        throw ret.signin.message
      }
      } catch (e) {
        this.$notify.error({
          title: '登录失败',
          message: e
        })
      }
    },
    async signup () {
      const ret = await api.signup(this.nickname, this.password)
      if (ret.signup.code === 1) {
        this.$notify({
          title: '注册成功',
          message: ret.signup.message
        })
      } else {
        this.$notify.error({
          title: '注册失败',
          message: <p>{ret.signup.message}</p>,
        })
      }
    },
    async logout () {
      try{
        const ret = await api.logout()
        if (ret.logout.code === -1) {
          throw JSON.stringify(ret, undefined, 2);
        }
        this.signload = 1
      } catch (e) {
        this.$notify.error({
          title: '登出失败',
          message: e
        })
      }
    },
    async newpost () {
      try {
        const ret = await api.newpost(this.content)
        this.$notify({
          title: '发布成功',
          message: '第' + ret.newpost.pid + '篇短文'
        })
      }catch(e) {
        this.$notify.error({
          title: '发布失败',
          message: e
        })
      }
    }
  },
  mounted() {
    this.$nextTick(async () => {
      const ret = await api.helloworld()
      console.log(ret)
      this.signload = 1
      if (ret.helloworld.code === 1) {
        this.signload = 2
      }
      const list = await api.postlist()
      console.log(list)
    });
  }
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: left;
  word-break: break-all;
  word-wrap: break-word;
}
#app {
  font-family: Helvetica, sans-serif;
}
.right {
  float: right;
}
hr {
  border: none;
  background: #ccc;
  height: 1px;
}
</style>
