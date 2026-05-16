import '@/main.ts'
import './style.css'
import { createApp } from 'vue'
import { bootstrapDirective } from '@/directives/bootstrap.ts'
import App from './App.vue'

createApp(App).directive('bs', bootstrapDirective).mount('#app')
