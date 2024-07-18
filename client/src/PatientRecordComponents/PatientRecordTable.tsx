import React, { useEffect, useState } from 'react'
import {Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button} from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from 'react-icons/ri';

interface Props{
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>,
    setPatientRecord: React.Dispatch<React.SetStateAction<{
        _id: string;
        problem: string;
        subProblem: string;
        totalSession: number;
        sessionCompleted : number;
        totalAmount: number;
        dueAmount: number;
        leftSession: number;
    }[]>>,
    patientRecord: {
        _id: string;
        problem: string;
        subProblem: string;
        totalSession: number;
        sessionCompleted : number;
        totalAmount: number;
        dueAmount: number;
        leftSession: number;
    }[],
    problemRef: React.RefObject<HTMLSelectElement>,
    subProblemRef: React.RefObject<HTMLSelectElement>,
    sessionRef: React.RefObject<HTMLInputElement>,
    amountRef: React.RefObject<HTMLInputElement>
}

const PatientRecordTable = ({setLoading, setPatientRecord, patientRecord, problemRef, subProblemRef, sessionRef, amountRef} : Props) => {
  const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState('');
    const getUser = async() => {
        setLoading(true);
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/user/getUser/${document.cookie}`, { withCredentials: true })
        .then((item:any) => {
          const {data} = item;
          const user =  data.user
          setCurrentUser(user.role);
          setLoading(false);
        }).catch(Error => {
          setLoading(false);
          console.log('Error', Error)
        })
      }
    
    let pathname = location.pathname;
    const num = pathname.split('/patient-record/')[1];
    const getPatient = async() => {
        setLoading(true);
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/patient/record/getOnePatientRecords/${num}`, { withCredentials: true })
        .then((item:any) => {
            const {data} = item;
            const fetchedData =  data.patientRecord
            setPatientRecord({...fetchedData})
            setLoading(false);
        }).catch(Error => {
            setLoading(false);
            console.log('Error', Error)
        })
    }
    useEffect(() => {
        getPatient();
        getUser();
    }, []);
  return (
    <div>
        <p className='recordHeading margin'>All Records</p>
        <TableContainer className='recordsTable'>
            <Table variant='simple' size='sm' m={1}>
                <TableCaption>Records</TableCaption>
                <Thead>
                <Tr>
                    <Th className='smpx'>S.N</Th>
                    <Th className='smpx'>Treatment</Th>
                    <Th className='smpx'>Total Sess</Th>
                    {
                        currentUser == "superuser" && <>
                            <Th className='smpx'>Completed</Th>
                            <Th className='smpx' >Sess Left</Th>
                            <Th className='smpx'>Total Amount</Th>
                            <Th className='smpx'>Due Amount</Th>
                            <Th className='smpx'>Update</Th>
                            <Th className='smpx'>Delete</Th>
                        </>
                    }
                </Tr>
                </Thead>
                <Tbody> 
                    {Object.entries(patientRecord).map(([key, item], i) => <Tr key={key}>
                        <Td className='smpx' key={i + 1}>{i + 1}</Td>
                        <Td className="tdLink smpx" key ={item.problem} onClick={() => {
                            navigate(`/patient/${item._id}/sub-record/${num}`)
                        }}>{item.problem}
                            {item.subProblem != "None" && ` : ${item.subProblem}`}
                        </Td>
                        <Td className='smpx' key={item.totalSession + Math.random()}>{item.totalSession}</Td>
                        {
                        currentUser == "superuser" && <>
                            <Td className='smpx'>{item.sessionCompleted}</Td>
                            <Td className='smpx'>{item.leftSession}</Td>
                            <Td className='smpx'>{item.totalAmount}</Td>
                            <Td className='smpx'>{item.dueAmount}</Td>
                            <Td>
                                <Button size="sm" colorScheme='green' onClick={() => {
                                    if (problemRef.current != null) problemRef.current.value = item.problem
                                    if (subProblemRef.current != null) subProblemRef.current.value = item.subProblem
                                    if (sessionRef.current != null) sessionRef.current.value = `${item.totalSession}`
                                    if (amountRef.current != null) amountRef.current.value = `${item.totalAmount}`
                                    const addButton = document.querySelector(".addButton");
                                    const updateButton = document.querySelector(".updateButton");
                                    addButton?.classList.add('hidden');
                                    updateButton?.classList.remove('hidden');
                                    let idval = document.querySelector(".recordId");
                                    if (idval != undefined) idval.innerHTML = item._id
                                }}>Update</Button>
                            </Td>
                            <Td>
                                <RiDeleteBin6Line className='deleteIcon' onClick={async() => {
                                    setLoading(true);
                                    await axios.delete(`${import.meta.env.VITE_NODE_URL}/api/patient/record/deleteRecord/${item._id}/${num}`, { withCredentials : true})
                                    .then((appointmentItem:any) => {
                                        const fetchedData = appointmentItem.data.patientRecord;
                                        setPatientRecord({...fetchedData})
                                        setLoading(false);
                                    }).catch(Error => {
                                        console.log('Error', Error)
                                        setLoading(false);
                                    })
                                }}/>
                            </Td>
                        </>
                    }
                    </Tr>
                    )}
                </Tbody>
                <Tfoot>
                <Tr>
                    <Th className='smpx'>S.N</Th>
                    <Th className='smpx'>Treatment</Th>
                    <Th className='smpx'>Total Sess</Th>
                    {
                        currentUser == "superuser" && <>
                            <Th className='smpx'>Completed</Th>
                            <Th className='smpx'>Sess Left</Th>
                            <Th className='smpx'>Total Amount</Th>
                            <Th className='smpx'>Due Amount</Th>
                            <Th className='smpx'>Update</Th>
                            <Th className='smpx'>Delete</Th>
                        </>
                    }
                </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    </div>
  )
}

export default PatientRecordTable
