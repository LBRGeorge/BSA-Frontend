import React from 'react'

// Available views
import Auth from '../views/Auth'
import Home from '../views/Home'
import Category from '../views/Category'
import Brand from '../views/Brand'
import Product from '../views/Product'

// Menu items icons
import { DashboardOutlined, CodeSandboxOutlined, HddOutlined, TagOutlined } from '@ant-design/icons'

// Routes
const routes = [
  {
    path: ['/login', '/register'],
    exact: false,
    isPrivate: false,
    name: 'BSA - Authentication',
    component: Auth
  },
  {
    path: '/',
    exact: true,
    isPrivate: true,
    name: 'BSA - Home',
    component: Home
  },
  {
    path: '/categories/:categoryId?',
    exact: true,
    isPrivate: true,
    name: 'BSA - Categories',
    component: Category
  },
  {
    path: '/brands/:brandId?',
    exact: true,
    isPrivate: true,
    name: 'BSA - Brands',
    component: Brand
  },
  {
    path: '/products/:productId?',
    exact: true,
    isPrivate: true,
    name: 'BSA - Products',
    component: Product
  },
]

// Menu items
export const MenuItems = [
  {
    path: '/',
    name: 'Dashboard',
    icon: <DashboardOutlined />
  },
  {
    path: '/products',
    name: 'Products',
    icon: <CodeSandboxOutlined />
  },
  {
    path: '/categories',
    name: 'Categories',
    icon: <HddOutlined />
  },
  {
    path: '/brands',
    name: 'Brands',
    icon: <TagOutlined />
  }
]

export default routes
