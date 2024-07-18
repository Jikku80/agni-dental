import style from 'styled-components';

const Slogan = style.div`
    width : 35%;
    height : fit-content;
    font-size : 50px;
    position : Absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, 50%);
    color : #4A5568;
`

const TextRight = style.p`
    text-align: right;
    line-height: 0.80;
`

const TextLeft = style.p`
  line-height: 0.80;
`

const Header = () => {
  return (
    <Slogan>
      <TextLeft>SMILE</TextLeft>
      <TextLeft className = "headActive">WITHOUT</TextLeft>
      <TextRight className = "headActive">COMPLEXES</TextRight>
      <TextRight>WITH US</TextRight>
    </Slogan>
  )
}

export default Header
