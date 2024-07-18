import ContactForm from './ContactForm'

interface Props{
  setLoading : React.Dispatch<React.SetStateAction<boolean>>
}

const Contact = ({setLoading} : Props) => {
  return (
    <div>
      <ContactForm setLoading={setLoading} />
    </div>
  )
}

export default Contact
