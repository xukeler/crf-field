<template>
  <div class="login-body">
    <div class="login-inner flex-row">
      <div class="inner login-swiper">
        <h1>CRF配置工具</h1>
        <h2>标准字段库设置，项目CRF配置</h2>
      </div>
      <div class="inner login-form">
        <h2>登录</h2>
        <div class="form-control_item">
          <span class="text">帐号</span>
          <a-input @change="valCg" v-model="loginData.loginName" type="text" placeholder="请输入账号"></a-input>
        </div>
        <div class="form-control_item">
          <span class="text">密码</span>
          <a-input @change="valCg" v-model="loginData.code" type="password" placeholder="请输入密码" @pressEnter="sumbit">
          </a-input>
        </div>
        <!-- btn-active -->
        <a-button type="primary" class="btn" :class="{'btn-active':btnActive}" @click="sumbit">登录</a-button>
        <div class="btn-spec">忘记密码？</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    beforeCreate() {
      if (window.localStorage["logintoken"]) {
        this.$router.push("/home/crf");
      }
    },
    data() {
      return {
        loginData: {
          loginName: "",
          code: "", //密码
          usingpwd: "1", //1密码 2验证码
          sysId: "8",
          device: "web",
          usingpwd: 1,
        },
        btnActive: false
      };
    },
    components: {},
    methods: {
      valCg() {
        if (this.loginData.loginName && this.loginData.code) {
          this.btnActive = true;
        } else {
          this.btnActive = false;
        }
      },
      sumbit() {
        if (this.btnActive) {
          window.localStorage["logintoken"] = "";
          window.localStorage.removeItem("token"); // 用户名密码错误重新登录时先清空token
          let params = {
            grant_type: "client_credentials",
            client_id: "91trial",
            client_Secret: "vboWpBGzP6sdoM8wIf9ceLXU4cpyyTacjpKx-5dNI1y7_U1RqN5UhDBpY-_9rSygY0BIQXK7AVSYCkvpg0vu8yCy1lEGl6bEJyfVkLcZ2oLaGy9N8jaSNkvuUUR4U866PW-u2Q2k9SscHBGcS5AALMjsAXLwlaDZaXrrOwcOSIRQkqKw6GrKuIX7HfVM2BZs8_K5ihna8AsX87jIC-EhEw"
          };
          window.sessionStorage.setItem("qs", "1");
          this.$api.login.getCode(params).then(res => {
            console.log(res)
            let access_token = res.access_token;
            let token_type = res.token_type;
            let token = token_type + " " + access_token;
            // window.sessionStorage.setItem("token", token);
            window.localStorage.setItem("token", token);
            let _params = this.loginData;
            window.sessionStorage.setItem("qs", "1");
            this.$api.login.login(_params).then(res => {
              if (res.Result == 1) {
                window.localStorage["logintoken"] = res.Data;
                this.$router.push({
                  name: "CrfHome"
                });
              }
            });
          });
        }
      }
    }
  };
</script>

<style lang="scss">
</style>