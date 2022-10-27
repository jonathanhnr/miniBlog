import styles from './CreatePost.module.css'
import {useAuthValue} from "../../context/AuthContext";
import {useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {useInsertDocument} from "../../hooks/useInsertDocument";
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {storage} from "../../firebase/config";

const uploadImage = file => {
    if (!file) return

    const storageRef = ref(storage, `imagem/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            snapshot => {

            },
            e => {
                console.log('rolou um erro', e)
                reject(e)
            },
            (result) => {
                console.log(result)
                getDownloadURL(storageRef, uploadTask.snapshot).then(url => {
                    resolve(url)
                })
            }
        )
    })
}

const CreatePost = () => {

    const auth = useAuthValue()
    const [title, setTitle] = useState("")
    const [image, setImage] = useState(null)
    const [body, setBody] = useState("")
    const [tags, setTags] = useState([])
    const [formError, setFormError] = useState("")
    const [imgURL, setImgURL] = useState("")
    const [progress, setProgress] = useState(0)

    const {user} = useAuthValue()

    const {insertDocument, response} = useInsertDocument("posts")

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!image) {
            return
        }

        uploadImage(image).then(imageUrl => {
            const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

            //checar todos os valores
            if (!title || !imageUrl || !tags || !body) {
                setFormError("Por favor, preencha todos os campos!")
            }


            if (formError) return;

            insertDocument({
                title, image: imageUrl, body, tagsArray, uid: user.uid, createdBy: user.displayName
            })


            //redirect to home page
            navigate("/")
        })
    }

    if (!auth.user) {
        return <Navigate to='/login'/>
    }

    return (<div className={styles.create_post}>
        <h2>Criar Post</h2>
        <p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>
        <form onSubmit={handleSubmit}>
            <label>
                <span>Titulo:</span>
                <input type="text"
                       name={'title'}
                       required
                       placeholder={'Pense num bom tirulo'}
                       onChange={(e) => setTitle(e.target.value)}
                       value={title}
                />
            </label>
            <label htmlFor="name">
                <span className="btn btn-block">Selecionar imagem:</span>
                <input type="file"
                       hidden
                       id="name"
                       accept={'image/*'}
                       name={'image'}
                       required
                       placeholder={'url da imagem'}
                       onChange={ev => {
                           let file = ev.target.files?.[0];
                           setImgURL(URL.createObjectURL(file))
                           setImage(file);
                       }}
                />
                {imgURL && (
                    <img src={imgURL} alt=""/>
                )}
            </label>
            <label>
                <span>descricao:</span>
                <textarea type="text"
                          name={'body'}
                          required
                          placeholder={'Conteudo'}
                          onChange={(e) => setBody(e.target.value)}
                          value={body}
                ></textarea>
            </label>
            <label>
                <span>Tags:</span>
                <input type="text"
                       name={'tags'}
                       required
                       placeholder={'Insira as tags separadas por virgula'}
                       onChange={(e) => setTags(e.target.value)}
                       value={tags}
                />
            </label>


            {!response.loading && <button className="btn" type={"submit"}>Postar</button>}
            {response.loading && (<button className="btn" desabled>Aguarde...</button>)}
            {response.error && <p className="error">{response.error}</p>}
            {formError && <p className="error">{formError}</p>}

        </form>

    </div>)
}
export default CreatePost;