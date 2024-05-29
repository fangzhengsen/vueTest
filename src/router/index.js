import { createRouter, createWebHashHistory } from "vue-router";
import pagesRouters from "./page/index";
import viewsRouters from   "./view/index";

const router = createRouter({ 
  history: createWebHashHistory(),  
  routes: [ 
    ...pagesRouters, 
    ...viewsRouters
  ] 
});

//识别不匹配的路由，并重定向到404页面
router.addRoute({
  path: '/:pathMatch(.*)*',
  redirect: '/404'
})

export default router;