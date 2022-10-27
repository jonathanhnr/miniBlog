import './App.css';


import {BrowserRouter, Routes, Route,Navigate} from "react-router-dom";
import {onAuthStateChanged} from 'firebase/auth'

//import hooks
import {useState,useEffect} from "react";
import {useAuthentication} from "./hooks/useAuthentication";

//context
import {AuthProvider} from "./context/AuthContext";

//IMPORT COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";



//IMPORT PAGES
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Login from "./pages/login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashbord";
import CreatePost from "./pages/CreatePost/CreatePost";
import Search from "./pages/Search/Search";
import Post from "./pages/Post/Post";
import EditPost from "./pages/EditPost/EditPost";


function App() {

    const [user,setUser] = useState(undefined)
    const {auth}= useAuthentication()

    const loadingUser = user === undefined

    useEffect(()=>{
        onAuthStateChanged(auth,(user) =>{
            setUser(user)
        })
    },[auth])

    if(loadingUser){
        return <p>Carregando...</p>
    }

    return (
        <div className="App">
            <AuthProvider value={{user}}>
                <BrowserRouter>
                    <Navbar/>
                    <div className="container">
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/about" element={<About/>}/>
                            <Route path="/search" element={<Search/>}/>
                            <Route path="/posts/:id" element={<Post/>}/>
                            <Route path="/posts/edit/:id" element={<EditPost/>}/>
                            <Route path="/login" element={ <Login/> }/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/posts/create" element={<CreatePost/>}/>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                        </Routes>
                    </div>
                    <Footer/>
                </BrowserRouter>
            </AuthProvider>
        </div>
    );
}

export default App;
