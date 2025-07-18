import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Createjob from './components/Createjob.jsx'
import Applying from './components/Applying.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import YourPost from './components/YourPost.jsx'
import InterviewApp from './components/Chatbot.jsx'
import AdminPanel from './components/AdminPanel.jsx'

const routes = createBrowserRouter([
  {
    element: <App />,
    path: "/"
  },
  {
    element:<Createjob/>,
    path: "/create-job"
  },
  {
    element: <Applying/>,
    path: "/apply-for-job"
  },
  {
    element:<YourPost/>,
    path: "/your-post"
  },
  {
    element: <InterviewApp/>,
    path: "/interview"
  },
  {
    element: <AdminPanel/>,
    path: "/admin-panel"
  }
])

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
    <RouterProvider router={routes}/>
    </ClerkProvider>
  </StrictMode>,
)
