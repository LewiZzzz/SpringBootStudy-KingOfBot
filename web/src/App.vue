<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
          @select="handleSelect">
          <el-menu-item index="0">
            EVOSPACE
          </el-menu-item>
          <el-menu-item index="/pk/">对战</el-menu-item>
          <el-menu-item index="/record/">对局记录</el-menu-item>
          <el-menu-item index="/ranklist/">排行榜</el-menu-item>
          <div class="flex-grow" />
          <el-sub-menu>
            <template #title>Workspace</template>
            <el-menu-item index="/bot/">我的Bot</el-menu-item>
            <el-menu-item index="2-2">退出</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <footer class="footer">
          <div class="align-center">
            <div>
              <el-row>
                <el-link type="info" class="me-2" href="https://github.com/LewiZzzz/SpringBootStudy-KingOfBot">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github"
                    viewBox="0 0 16 16">
                    <path
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </el-link>
                <el-link type="info">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-envelope-fill" viewBox="0 0 16 16">
                    <path
                      d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                  </svg>
                </el-link>
              </el-row>
            </div>
            <hr>
            <div>
              <span class="footer-text">Copyright © 2024 Lewiz. All rights reserved.</span>
            </div>
            <div>
              <span class="footer-text">Powered by Vue 3, Element Plus, and Springboot</span>
            </div>
          </div>
        </footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { ref } from 'vue'
import router from '@/router'
import ElementPlus from 'element-plus'

export default {
  name: "App",
  setup() {
    const activeIndex = ref('1');
    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath);
      router.push(key);
    };
    return {
      handleSelect,
      activeIndex,
      ElementPlus
    }
  },
}

</script>

<style>
.flex-grow {
  flex-grow: 1;
}

.el-main {
  background-color: #ffffff;
}

.footer {
  height: 50px;
}

.footer-text {
  text-align: center;
  color: #AAACB1;
}

hr {
  width: 80%;
  margin: 10px auto;
  height: 1px;
  background-image: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgb(218, 221, 226),
      rgba(0, 0, 0, 0));
}

.align-center {
  display: flex;
  flex-direction: column;
  /* 设置为列布局 */
  align-items: center;
  /* 水平居中对齐 */
  justify-content: center;
  /* 垂直居中对齐 */
}

.align-center>div {
  text-align: center;
  /* 水平居中对齐内部元素 */
}

.el-link {
  margin-right: 8px;
}
</style>