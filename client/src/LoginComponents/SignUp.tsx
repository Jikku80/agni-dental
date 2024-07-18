import { MdLogin } from "react-icons/md";
import style from 'styled-components';
import { Button, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react'
import {useForm, SubmitHandler} from "react-hook-form";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SetStateAction, useState, useEffect } from "react";
import UnAuthorized from "../Components/UnAuthorized";
import SubNav from "../PatientComponent/SubNav";
const FlexDiv = style.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const SignDiv = style.div`
    padding : 2%;
    width: 30%;
`

const SigninHead = style.div`
    font-size : 40px;
    font-weight : bold;
    color : #4A5568;
`

const ErrorMsg = style.p`
    color : crimson;
    font-size: 12px;
`

interface Props{
    setEntity: React.Dispatch<SetStateAction<{
        _id: string;
        name: string;
        role: string;
        createdAt: string;
    }>>,
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>
}

const SignUp = ({setEntity, setLoading} : Props) => {
    const navigate = useNavigate();
    interface User {
        name : String,
        password : String
    }
    const [logError, setLogError] = useState('');

    const {register, handleSubmit, formState : {errors}} = useForm<User>()
    const [current, setCurrent] = useState('');

    const goToLogin = () => {
        navigate('/login')
    }

    const getUser = async() => {
        setLoading(true);
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/user/getUser/${document.cookie}`, { withCredentials: true })
        .then((item:any) => {
            const {data} = item;
            if (data.user.role === 'superuser') setCurrent(data.user.role)
            const user = data.user;
            setEntity({...user});
            setLoading(false);
        }).catch(Error => {
            console.log('Error', Error)
            setLoading(false);
        })
      }
      useEffect(() => {
        getUser();
      }, []);

    const onSubmit: SubmitHandler<User> = async (data) => {
        setLoading(true)
        await axios.post(`${import.meta.env.VITE_NODE_URL}/api/user/register`, {name : data.name, password: data.password}, { withCredentials: true })
        .then(item => {
            const {data} = item;
            const newDate = new Date(data.expiry)
            document.cookie= `jwt=${data.token}; expires=${newDate}; SameSite=None; Secure;`
            const user = data.newUser;
            setEntity({...user});
            navigate('/appointment')
            setLoading(false);
        })
        .catch(err => {
            setLogError(err.response.data.message)
            console.log('Error!!!', err)
            setLoading(false);
        })
    }

  return (
    <>
        {
            current !== "superuser" ? <UnAuthorized content={"You dont have enough power to open this content!"} btnInfo={"Login"} navigateToComponent={goToLogin}/> :
                <>
                    <SubNav setEntity={setEntity} setLoading={setLoading} goToLink="appointment" />
                    <FlexDiv>
                        <SignDiv>
                            <SigninHead>SIGNUP</SigninHead>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <FormControl>
                                    <FormLabel>Username</FormLabel>
                                    <Input type='text' id="signup_user_name" {...register('name', {required: true})}/>
                                    {
                                        errors.name ? <ErrorMsg>Username is invalid</ErrorMsg> : <FormHelperText>Enter a unique user name.</FormHelperText>
                                    }
                                    {
                                        logError.includes('already exists!') ? <ErrorMsg>Username is already taken enter different username!</ErrorMsg> : ""
                                    }
                                    <FormLabel my="4">Password</FormLabel>
                                    <Input type='password'id="signup_user_password" {...register('password', {required: true, pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{0,9}$/})}/>
                                    {
                                        errors.password ? <ErrorMsg>Password is invalid!</ErrorMsg> : <FormHelperText>Enter your password using [a-z, A-Z, 0-9]</FormHelperText>
                                    }
                                    <Button type='submit' rightIcon={<MdLogin />} colorScheme='pink' my="4">
                                        Signup
                                    </Button>
                                </FormControl>
                            </form>
                    </SignDiv>
                    </FlexDiv>
                </>
                
        }
      
    </>
  )
}

export default SignUp
