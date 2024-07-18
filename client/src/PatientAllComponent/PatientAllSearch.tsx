import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import axios from 'axios';
import { SetStateAction, useRef} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';

interface Props{
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>,
    setAllPatient: React.Dispatch<React.SetStateAction<{
        _id: string;
        name: string;
        email: string;
        age: number;
        gender: string;
        address: string;
        phone: string;
    }[]>>,
    setSearchVal: React.Dispatch<React.SetStateAction<string>>,
    setTotalPage : React.Dispatch<SetStateAction<number>>,
    setShowPaginate : React.Dispatch<SetStateAction<boolean>>,
    setCounter : React.Dispatch<SetStateAction<number>>,
    setShowPrevPaginate : React.Dispatch<SetStateAction<boolean>>  
}

const PatientAllSearch = ({setLoading, setAllPatient, setSearchVal, setTotalPage, setShowPaginate, setCounter, setShowPrevPaginate} : Props) => {
    interface Search {
        name : String
    }
    const {register, handleSubmit} = useForm<Search>();

    const onSubmit: SubmitHandler<Search> = async (data : any) => {
        setCounter(0);
        setLoading(true)
        setSearchVal(data.name)
        setShowPaginate(false)
        setShowPrevPaginate(false)
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/patient/search/${data.name}/0`, {withCredentials: true})
        .then(item => {
            const {data} = item;
            const fetchedData = data.patient;
            setAllPatient({...fetchedData})
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
                <Input className='searchBox' color="#4A5568" type='text' {...register('name', {required: true})} placeholder='Search....' onKeyDown={(e) => {
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

export default PatientAllSearch
