import styles from"./Login.module.css"
import {useAuthValue} from "../../context/AuthContext";
import {Navigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuthentication} from "../../hooks/useAuthentication";


const Login = () =>{
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const[error,setError] = useState("")

    const {login, error: authError,loading } = useAuthentication();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        const user= {
            email,
            password
        }

        const res = await login(user)

        console.log(res)
    }

    useEffect(()=>{
        if (authError){
            setError(authError)
        }
    },[authError])

    const auth = useAuthValue()


    console.log(auth)

    if(!!auth.user ){
        return <Navigate to ='/'/>
    }



    return(
        <div className={styles.login}>
            <h1>Entrar</h1>
            <p>Faca o login para utilizar o sistema</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>E-mail:</span>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="E-mail do usuario"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                </label>
                <label>
                    <span>Senha:</span>
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Insira sua senha:"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                </label>
                {!loading && <button className="btn">Entrar</button>}
                {loading && <button className="btn" desabled >Aguarde...</button>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}
export default Login;