import {React} from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom';

import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { client } from '../client.js';
import jwt_decode from 'jwt-decode';



const Login = () => {
    
    const navigate = useNavigate();
    const responseGoogle = (response) => {
        const decoded = jwt_decode(response.credential)
        console.log(decoded)
        const {name, sub, picture} = decoded
        console.log(name);
        localStorage.setItem(`user`, JSON.stringify(decoded));
       
        const doc ={
            _type:'user',
            _id: sub,
            userName:name,
            image: picture
        };
        client.createIfNotExists(doc).then(() => {
            navigate('/', { replace: true });
        });
    };



    return (
        <GoogleOAuthProvider clientId='731443396084-tusaro7e14a6htbri7j3lpkj2hv6erit.apps.googleusercontent.com'>
            <div className='flex justify-start items-center flex-col h-screen'>
                <div className='relative w-full h-full'>
                    <video
                        src={shareVideo}
                        alt='background video'
                        type='video/mp4'
                        muted
                        controls={false}
                        autoPlay
                        loop
                        className='w-full h-full object-cover'
                    >

                    </video>
                    <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                        <div className='p-5'>
                            <img src={logo} alt='logo' width='130px' />
                        </div>
                        <div className='shadow-2xl'>
                            <GoogleLogin
                                onSuccess={(res) => responseGoogle(res)}
                                onFailure={(res) => responseGoogle(res)}
                                cookiePolicy="single_host_origin"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>

    )
}

export default Login