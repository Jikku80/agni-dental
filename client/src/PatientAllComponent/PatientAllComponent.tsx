import React, { SetStateAction, useEffect, useState } from 'react'
import PatientAllTable from './PatientAllTable';
import PatientAllSearch from './PatientAllSearch';
import style from 'styled-components'
import axios from 'axios';
import { TfiReload } from 'react-icons/tfi';
import { Button, Stack } from '@chakra-ui/react';
import AllPatients from './GetPatient';
import { useNavigate } from 'react-router-dom';
import { MdLogin } from 'react-icons/md';

const FlexDiv = style.div`
    display : flex;
    background-color : #edf2f7;
    justify-content : space-between;
    align-items : center;
    padding: 10px;
`

interface Props{
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>,
    setEntity: React.Dispatch<SetStateAction<{
        _id: string;
        name: string;
        role: string;
        createdAt: string;
    }>>
}

const PatientAllComponent = ({setLoading, setEntity} : Props) => {
    const navigate = useNavigate();
    const [showComponent, setShowComponent] = useState(false);
    const [allPatient, setAllPatient] = useState([{
        _id : '', name: '', email : '', age: 0, gender : '', address : '', phone :''
    }])
    const [searchVal, setSearchVal] = useState('');
    const [counter, setCounter] = useState(0);
    const [showPaginate, setShowPaginate] = useState(false)
    const [showPrevPaginate, setShowPrevPaginate] = useState(false)
    const [totalPage, setTotalPage] = useState(0)

    const getPatient = async() => {
        setLoading(true);
        setCounter(0);
        setSearchVal("");
        setShowPaginate(false);
        setShowPrevPaginate(false);
        setTotalPage(0);
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/patient/getAll/0`, { withCredentials: true })
        .then((item:any) => {
          const {data} = item;
          const patient =  data.patient
          setAllPatient({...patient});
          setTotalPage(item.data.totalPage);
          if (patient.length == item.data.pageSize && item.data.pageSize != item.data.totalPage) setShowPaginate(true);
          setTimeout(() => {
            setShowComponent(true)
        }, 100)
          setLoading(false);
        }).catch(Error => {
          setLoading(false);
          console.log('Error', Error)
        })
      }
    useEffect(() => {
      getPatient();
    }, []);

    const signOut = async() => {
        setLoading(true);
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/user/logout`)
        .then(item => {
          const {data} = item;
          const newDate = new Date(data.expiry)
          document.cookie  = `jwt=loggedout; expires=${newDate}; SameSite=None; Secure;`
          setEntity({
            _id : '',
            name: '',
            role : '',
            createdAt : ''
          })
          setLoading(false);
          navigate('/login')
        }).catch(err => {
          console.log('Error!!!!', err)
          setLoading(false);
        })
      }

  return (
    <div>
        <FlexDiv>
            <Button color="#4A5568" onClick={() => navigate('/patient-entry')}>Add Patient</Button>
            <Button color="#4A5568" onClick={() => navigate('/appointment')}>Appointment</Button>
            <TfiReload title='Reload Appointments' className="reloadIcon" onClick={getPatient} />
            <PatientAllSearch setLoading={setLoading} setAllPatient={setAllPatient} setSearchVal={setSearchVal} setTotalPage = {setTotalPage} setShowPaginate={setShowPaginate} setCounter={setCounter} setShowPrevPaginate = {setShowPrevPaginate}/>
            <Button color="#4A5568" onClick={signOut} rightIcon={<MdLogin />} >Sign out</Button>
        </FlexDiv>
        <PatientAllTable setLoading={setLoading} setAllPatient={setAllPatient} allPatient={allPatient} showComponent={showComponent}/>
        <Stack direction='row' spacing={4} align='center' justifyContent="flex-end" w="100%" paddingX={12}>
        {showPrevPaginate && <Button colorScheme='blue' variant='ghost' onClick={async() =>{
          setLoading(true)
          let decrease = counter - 1;
          setCounter(decrease);
          if (decrease < 1) setShowPrevPaginate(false);
          setShowPaginate(true);
          let endPoint;
          if (searchVal != ""){            
            endPoint = `${import.meta.env.VITE_NODE_URL}/api/patient/search/${searchVal}/${decrease}`
          }
          else{
            endPoint = `${import.meta.env.VITE_NODE_URL}/api/patient/getAll/${decrease}`
          }
          AllPatients(setLoading, setAllPatient, endPoint);
        }}>
          Prev
        </Button>
        }
        {showPaginate && <Button colorScheme='blue' variant='ghost' onClick={async() => {
            setLoading(true)
            let increment = counter + 1;
            setCounter(increment);
            setShowPrevPaginate(true);
            if ((increment + 1) >= totalPage) setShowPaginate(false) 
            let endPoint;
            if (searchVal != ""){
              endPoint = `${import.meta.env.VITE_NODE_URL}/api/patient/search/${searchVal}/${increment}`
            }
            else{
              endPoint = `${import.meta.env.VITE_NODE_URL}/api/patient/getAll/${increment}`
            }
            AllPatients(setLoading, setAllPatient, endPoint);
          }}>
            Next
          </Button>
        }
      </Stack>
    </div>
  )
}

export default PatientAllComponent
