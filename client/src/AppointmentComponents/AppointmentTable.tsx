import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, PopoverTrigger} from '@chakra-ui/react'

import {Popover,PopoverContent,PopoverHeader,PopoverBody,PopoverArrow,PopoverCloseButton} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { RiDeleteBin6Line } from "react-icons/ri";

import axios from 'axios';

interface Props{
    setLoading : React.Dispatch<React.SetStateAction<boolean>>,
    current : String,
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
    appointment : {
        _id: string;
        name: string;
        email: string;
        phone: string;
        message: string;
        specialist: string;
        date: string;
        time: string;
        accepted: boolean;
    }[],
    showComponent : boolean
}

const AppointmentTable = ({setLoading, current, setAppointment, appointment, showComponent} : Props) => {
        
  return (
    <div>
      <TableContainer m={4}>
        <Table className='customColor' variant='simple' size="sm">
            {
                showComponent == true && <TableCaption>{Object.keys(appointment).length} Appointments</TableCaption>
            }
            <Thead>
            <Tr>
                <Th>S.N</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Message</Th>
                <Th>Specialist</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Accept</Th>
                {
                    current == 'superuser' && <Th>Delete</Th>
                }
            </Tr>
            </Thead>
            <Tbody className='tableBody'>
                {showComponent == true && Object.entries(appointment).map(([key, item], i) => <Tr key={Math.random() + key}>
                    <Td className='smpx' key={i + 1}>{i + 1}</Td>
                    <Td className='smpx' key={i + 1 + item.name}>{item.name}</Td>
                    {
                        item.email != undefined && <Td key={Date.now() + Math.random()}>
                        {
                            (item.email) &&
                            <>
                                <Popover placement='top-start'>
                                    <PopoverTrigger>
                                        <Button size="sm" colorScheme='blue' mx={2}>Show</Button>                                    
                                    </PopoverTrigger>
                                    <PopoverContent className="popContent" w="fit-content">
                                        <PopoverHeader fontWeight='semibold'>Email</PopoverHeader>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody className='popBody'>
                                            {item.email}
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </>
                        }
                    </Td>
                    }
                    <Td className='smpx' key={i + 1  + item.phone}>{item.phone}</Td>
                    {
                        item.message != undefined && <Td key={Date.now() + Math.random()}>
                        {
                            (item.message)&&
                            <>
                                <Popover placement='top-start'>
                                    <PopoverTrigger>
                                        <Button size="sm" colorScheme='blue' mx={2}>Read</Button>                                    
                                    </PopoverTrigger>
                                    <PopoverContent className="popContent" w="fit-content">
                                        <PopoverHeader fontWeight='semibold'>Message</PopoverHeader>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody className='popBody'>
                                            {item.message}
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </>
                        }
                    </Td>
                    }
                    <Td className='smpx' key={Date.now() + item.specialist}>{item.specialist}</Td>
                    <Td className='smpx' key={Date.now() + (i + 1)}>{item.date}</Td>
                    <Td className='smpx' key={Date.now() + item.time}>{item.time}</Td>
                    <Td key={Date.now() + item._id}>{
                        item.accepted == false ? <Button size="sm" colorScheme='green' onClick = {async() => {
                            setLoading(true);
                            await axios.patch(`${import.meta.env.VITE_NODE_URL}/api/appointment/updateAcceptance/${item._id}`, {accepted : true}, { withCredentials : true})
                            .then((data) => {
                                if (data.status == 200){
                                    item.accepted = true;
                                }
                                setLoading(false);
                            }).catch(Error => {
                                console.log('Error', Error)
                                setLoading(false);
                            })
                        }}>Accept</Button> : "Accepted"
                        }</Td>
                    {
                        current == 'superuser' && <Td key={item._id + Math.random()}>{
                            <button>
                                <RiDeleteBin6Line className='deleteIcon' onClick={async() => {
                                    setLoading(true);
                                    await axios.delete(`${import.meta.env.VITE_NODE_URL}/api/appointment/deleteAppointment/${item._id}`, { withCredentials : true})
                                    .then((appointmentItem:any) => {
                                        const newAppointment = appointmentItem.data.appointment;
                                        setAppointment({...newAppointment})
                                        setLoading(false);
                                    }).catch(Error => {
                                        console.log('Error', Error)
                                        setLoading(false);
                                    })
                                }}/>
                            </button>
                        }</Td>
                    }
                </Tr>)}
            </Tbody>
            <Tfoot>
            <Tr>
                <Th>S.N</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Message</Th>
                <Th>Specialist</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Accept</Th>
                {
                    current == 'superuser' && <Th>Delete</Th>
                }
            </Tr>
            </Tfoot>
            </Table>
        </TableContainer>
    </div>
  )
}

export default AppointmentTable
