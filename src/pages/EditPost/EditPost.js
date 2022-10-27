import styles from './EditPost.module.css'
import {useAuthValue} from "../../context/AuthContext";
import {useEffect, useState} from "react";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {storage} from "../../firebase/config";
import {useFetchDocument} from "../../hooks/useFetchDocument";
import {useUpdateDocument} from "../../hooks/useUpdateDocument";


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

const EditPost = () => {
    const {id} = useParams()
    const {document: post} = useFetchDocument("posts", id)

    const auth = useAuthValue()
    const [title, setTitle] = useState("")
    const [image, setImage] = useState(null)
    const [body, setBody] = useState("")
    const [tags, setTags] = useState([])
    const [formError, setFormError] = useState("")
    const [imgURL, setImgURL] = useState("")
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (post) {
            setTitle(post.title)
            setBody(post.body)
            setImgURL(post.image)

            const textTags = post.tagsArray.join(", ")
            setTags(textTags)
        }
    }, [post])


    const {user} = useAuthValue()

    const {updateDocument, response} = useUpdateDocument("posts")

    const navigate = useNavigate()

    const updateDoc = async () => {
        let imageUrl

        if (!!image) {
            imageUrl = await uploadImage(image)
        }

        const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

        //checar todos os valores
        if (!title || !imageUrl || !tags || !body) {
            setFormError("Por favor, preencha todos os campos!")
        }
        console.log(imageUrl, post.image)
        if (formError) return;
        updateDocument(id,{
            title,
            image: imageUrl || post.image,
            body,
            tagsArray,
            uid: user.uid,
            createdBy: user.displayName
        })

        //redirect to home page
        navigate("/dashboard")
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        updateDoc()
    }

    if (!auth.user) {
        return <Navigate to='/login'/>
    }

    return (
        <div className={styles.edit_post}>
            {post && (
                <>
                    <h2>Editar Post: {post.title}</h2>
                    <p>fique a vontade para fazer suas alteracoes</p>
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
                                   id="name"
                                   accept={'image/*'}
                                   name={'image'}
                                   style={{
                                       display: 'none'
                                   }}
                                   placeholder={'url da imagem'}
                                   onChange={ev => {
                                       let file = ev.target.files?.[0];
                                       setImgURL(URL.createObjectURL(file))
                                       setImage(file);
                                   }}
                            />
                        </label>
                        <div className={styles.edit_detail}>
                            <p className={styles.preview_title}>Preview da imagem atual:</p>
                            <img className={styles.image_preview} src={imgURL} alt={post.title}/>
                        </div>
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


                        {!response.loading && <button className="btn" type={"submit"}>Editar</button>}
                        {response.loading && (<button className="btn" disabled>Aguarde...</button>)}
                        {response.error && <p className="error">{response.error}</p>}
                        {formError && <p className="error">{formError}</p>}

                    </form>

                </>
            )}
        </div>)
}
export default EditPost;