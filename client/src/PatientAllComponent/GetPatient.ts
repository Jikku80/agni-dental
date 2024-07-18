import axios from 'axios';
import { SetStateAction } from 'react';

const AllPatients = async(setLoading : (value: SetStateAction<boolean>) => void, setAllPatient : (value: SetStateAction<{
    _id: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    address: string;
    age: number;
}[]>) => void, endPoint : string ) => {
    await axios.get(endPoint, {withCredentials: true})
    .then(item => {
      const {data} = item;
      let patient = data.patient
      setAllPatient({...patient})
      setLoading(false);
    }).catch(err => {
      console.log('Error!!!!', err)
      setLoading(false);
    })
}

export default AllPatients