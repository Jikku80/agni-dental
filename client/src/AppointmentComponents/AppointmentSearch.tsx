import { Input, InputGroup, InputLeftElement} from '@chakra-ui/react';
import React, { SetStateAction, useRef } from 'react'
import { FaSearch } from "react-icons/fa";
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

const AppointmentSearch = ({setAppointment, setLoading, setSearchVal, setTotalPage, setShowPaginate, setCounter, setShowPrevPaginate, setFilterVal} : Props) => {
    interface Search {
        name : String
    }
    const {register, handleSubmit} = useForm<Search>();

    const onSubmit: SubmitHandler<Search> = async (data : any) => {
        setCounter(0);
        setLoading(true)
        setFilterVal("")
        setSearchVal(data.name)
        setShowPaginate(false)
        setShowPrevPaginate(false)
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/appointment/search/${data.name}/0`, {withCredentials: true})
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
    const inputRef = useRef<HTMLButtonElement>(null);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
            <InputLeftElement pointerEvents='none'>
            <FaSearch className="searchIcon"/>
            </InputLeftElement>
            <Input type='text' className='searchBox' id="search_value" {...register('name', {required: true})} placeholder='Search....' onKeyDown={(e) => {
                
                if (e.key == "Enter") {
                    e.preventDefault();
                    inputRef.current?.click();
                };
            }}/>
            <button ref={inputRef} type="submit"></button>
        </InputGroup>
    </form>
  )
}

export default AppointmentSearch
