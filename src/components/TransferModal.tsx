import React, {useContext, useState} from 'react';
import styled from 'styled-components/native';
import {Button, Input, Overlay} from 'react-native-elements';
import {WalletContext} from '../contexts/WalletContext';
import Snackbar from 'react-native-snackbar';

const Title = styled.Text`
  font-size: 30px;
`;
const Subtitle = styled.Text`
  font-size: 20px;
  padding: 20px 0px;
  text-align: center;
`;

const InputContainer = styled.View`
  display: flex;
  padding: 50px 0px;
`;

type Prop = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

const TransferModal: React.FC<Prop> = ({isVisible, setIsVisible}) => {
  const {wallets, activeIndex, send} = useContext(WalletContext);
  const [address, setAddress] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [errorValue, setErrorValue] = useState(false);

  const sendValue = async () => {
    let err = false;
    if (address === '') {
      setError(true);
      err = true;
    }
    if (value === '') {
      setErrorValue(true);
      err = true;
    }
    if (err) {
      return;
    }

    await send(address, value);
    Snackbar.show({
      text: `${value} sent!`,
    });
  };

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      overlayStyle={{width: '90%', padding: 30}}>
      <Title>Transfer</Title>
      <Subtitle>Insert wallet address to transfer</Subtitle>
      <InputContainer>
        <Input
          value={address}
          placeholder="Address"
          onChangeText={value => setAddress(value)}
          errorStyle={{color: 'red'}}
          errorMessage={error ? 'Enter a private key' : ''}
        />
        <Input
          value={value}
          placeholder="Value"
          onChangeText={value => setValue(value)}
          errorStyle={{color: 'red'}}
          errorMessage={errorValue ? 'Enter a value' : ''}
        />
      </InputContainer>
      <Button
        title="Send to address"
        onPress={sendValue}
        titleStyle={{marginLeft: 15}}
        disabled={!wallets[activeIndex]}
      />
    </Overlay>
  );
};

export default TransferModal;
