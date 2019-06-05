<template>
  <el-container id="app">
    <el-header>
      <el-menu mode="horizontal">
        <el-menu-item>首页</el-menu-item>
        <el-menu-item @click="about">关于</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="24" :md="6">
          <el-card v-loading="!signload" class="margin">
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
        <el-col :span="24" :md="12">
          <el-card v-if="signload === 2" class="margin">
            <el-form>
              <el-form-item>
                <el-input :autosize="{minRows: 4}" type="textarea" v-model="content" placeholder="输入发布内容"></el-input>
              </el-form-item>
              <el-form-item class="no-margin">
                <el-button @click="newpost">发布</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card v-for="(item,index) in list" :key="index" class="margin">
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
            <div class="markdown-body" v-html="md.render(item.content)"></div>
            <div class="line margin-top"></div>
            <i
              class="el-icon-caret-top"
              :class="{'light': item.likelist.indexOf(uid) !== -1}"
              @click="submitlikepost(item.pid, 1)"
            >{{ item.likelist.length }}</i>
            <i
              class="el-icon-caret-bottom"
              :class="{'light': item.dislikelist.indexOf(uid) !== -1}"
              @click="submitlikepost(item.pid, -1)"
            >{{ item.dislikelist.length }}</i>
            <div class="line"></div>
            <el-row v-for="(it,ix) in item.commentlist" :key="ix" style="margin: .3em 0;">
              <el-col class="lrflex">
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
                <i
                  class="el-icon-caret-top r"
                  :class="{'light': it.likelist.indexOf(uid) !== -1}"
                  @click="submitlikecomment(it.cid, 1)"
                >{{ it.likelist.length }}</i>
                <i
                  class="el-icon-caret-bottom r"
                  :class="{'light': it.dislikelist.indexOf(uid) !== -1}"
                  @click="submitlikecomment(it.cid, -1)"
                >{{ it.dislikelist.length }}</i>
                <div
                  style="color: #909399;font-size: .4em;float: right;"
                >{{ new Date(it.date * 1).toLocaleString() }}</div>
              </el-col>
            </el-row>
            <div class="line margin-bottom"></div>
            <el-row :gutter="20" v-if="signload === 2">
              <el-col :span="24" :md="19">
                <el-input class="margin" :placeholder="'@' + item.tonickname" v-model="item.newcomment"></el-input>
              </el-col>
              <el-col :span="24" :md="5">
                <el-button class="margin" @click="commentsubmit(item.newcomment,item.touid,item.pid)">评论</el-button>
              </el-col>
            </el-row>
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
import MarkdownIt from 'markdown-it';
export default {
  components: { Avatar },
  data() {
    return {
      signload: 0,
      nickname: "admin",
      password: "admin",
      content: "",
      list: [],
      uid: undefined,
      touid: undefined,
      role: undefined,
      api: undefined,
      md: undefined,
    };
  },
  computed: {
    isadmin() {
      return this.role === 0;
    }
  },
  methods: {
    about () {
      this.$alert('\
        <h3>Lightweight Content Publishing System</h3>\
        <h3>轻量级的内容发布系统</h3>\
        <p>star me! <a href="https://github.com/windring/violette" target="_blank">https://github.com/windring/violette</a></p>\
        <p>给我星星！戳这里👉<a href="https://github.com/windring/violette" target="_blank">https://github.com/windring/violette</a></p>\
        <p>what to do here? Post, comment, and express your views.</p>\
        <p>我能做什么？发布内容，评论，表达我的看法。</p>\
        <i>author: baitieyi@163.com</i>\
        <br>\
        <i>org: acliusBackHome</i>\
        ', 'violette', {
          dangerouslyUseHTMLString: true
        });
    },
    async submitlikepost (pid, ati) {
      await api.likepost(pid, ati);
      this.fresh();
    },
    async submitlikecomment (pid, ati) {
      await api.likecomment(pid, ati);
      this.fresh();
    },
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
        this.fresh();
      }
    },
    async bancommentsubmit(cid) {
      const ret = await api.bancomment(cid);
      if (ret.bancomment === 200) {
        this.$notify({
          title: "屏蔽评论",
          message: "成功"
        });
        this.fresh();
      }
    },
    async commentsubmit(content, touid, pid) {
      const ret = await api.newcomment(content, touid, pid);
      if (ret.newcomment === 200) {
        this.$notify({
          title: "评论",
          message: "评论成功"
        });
        this.fresh();
      }
    },
    async signin() {
      try {
        const ret = await api.signin(this.nickname, this.password);
        if (ret.signin.code === 1) {
          this.signload = 2;
          this.role = ret.signin.role;
          this.nickname = ret.signin.nickname;
          this.uid = Number(ret.signin.uid);
          this.fresh();
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
        this.role = undefined;
        this.fresh();
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
        this.fresh();
      } catch (e) {
        this.$notify.error({
          title: "发布失败",
          message: e
        });
      }
    },
    async fresh() {
      const list = await api.postlist();
      this.list = list.postlist.map(i => {
        i.newcomment = "";
        i.tonickname = i.nickname;
        i.touid = i.uid;
        return i;
      });
    }
  },
  mounted() {
    this.$nextTick(async () => {
      this.md = new MarkdownIt({
        html: true
      });
      const ret = await api.helloworld();
      this.api = api;
      this.signload = 1;
      if (ret.helloworld.code === 1) {
        this.signload = 2;
        this.nickname = ret.helloworld.nickname;
        this.uid = Number(ret.helloworld.uid);
        this.role = ret.helloworld.role;
      }
      this.fresh();
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
i {
  margin: 0.3em .4em;
  cursor: pointer;
}
i.light {
  color: #409eff;
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
  flex-wrap: wrap;
}
span {
  margin: 0 0.4em;
}
.line {
  width: 100%;
  height: 0;
  border-top: 1px solid #eee;
}
.r {
  float: right;
}
.margin {
  margin: 1em 0;
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
