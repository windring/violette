<template>
  <el-container id="app">
    <el-header>
      <el-menu mode="horizontal">
        <el-menu-item>首页</el-menu-item>
        <el-menu-item>登录</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="12" :offset="6">
          <el-card v-if="signload === 2">
            <el-form>
              <el-form-item>
                <el-input :autosize="{minRows: 4}" type="textarea" v-model="content"></el-input>
              </el-form-item>
              <el-form-item class="no-margin">
                <el-button @click="newpost">发布</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card v-for="(item,index) in list" :key="index" style="margin: 1em 0;">
            <div slot="header" class="lrflex">
              <avatar :username="item.nickname" :size="30"></avatar>
              <span>{{ item.nickname }}</span>
              <span
                style="color: #909399;font-size: .4em;"
              >{{ new Date(1 * item.date).toLocaleString() }}</span>
              <el-link
                type="danger"
                style="float: right;"
                v-if="isadmin"
                @click="banpostsumit(item.pid)"
              >删除</el-link>
            </div>
            {{ item.content }}
            <div class="line margin-top"></div>
            <el-row v-for="(it,ix) in item.commentlist" :key="ix" style="margin: .3em 0;">
              <el-col>
                <el-link type="primary">{{ it.nickname }}</el-link>评论
                <el-link type="primary">{{ it.tonickname }}</el-link>:
                <span>{{ it.content }}</span>
                <el-link
                  type="danger"
                  style="float: right;"
                  v-if="isadmin"
                  @click="bancommentsubmit(it.cid)"
                >删除</el-link>
                <el-link
                  type="primary"
                  @click="item.touid = it.uid; item.tonickname = it.nickname;"
                  style="float: right;"
                  v-if="signload === 2"
                >回复</el-link>
                <div
                  style="color: #909399;font-size: .4em;float: right;"
                >{{ new Date(it.date * 1).toLocaleString() }}</div>
              </el-col>
            </el-row>
            <div class="line margin-bottom"></div>
            <el-row :gutter="20" v-if="signload === 2">
              <el-col :span="19">
                <el-input :placeholder="'@' + item.tonickname" v-model="item.newcomment"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button @click="commentsubmit(item.newcomment,item.touid,item.pid)">评论</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card v-loading="!signload">
            <el-form v-if="signload === 1">
              <el-form-item label="nickname">
                <el-input v-model="nickname"></el-input>
              </el-form-item>
              <el-form-item label="password">
                <el-input v-model="password" type="password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-button @click="signup">注册</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button @click="signin">登录</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
            <div v-if="signload === 2">
              <div class="lrflex">
                <avatar :username="nickname"></avatar>
                <span>{{nickname}}</span>
              </div>
              <hr>
              <el-button @click="logout">注销</el-button>
              <el-button type="success" v-if="isadmin">管理员</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
import Avatar from "vue-avatar";
import api from "./lib/graphql";
export default {
  components: { Avatar },
  data() {
    return {
      signload: 0,
      nickname: "admin",
      password: "admin",
      content: "输入发布内容",
      list: [],
      touid: undefined,
      role: undefined
    };
  },
  computed: {
    isadmin() {
      return this.role === 0;
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
    async banpostsumit(pid) {
      const ret = await api.banpost(pid);
      if (ret.banpost === 200) {
        this.$notify({
          title: "屏蔽文章",
          message: "成功"
        });
      }
    },
    async bancommentsubmit(cid) {
      const ret = await api.bancomment(cid);
      if (ret.bancomment === 200) {
        this.$notify({
          title: "屏蔽评论",
          message: "成功"
        });
      }
    },
    async commentsubmit(content, touid, pid) {
      const ret = await api.newcomment(content, touid, pid);
      if (ret.newcomment === 200) {
        this.$notify({
          title: "评论",
          message: "评论成功"
        });
      }
    },
    async signin() {
      try {
        const ret = await api.signin(this.nickname, this.password);
        if (ret.signin.code === 1) {
          this.signload = 2;
          this.role = ret.signin.role;
        } else {
          throw ret.signin.message;
        }
      } catch (e) {
        this.$notify.error({
          title: "登录失败",
          message: e
        });
      }
    },
    async signup() {
      const ret = await api.signup(this.nickname, this.password);
      if (ret.signup.code === 1) {
        this.$notify({
          title: "注册成功",
          message: ret.signup.message
        });
      } else {
        this.$notify.error({
          title: "注册失败",
          message: <p>{ret.signup.message}</p>
        });
      }
    },
    async logout() {
      try {
        const ret = await api.logout();
        if (ret.logout.code === -1) {
          throw JSON.stringify(ret, undefined, 2);
        }
        this.signload = 1;
      } catch (e) {
        this.$notify.error({
          title: "登出失败",
          message: e
        });
      }
    },
    async newpost() {
      try {
        const ret = await api.newpost(this.content);
        this.$notify({
          title: "发布成功",
          message: "第" + ret.newpost.pid + "篇短文"
        });
      } catch (e) {
        this.$notify.error({
          title: "发布失败",
          message: e
        });
      }
    }
  },
  mounted() {
    this.$nextTick(async () => {
      const ret = await api.helloworld();
      console.log(ret);
      this.signload = 1;
      if (ret.helloworld.code === 1) {
        this.signload = 2;
        this.nickname = ret.helloworld.nickname;
        this.role = ret.helloworld.role;
      }
      const list = await api.postlist();
      this.list = list.postlist.map(i => {
        i.newcomment = "";
        i.tonickname = i.nickname;
        i.touid = i.uid;
        return i;
      });
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
header {
  padding: 0 !important;
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
.lrflex {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
span {
  margin: 0 0.4em;
}
.line {
  width: 100%;
  height: 0;
  border-top: 1px solid #eee;
}
.no-margin {
  margin: 0;
}
.margin-top {
  margin-top: 20px;
}
.margin-bottom {
  margin-bottom: 20px;
}
</style>
