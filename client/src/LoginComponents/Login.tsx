import { Button, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react'
import { MdLogin } from "react-icons/md";
import style from 'styled-components';
import {useForm, SubmitHandler} from "react-hook-form";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SetStateAction, useState } from 'react';
import UnAuthorized from '../Components/UnAuthorized';

const FlexDiv = style.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const LoginDiv = style.div`
    padding : 2%;
    width: 30%;
`

const LoginHead = style.div`
    font-size : 40px;
    font-weight : bold;
    color : #4A5568;
`

const ErrorMsg = style.p`
    color : crimson;
    font-size: 12px;
`

interface Props{
    isEntity: String,
    setEntity: React.Dispatch<SetStateAction<{
        _id: string;
        name: string;
        role: string;
        createdAt: string;
    }>>,
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>
}

const Login = ({isEntity, setEntity, setLoading} : Props) => {
    const navigate = useNavigate();

    const goToAppointment = () => {
        navigate('/appointment');
    }
    interface User {
        name : String,
        password : String
    }
    const [logError, setLogError] = useState('');
    const {register, handleSubmit, formState : {errors}} = useForm<User>()
    const onSubmit: SubmitHandler<User> = async (data) => {
        setLoading(true)
        await axios.post(`${import.meta.env.VITE_NODE_URL}/api/user/login`, {name : data.name, password: data.password})
            .then(item => {
                const {data} = item;
                const newDate = new Date(data.expiry)
                document.cookie= `jwt=${data.token}; expires=${newDate}; SameSite=None; Secure;`
                const user = data.user;
                setEntity({...user});
                navigate('/appointment')
                setLoading(false)
            }).catch(err => {
                setLogError(err.response.data.message);
                console.log('Error!!!', err)
                setLoading(false)
            })
    }


  return (
    <FlexDiv>
        {
            isEntity == "" || isEntity == undefined  || document.cookie == "jwt==loggedout" || document.cookie == "" ?
            <LoginDiv>    
                <LoginHead>LOGIN</LoginHead>
                <form onSubmit={handleSubmit(onSubmit)}>                
                    <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input id="login_username" type='text' {...register('name', {required: true})}/>
                        {
                            errors.name ? <ErrorMsg>Name is required.</ErrorMsg> : <FormHelperText>Enter Signedup Username.</FormHelperText>
                        }
                        {
                            logError.includes('User name') ? <ErrorMsg>Username does not match</ErrorMsg> : ""
                        }
                        <FormLabel my="4">Password</FormLabel>
                        <Input id="login_userpassword" type='password' {...register('password', {required: true, pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{0,9}$/})}/>
                        {
                            errors.password ? <ErrorMsg>Password is Invalid.</ErrorMsg> : <FormHelperText>Enter your password.</FormHelperText>
                        }
                        {
                            logError.includes('Password') ? <ErrorMsg>Password does not match</ErrorMsg> : ""
                        }
                        <Button type="submit" rightIcon={<MdLogin />} colorScheme='blue' my="4">
                            Login
                        </Button>
                    </FormControl>
                </form>
            </LoginDiv>
            : <UnAuthorized content={"You are logged in, click below to view appointments"} btnInfo={"Appointment"} navigateToComponent={goToAppointment}/>
        }
    </FlexDiv>
  )
}

export default Login
