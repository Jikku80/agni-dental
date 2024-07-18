import axios from 'axios';
import React, { SetStateAction, useEffect, useState } from 'react'
import UnAuthorized from '../Components/UnAuthorized';
import { useNavigate } from 'react-router-dom';
import PatientSubRecordContent from './PatientSubRecordContent';
import SubNav from '../PatientComponent/SubNav';

interface Props{
    isEntity : String;
    setEntity: React.Dispatch<SetStateAction<{
      _id: string;
      name: string;
      role: string;
      createdAt: string;
    }>>,
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>
  
  }

const PatientSubRecord = ({isEntity, setEntity, setLoading} : Props) => {
  const navigate = useNavigate();
  let pathname = location.pathname;
  const num = pathname.split('/sub-record/')[1];
  const [goToLink] = useState(`patient-record/${num}`);
  const goToLogin = () => {
    navigate('/login')
  }

    const getUser = async() => {
        setLoading(true);
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/user/getUser/${document.cookie}`, { withCredentials: true })
        .then((item:any) => {
          const {data} = item;
          const user =  data.user
          setEntity({...user});
          setLoading(false);
        }).catch(Error => {
          setLoading(false);
          console.log('Error', Error)
        })
      }
    useEffect(() => {
      getUser();
    }, []);
  return (
    <div>
        {isEntity == "" ?  <UnAuthorized content={"You are not logged in!"} btnInfo={"Login"} navigateToComponent= {goToLogin}/> : <>
          <SubNav setEntity={setEntity} setLoading={setLoading} goToLink={goToLink}/>
          <PatientSubRecordContent setLoading={setLoading}/>
        </>}
    </div>
  )
}

export default PatientSubRecord
