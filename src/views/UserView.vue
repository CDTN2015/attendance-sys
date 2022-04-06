<template>
  <div id="background">
    <div id="outer">
      <v-list id="top">
        <v-list-item>
          <v-list-item-avatar tile>
            <v-img src="@/assets/logo.svg"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              ><span id="top-title"
                >宁夏恒力祥自控工程科技服务有限公司员工考勤系统</span
              ></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <router-view></router-view>
    </div>
    <!--    右侧导航抽屉-->
    <v-navigation-drawer
      permanent
      expand-on-hover
      right
      absolute
      dark
      src="@/assets/background1.jpg"
    >
      <!--      用户信息栏-->
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="@/assets/user_avatar2.jpg"></v-img>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ user.name }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.department }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>

      <!--        三个操作面板：个人、团队、后台-->
      <v-list nav>
        <v-list-item-group v-model="selectedUserItem" mandatory>
          <v-list-item
            v-for="({ title, icon }, i) in userItems"
            :key="i"
            link
            @click="test(i)"
          >
            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="title"></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <v-divider></v-divider>
      </v-list>

      <!--        两个弹出面板：修改密码、提交申请-->
      <v-list nav>
        <v-list-item
          v-for="({ title, icon }, i) in settingItems"
          :key="i"
          @click="handle(i)"
          link
        >
          <v-list-item-icon>
            <v-icon v-text="icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="title"></v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>
      </v-list>

      <!--      退出系统-->
      <template v-slot:append>
        <v-divider></v-divider>
        <v-list nav>
          <v-list-item link @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>退出系统</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!--      弹出框-->
    <v-dialog v-model="modifyPwd" width="400" persistent>
      <ModifyPwd v-on:closeDialog="closeDialog" />
    </v-dialog>
    <v-dialog v-model="submitRequest" width="400" persistent>
      <SubmitRequest v-on:closeDialog="closeDialog" />
    </v-dialog>
  </div>
</template>

<script>
// import axios from "axios";
import router from "@/router";
import ModifyPwd from "@/components/ModifyPwd";
import SubmitRequest from "@/components/SubmitRequest";

export default {
  name: "UserView",
  data() {
    return {
      token: localStorage.getItem("Token"),
      user: {
        name: "江宇程",
        department: "技术研发部",
      },
      userItems: [
        { title: "个人考勤", icon: "mdi-account-box", route: "/personal" },
        { title: "团队考勤", icon: "mdi-account-group", route: "/employees" },
        {
          title: "申请审批",
          icon: "mdi-account-multiple-check",
          route: "/backend",
        },
      ],
      selectedUserItem: 0,
      settingItems: [
        { title: "修改密码", icon: "mdi-lock-open-alert" },
        { title: "提交申请", icon: "mdi-send-check" },
      ],
      modifyPwd: false,
      submitRequest: false,
    };
  },
  components: {
    ModifyPwd,
    SubmitRequest,
  },
  methods: {
    test(i) {
      if (this.selectedUserItem !== i) {
        router
          .push({
            path: this.userItems[i].route,
          })
          .catch((err) => {
            console.log(err, "捕获路由错误");
          });
      }
    },
    handle(i) {
      if (this.settingItems[i].title === "修改密码") {
        this.modifyPwd = true;
      } else if (this.settingItems[i].title === "提交申请") {
        this.submitRequest = true;
      }
    },
    logout() {
      localStorage.setItem("Token", "");
      router.replace({
        path: "/",
      });
    },
    closeDialog(value) {
      if (value === "ModifyPwd") {
        this.modifyPwd = false;
      } else if (value === "SubmitRequest") {
        this.submitRequest = false;
      }
    },
  },
};
</script>

<style scoped>
#background {
  background: url("../assets/background2.jpg");
  height: 100%;
  min-height: 600px;
  overflow: hidden;
}
#top {
  height: 70px;
  background-color: rgba(36, 43, 95, 0.5);
}
#top-title {
  font-size: 30px;
  letter-spacing: 5px;
  color: rgb(118, 202, 214);
  text-shadow: 0 0 5px rgb(118, 202, 214);
  /* 禁止选中 */
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
}
#outer {
  max-height: 100%;
  background-color: transparent;
}
</style>
