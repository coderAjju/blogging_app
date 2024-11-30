import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import axiosInstance from '../lib/axios'
import useAuthStore from '../zustant/useAuthStore'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
    let auth = getAuth(app)
    const navigate = useNavigate();
    const {setUser, authUser} = useAuthStore();
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' }); // es line ka matlab yeh hai ki jab aap ek baar login kiye to aapko email select karne ka option nhi aata hai es line ki vajah se aaye aap jitne baar signup karenge google ke saath utni baar aayega
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            
            const res = await axiosInstance.post("/api/auth/google", {
                name: resultFromGoogle.user.displayName,
                email: resultFromGoogle.user.email,
                profilePic: resultFromGoogle.user.photoURL
            });
            localStorage.setItem("authUser", JSON.stringify(res.data.user));
            setUser(res.data.user);

            console.log("authUser form oauth page ", resultFromGoogle);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };
  return (
    <Button outline type="button" gradientDuoTone="purpleToBlue" onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='size-6 mr-2'/>
        Continue with goolge
    </Button>
  )
}

export default OAuth