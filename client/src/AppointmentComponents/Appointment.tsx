import AppointmentContent from "./AppointmentContent";
import UnAuthorized from "../Components/UnAuthorized" ;
import { SetStateAction, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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

const Appointment = ({isEntity, setEntity, setLoading} : Props) => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login')
  }
    const getUser = async() => {
      setLoading(true);
      await axios.get(`${import.meta.env.VITE_NODE_URL}/api/user/getUser/${document.cookie}`, { withCredentials: true })
      .then((item:any) => {
        const {data} = item;
        const user =  data.user
        if(item.status == 200){
          setEntity({...user});
          setLoading(false);
        }
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
      {
        isEntity == "" ?  <UnAuthorized content={"You are not logged in!"} btnInfo={"Login"} navigateToComponent= {goToLogin}/> : <AppointmentContent setEntity = {setEntity} setLoading = {setLoading}/>
      }
    </div>
  )
}

export default Appointment