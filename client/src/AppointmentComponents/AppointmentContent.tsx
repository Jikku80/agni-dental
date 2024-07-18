import { Button, Stack } from '@chakra-ui/react'
import { MdLogin } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SetStateAction, useEffect, useState } from 'react';
import AppointmentTable from './AppointmentTable';
import AppointmentSearch from './AppointmentSearch';
import AppointmentFilter from './AppointmentFilter';
import { TfiReload } from "react-icons/tfi";
import AllAppointments from './GetAppointment';
import io from 'socket.io-client';
import style from 'styled-components';

const FlexDiv = style.div`
    display : flex;
    background-color : #edf2f7;
    justify-content : space-around;
    padding : 10px;
    align-items: center;
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

const AppointmentContent = ({ setEntity, setLoading} : Props) => {
    const navigate = useNavigate();
    const socket = io(`${import.meta.env.VITE_NODE_URL}`)
    const [current, setCurrent] = useState('');
    const [showComponent, setShowComponent] = useState(false);
    const [appointment, setAppointment] = useState([{
      _id : '', name : '', email : '', phone: '', message : '', specialist : '', date : '', time : '', accepted : false
    }])
    const [newAddition, setNewAddition] = useState(false);
    const [searchVal, setSearchVal] = useState('')
    const [filterVal, setFilterVal] = useState('')
    const [counter, setCounter] = useState(0)
    const [showPaginate, setShowPaginate] = useState(false)
    const [showPrevPaginate, setShowPrevPaginate] = useState(false)
    const [totalPage, setTotalPage] = useState(0)
    const getUser = async() => {
      setLoading(true);
      await axios.get(`${import.meta.env.VITE_NODE_URL}/api/user/getUser/${document.cookie}`, { withCredentials: true })
      .then((item:any) => {
        const {data} = item;
        setCurrent(data.user.role)
        const user = data.user;
        setEntity({...user});
        setLoading(false);
      }).catch(Error => {
        console.log('Error', Error)
        setLoading(false);
      })
    }

    const getAppointment = async() => {
      setLoading(true);
      setCounter(0);
      setSearchVal("");
      setFilterVal("");
      setShowPaginate(false);
      setShowPrevPaginate(false);
      setTotalPage(0);
      await axios.get(`${import.meta.env.VITE_NODE_URL}/api/appointment/0`, { withCredentials: true })
      .then((item:any) => {
          const fetchedData = item.data.appointment;
          setAppointment({...fetchedData});
          setTotalPage(item.data.totalPage);
          if (fetchedData.length == item.data.pageSize && item.data.pageSize != item.data.totalPage) setShowPaginate(true);
          setTimeout(() => {
              setShowComponent(true)
          }, 100)
          setLoading(false);
          
      }).catch(Error => {
          console.log('Error', Error)
          setLoading(false);
      })
  }

    useEffect(() => {
      getUser();
      getAppointment();
      socket.connect();
      socket.on('chat message', (message) => {
        if (message == true) setNewAddition(true);
      });
      return () => {
        socket.disconnect();
      }
    }, []);
    
    if (newAddition == true){
      if (searchVal != ""){  
          AllAppointments(setLoading, setAppointment, `${import.meta.env.VITE_NODE_URL}/api/appointment/search/${searchVal}/${counter}`)
        }else if (filterVal != ""){
          AllAppointments(setLoading, setAppointment, `${import.meta.env.VITE_NODE_URL}/api/appointment/filter/${filterVal}/${counter}`)
        }else{
          AllAppointments(setLoading, setAppointment, `${import.meta.env.VITE_NODE_URL}/api/appointment/${counter}`)
        }
        setNewAddition(false);
        socket.disconnect();
    }
    
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

  const signIn = () => {
    navigate('/register-as-agni-user')
  }
  
  return (
    <div>
      <FlexDiv>
        {current == 'superuser' && <Button color="#4A5568" onClick={() => navigate('/all/patient')}>Patient</Button>}
        <Button color="#4A5568" onClick={() => navigate('/patient-entry')}>Add Patient</Button>
        <TfiReload title='Reload Appointments' className="reloadIcon" onClick={getAppointment} />
        <AppointmentSearch setAppointment={setAppointment} setLoading={setLoading} setSearchVal={setSearchVal} setTotalPage = {setTotalPage} setShowPaginate={setShowPaginate} setCounter={setCounter} setShowPrevPaginate = {setShowPrevPaginate} setFilterVal={setFilterVal}/>
        <AppointmentFilter setAppointment={setAppointment} setLoading={setLoading} setSearchVal={setSearchVal} setTotalPage = {setTotalPage} setShowPaginate={setShowPaginate} setCounter={setCounter} setShowPrevPaginate = {setShowPrevPaginate} setFilterVal={setFilterVal}/>
        {
          current == 'superuser' && <Button color="#4A5568" onClick={signIn} rightIcon={<MdLogin />}>Add User</Button>
        }
        <Button color="#4A5568" className="customColor" onClick={signOut} rightIcon={<MdLogin />}>
            Signout
        </Button>
      </FlexDiv>
      {
        <AppointmentTable setLoading = {setLoading} current = {current} setAppointment={setAppointment} appointment={appointment} showComponent={showComponent}/>
      }
      <Stack direction='row' spacing={4} align='center' justifyContent="flex-end" w="100%" paddingX={12}>
        {showPrevPaginate && <Button colorScheme='blue' variant='ghost' onClick={async() =>{
          setLoading(true)
          let decrease = counter - 1;
          setCounter(decrease);
          if (decrease < 1) setShowPrevPaginate(false);
          setShowPaginate(true);
          let endPoint;
          if (searchVal != ""){            
            endPoint = `${import.meta.env.VITE_NODE_URL}/api/appointment/search/${searchVal}/${decrease}`
          }else if (filterVal != ""){
            endPoint = `${import.meta.env.VITE_NODE_URL}/api/appointment/filter/${filterVal}/${decrease}`
          }
          else{
            endPoint = `${import.meta.env.VITE_NODE_URL}/api/appointment/${decrease}`
          }
          AllAppointments(setLoading, setAppointment, endPoint);
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
              endPoint = `${import.meta.env.VITE_NODE_URL}/api/appointment/search/${searchVal}/${increment}`
            }else if (filterVal != ""){
              endPoint = `${import.meta.env.VITE_NODE_URL}/api/appointment/filter/${filterVal}/${increment}`
            }
            else{
              endPoint = `${import.meta.env.VITE_NODE_URL}/api/appointment/${increment}`
            }
            AllAppointments(setLoading, setAppointment, endPoint);
          }}>
            Next
          </Button>
        }
      </Stack>
    </div>
  )
}

export default AppointmentContent
