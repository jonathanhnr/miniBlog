import styles from './Dashboard.module.css'
import {Navigate} from "react-router-dom";

import {Link} from "react-router-dom";

import {useAuthValue} from "../../context/AuthContext";
import {useFetchDocuments} from "../../hooks/useFetchDocuments";
import {useDeleteDocument} from "../../hooks/useDeleteDocuments";

const Dashboard = () => {


    const {user} = useAuthValue()
    const uid = user.uid


    const {documents: posts, loading} = useFetchDocuments("posts", null, uid)

    const {deleteDocument} = useDeleteDocument("posts")

    const auth = useAuthValue()

    if (!auth.user) {
        return <Navigate to='/login'/>
    }


    if(loading){
        return <p>Carregando...</p>
    }


    return (
        <div className={styles.dashboard}>
            <h2>dashboard</h2>
            <p>Gerencie seus posts!</p>
            {posts && posts.length === 0 ? (
                <div className={styles.noposts}>
                    <p>Não foram encontrados posts!</p>
                    <Link to="/posts/create" className="btn">
                        Criar primeiro post
                    </Link>
                </div>
            ) : (
                <>
                    <div className={styles.post_header}>
                        <span>Titulo</span>
                        <span>Ações</span>
                    </div>
                    {posts && posts.map((post) => (
                        <div key={post.id} className={styles.post_row}>
                            <p>{post.title}</p>
                            <div>
                            <Link to={`/posts/${post.id}`} className="btn btn-outline">ver</Link>
                                <Link to={`/posts/edit/${post.id}`} className="btn btn-outline">
                                    Editar
                                </Link>
                                <button onClick={() => deleteDocument(post.id)} className="btn btn-outline btn-danger">Excluir</button>
                            </div>
                        </div>
                    ))}
                </>
            )}


        </div>
    )
}
export default Dashboard;