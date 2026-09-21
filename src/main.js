import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { store } from './store' // Import the store
import scrollReveal from './directives/scrollReveal'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

// 1. Initialize the Global Log Listener (So charts work immediately)
store.initLogListener();

app.use(router)

// 2. TRACK EVERY PAGE VIEW (Guests + Users)
router.afterEach((to) => {
    // We removed the 'if (store.user)' check. Now it tracks everyone.
    store.trackActivity(
        "Page View", 
        `Viewed: ${to.name || to.path}`
    );
});

app.directive('scroll-reveal', scrollReveal)

app.mount('#app')

// ---  END ---