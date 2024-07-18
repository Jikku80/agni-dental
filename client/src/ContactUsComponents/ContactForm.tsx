import { Button, FormControl, FormLabel, HStack, Input, Select, Stack, Textarea, VStack} from "@chakra-ui/react"
import {useForm, SubmitHandler} from "react-hook-form";
import { SiTicktick } from "react-icons/si";
import axios from 'axios';
import React, { useState } from "react";
import style from 'styled-components';
import io from 'socket.io-client'

const Modal = style.div`
    height : 100vh;
    width : 100vw;
    position : fixed;
    top : 0;
    display : flex;
    justify-content : center;
    align-items : center;
    background-color: #0003;;
`

const ModalBody = style.div`
    background-color : white;
    color : #4A5568;
    padding : 2%;
    border-radius : 10px;
    display: flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`

const ModalButton = style.button`
    background-color : #eaeaea;
    color : #4A5568;
    border-radius : 10px;
    padding : 2%;
    margin-top : 2%;
    width: fit-content;

    &:hover{
    background-color : #bfbfbf;
    }
`

const ErrorMsg = style.p`
    color : crimson;
    font-size: 12px;
`

interface Props{
    setLoading : React.Dispatch<React.SetStateAction<boolean>>
}

interface Appointment {
    name : String,
    email : String,
    phone : Number,
    message : String,
    specialist : String,
    date : String,
    time : String
}
const ContactForm = ({setLoading} : Props) => {
    const time = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"]
    
    const {register, handleSubmit, formState : {errors}} = useForm<Appointment>();
    const socket = io(`${import.meta.env.VITE_NODE_URL}`, {autoConnect : false})

    const [availableTime, setAvailableTime] = useState({time});
    const [updateTime, setUpdateTime] = useState(false);
    const [newPlaceholder, setNewPlaceholder] = useState('---Select A Date First---');

    const onSubmit: SubmitHandler<Appointment> = async (data : any) => {
        setLoading(true)
        await axios.post(`${import.meta.env.VITE_NODE_URL}/api/appointment/`, {
            name : data.name,
            email : data.email,
            phone : data.phone,
            message: data.message,
            specialist : data.specialist,
            date : data.date,
            time : data.time,
            createdAt : Date.now()
        }, {withCredentials: true})
            .then((response) => {
                if (response.status == 201){
                    data = response.data.appointment
                    let successModal = document.querySelector(".successModal");
                    successModal?.classList.remove("hidden");
                    socket.connect();
                    socket.emit('chat message', true);
                    setTimeout(() => {
                        successModal?.classList.add("hidden");
                        socket.disconnect();
                    },5000)
                }
                setLoading(false)
            }).catch(err => {
                console.log('Error!!!', err)
                setLoading(false)
            })
    }
    
  return (
    <>    
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl className="bookForm" w="50%" m={4}>
                <HStack my={4} justifyContent="space-between">
                    <FormLabel>Name</FormLabel>
                    <VStack w="80%">
                        <Input type='text' placeholder='Enter your name' w="90%" {...register('name', {required: true})}/>
                        {
                            errors.name && <ErrorMsg>Please provide your name!</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Email</FormLabel>
                    <VStack w="80%">    
                        <Input type='email' placeholder='Enter your email' w="90%" {...register('email', {required: true})}/>
                        {
                            errors.email && <ErrorMsg>Please provide your email address!</ErrorMsg>
                        }
                    </VStack>
                </HStack>
                <HStack my={4}>
                    <FormLabel>Phone</FormLabel>
                    <VStack w="80%">
                        <Input type='number' placeholder='Enter phone number' w="90%" {...register('phone', {required: true})}/>
                        {
                            errors.phone && <ErrorMsg>Please provide your phone number!</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Specialist</FormLabel>
                    <VStack w="80%">
                        <Stack spacing={3} w="90%">
                            <Select className="lightColot" placeholder='---Select Doctor---' {...register('specialist', {required: true})}>
                                <option className="lightColot" value='Dr. James Maharjan'>Dr. James Maharjan</option>
                                <option className="lightColot" value='Dr. Aaishma Shrestha'>Dr. Aaishma Shrestha</option>
                                <option className="lightColot" value='Dr. Udikshya Maharjan'>Dr. Udikshya Maharjan</option>
                                <option className="lightColot" value='new'>New In Agni</option>
                            </Select>
                        </Stack>
                        {
                            errors.specialist && <ErrorMsg>Please pick a Doctor!</ErrorMsg>
                        }
                    </VStack>
                </HStack>
                <FormLabel>Message</FormLabel>
                <Textarea my={4} className="txtArea" placeholder='Enter your problem...' size='sm' w="98%" {...register('message', {required: true})}/>
                {
                    errors.message && <ErrorMsg>Please write a message about your problem!</ErrorMsg>
                }
                <HStack my={4}>
                    <FormLabel>Date</FormLabel>
                    <VStack w="80%">
                        <Input className="lightColot" type='date' w="90%" {...register('date', {required: true})} onChange={async(e) => {
                            setLoading(true);
                            await axios.get(`${import.meta.env.VITE_NODE_URL}/api/appointment/getAllTime/${e.target.value}`, { withCredentials: false })
                                .then((item:any) => {
                                const {data} = item;
                                const fetchedTime = data.time;
                                fetchedTime.filter((item:any) => {
                                    time.splice(time.indexOf(item), 1);
                                })
                                
                                setAvailableTime({time})
                                setUpdateTime(true)
                                setNewPlaceholder('---Available Times---')
                                setLoading(false);
                                }).catch(Error => {
                                setLoading(false);
                                console.log('Error', Error)
                                })
                        }}/>
                        {
                            errors.date && <ErrorMsg>Please pick a Date!</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Time</FormLabel>
                    <VStack w="80%">
                        <Stack spacing={3} w="90%">
                            <Select className="lightColot timeAvailable" placeholder={newPlaceholder} {...register('time', {required: true})}>
                                {
                                    updateTime && Object.entries(availableTime).map(([key, el], i) => el.map (item => <option key={key + i} className="lightColot" value={item}>{item}</option>))
                                }
                            </Select>
                        </Stack>
                        {
                            errors.time && <ErrorMsg>Please pick a time!</ErrorMsg>
                        }
                    </VStack>
                </HStack>
                <Button type="submit" my={4}>Book</Button>
            </FormControl>
        </form>
        <Modal className = "successModal hidden">
            <ModalBody>
                <p>Your booking has been requested, Please keep an eye on your mail for confirmation.</p>
                <SiTicktick className="tick" />
                <ModalButton onClick={() => {
                    let successModal = document.querySelector(".successModal");
                    successModal?.classList.add("hidden");
                }}>Close</ModalButton>
            </ModalBody>
        </Modal>
    </>
  )
}

export default ContactForm
