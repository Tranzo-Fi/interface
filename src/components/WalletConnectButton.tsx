import React from 'react'
import { Button } from 'rebass/styled-components'
import styled from 'styled-components'

type Props = {}

// const WalletButton = styled.div`
//    width: 100%;
//    height: 30px;
//    background-color: ${props => props.theme.colors.flash};
//    color: ${props => props.theme.colors.white};
//    text-align: center;
//    padding: 10px 20px 30px 20px;
//    border-radius: 5px;

//    :hover {
//     cursor: pointer;
//     background-color: ${props => props.theme.colors.fadedFalsh};
//    }
// `;

const WalletConnectButton = (props: Props) => {
  return (
    <Button  
    color={'white'}
    bg={'flash'}
    height={45}
    sx={{
        border: `1.5px solid #6462de`,
        ':hover': {
          backgroundColor: 'fadedFlash',
          cursor: 'pointer'
        }
      }} onClick={()=>console.log('eh')}>Connect Wallet</Button>
  )
}

export default WalletConnectButton