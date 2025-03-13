import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'
import Signup from './components/Signup.jsx'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Login } from './components/index.js'
import AddPost from './pages/AddPost.jsx'
import AllPosts from './pages/AllPosts.jsx'
import EditPost from './pages/EditPost.jsx'
import Home from './pages/Home.jsx'
import Post from './pages/Post.jsx'



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            element: (
                // <AuthLayout authentication={false}>
                    <Login />
                // </AuthLayout>
            ),
        },
        {
            path: "/signup",
            element: (
              //   <AuthLayout authentication={false}>
                    <Signup></Signup>
              //   </AuthLayout>
            ),
        },
        
        {
            path: "/all-posts",
            element: (
                // <AuthLayout authentication>
                //     {" "}
                    <AllPosts />
                // </AuthLayout>
            ),
        },
        {
            path: "/add-post",
            element: (
                // <AuthLayout authentication>
                    // {" "} 
                    <AddPost></AddPost>
                // </AuthLayout>
            ),
        },
        {
            path: "/edit-post/:slug",
            element: (
                // <AuthLayout authentication>
                //     {" "}
                    <EditPost />
                // </AuthLayout>
            ),
        },
        {
            path: "/post/:slug",
            element: <Post />,
        },
    ],
},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
