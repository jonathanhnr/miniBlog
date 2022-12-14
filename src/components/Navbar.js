import styles from "./Navbar.module.css"

import {useAuthentication} from "../hooks/useAuthentication";

import {useAuthValue} from "../context/AuthContext";


import {NavLink} from "react-router-dom";

const Navbar = () => {

    const {user} = useAuthValue()

    const {logout} = useAuthentication()

    return (
        <nav className={styles.navbar}>
            <NavLink to="/" className={styles.brand} end>
                Mini <span>Blog</span>
            </NavLink>
            <ul className={styles.links_list}>
                <li>
                    <NavLink to="/" end className={({isActive}) => (isActive ? styles.active : "")}>
                        Home
                    </NavLink>
                </li>
                {!user && (
                    <>
                        <li>
                            <NavLink to="/register" end className={({isActive}) => (isActive ? styles.active : "")}>
                                Cadastrar
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/login" end className={({isActive}) => (isActive ? styles.active : "")}>
                                Entrar
                            </NavLink>
                        </li>
                    </>
                )}
                {user && (
                    <>
                        <li>
                            <NavLink to="/posts/create" end className={({isActive}) => (isActive ? styles.active : "")}>
                                Novo post
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard" end className={({isActive}) => (isActive ? styles.active : "")}>
                                Dashboard
                            </NavLink>
                        </li>
                    </>
                )}
                <li>
                    <NavLink to="/about" end className={({isActive}) => (isActive ? styles.active : "")}>
                        Sobre
                    </NavLink>
                </li>
                {user && (
                    <li>
                        <button onClick={logout}>Sair</button>
                    </li>
                )}
            </ul>
        </nav>
    )
}
export default Navbar;