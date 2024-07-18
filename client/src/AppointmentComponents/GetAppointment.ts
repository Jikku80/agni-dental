import axios from 'axios';
import { SetStateAction } from 'react';

const AllAppointments = async(setLoading : (value: SetStateAction<boolean>) => void, setAppointment : (value: SetStateAction<{
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    specialist: string;
    date: string;
    time: string;
    accepted: boolean;
}[]>) => void, endPoint : string ) => {
    await axios.get(endPoint, {withCredentials: true})
    .then(item => {
      const {data} = item;
      let fetchedAppointment = data.appointment
      setAppointment({...fetchedAppointment})
      setLoading(false);
    }).catch(err => {
      console.log('Error!!!!', err)
      setLoading(false);
    })
}

export default AllAppointments