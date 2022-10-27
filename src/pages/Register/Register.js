import styles from"./Register.module.css"

import {useState,useEffect} from "react";
import {useAuthentication} from "../../hooks/useAuthentication";
import {useAuthValue} from "../../context/AuthContext";
import {Navigate} from "react-router-dom";


const Register = () =>{
    const [displayName,setDisplayName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const[confirmPassword,setConfirmPassword] = useState("")
    const[error,setError] = useState("")

    const auth = useAuthValue()


    const {createUser, error: authError,loading } = useAuthentication();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        const user= {
            displayName,
            email,
            password
        }

        if (password !== confirmPassword){
            setError("As senhas precisam ser iguais!")
            return
        }

        const res = await createUser(user)

        console.log(res)
    }

    useEffect(()=>{
        if (authError){
        setError(authError)
        }
    },[authError])

    if(!!auth.user ){
        return <Navigate to ='/'/>
    }

    return(
        <div className={styles.register}>
            <h1>Cadastre-se para postar</h1>
            <p>Crie seu usuario e compartilhe suas historias</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Nome:</span>
                    <input
                        type="text"
                        name="displayName"
                        required
                        placeholder="Nome do usuario"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}/>
                </label>
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
                <label>
                    <span>Confirme sua senha:</span>
                    <input
                        type="password"
                        name="Confirme sua senha "
                        required
                        placeholder="Confirme sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}/>
                </label>
                {!loading && <button className="btn">Cadastrar</button>}
                {loading && <button className="btn" desabled >Aguarde...</button>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}
export default Register;