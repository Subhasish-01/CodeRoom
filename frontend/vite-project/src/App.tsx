import './App.css'
import { Signup } from './pages/signup'
import { Signin } from './pages/signin'
import { Home } from "./pages/Home";
import { Room } from './pages/Room';
import { Landing } from './pages/Landing';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from "./components/PublicRoute";

import {BrowserRouter,Routes,Route} from 'react-router-dom'
function App() {
 
  return (
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/signin" element={<PublicRoute><Signin /></PublicRoute>} />
        
        <Route path="/home"element={<ProtectedRoute>
          <Home />
        </ProtectedRoute>}/>
        <Route path="/room/:roomId" element={
          <ProtectedRoute>
          <Room/>
          </ProtectedRoute>}/>

       
      </Routes>
    </BrowserRouter>

  )
}

export default App
