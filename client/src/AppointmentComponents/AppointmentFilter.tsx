import React, { SetStateAction } from 'react'
import { Button, Input, InputGroup} from '@chakra-ui/react';
import {useForm, SubmitHandler} from "react-hook-form";
import axios from 'axios';

interface Props{
    setAppointment: React.Dispatch<React.SetStateAction<{
        _id: string;
        name: string;
        email: string;
        phone: string;
        message: string;
        specialist: string;
        date: string;
        time: string;
        accepted: boolean;
    }[]>>,
    setLoading : React.Dispatch<React.SetStateAction<boolean>>,
    setSearchVal : React.Dispatch<SetStateAction<string>>,
    setTotalPage : React.Dispatch<SetStateAction<number>>,
    setShowPaginate : React.Dispatch<SetStateAction<boolean>>,
    setCounter : React.Dispatch<SetStateAction<number>>,
    setShowPrevPaginate : React.Dispatch<SetStateAction<boolean>>,
    setFilterVal : React.Dispatch<SetStateAction<string>>
}

const AppointmentFilter = ({setAppointment, setLoading, setSearchVal, setTotalPage, setShowPaginate, setCounter, setShowPrevPaginate, setFilterVal} : Props) => {
    interface Search {
        date : String
    }
    const {register, handleSubmit} = useForm<Search>();

    const onSubmit: SubmitHandler<Search> = async (data : any) => {
        setLoading(true)
        setCounter(0);
        setLoading(true)
        setSearchVal("")
        setFilterVal(data.date)
        setShowPrevPaginate(false)
        setShowPaginate(false)
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/appointment/filter/${data.date}/0`, {withCredentials: true})
            .then(item => {
                const {data} = item;
                const fetchedData = data.appointment;
                setAppointment({...fetchedData})
                setTotalPage(data.totalPage);
                if (fetchedData.length == data.pageSize && data.pageSize != data.totalPage) setShowPaginate(true);
                setLoading(false)
            }).catch(err => {
                console.log('Error!!!', err)
                setLoading(false)
            })
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)}> 
      <InputGroup>
        <Input className='dateFilter' type='date' {...register('date', {required: true})} />
        <Button type="submit" colorScheme='blue' mx="6px">Filter</Button>
    </InputGroup>
    </form>
  )
}

export default AppointmentFilter
