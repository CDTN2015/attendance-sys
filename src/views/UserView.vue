<template>
  <div id="background">
    <v-card id="outer">
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

        <v-list-item> </v-list-item>
      </v-list>
      <router-view></router-view>
    </v-card>
    <v-navigation-drawer
      permanent
      expand-on-hover
      right
      absolute
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
      <v-list nav dense>
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
      <v-list nav dense>
        <v-list-item-group no-action>
          <v-list-item
            v-for="({ title, icon }, i) in settingItems"
            :key="i"
            @click="handle(i)"
          >
            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="title"></v-list-item-title>
          </v-list-item>
        </v-list-item-group>

        <v-divider></v-divider>
      </v-list>

      <v-dialog v-model="dialog" width="500">
        <!--              <template v-slot:activator="{ on, attrs }">-->
        <!--                <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">-->
        <!--                  Click Me-->
        <!--                </v-btn>-->
        <!--              </template>-->

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Privacy Policy
          </v-card-title>

          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              I accept
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--      退出系统-->
      <template v-slot:append>
        <v-divider></v-divider>
        <v-list nav dense>
          <v-list-item link @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>退出系统</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
// import axios from "axios";
import router from "@/router";

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
      dialog: false,
    };
  },
  methods: {
    test(i) {
      if (this.selectedItem !== i) {
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
      console.log(i);
      this.dialog = true;
    },
    logout() {
      localStorage.setItem("Token", "");
      router.replace({
        path: "/",
      });
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
