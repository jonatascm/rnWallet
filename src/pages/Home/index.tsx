import React, {useContext, useEffect, useState, useCallback} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faHandHoldingUsd,
  faShareSquare,
  faRedo,
  faCoins,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components/native';
import {Button} from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import {WalletContext} from '../../contexts/WalletContext';
import ReceiveModal from '../../components/ReceiveModal';
import TransferModal from '../../components/TransferModal';
import RecoverModal from '../../components/RecoverModal';
import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';

const Title = styled.Text`
  font-size: 30px;
  padding: 30px 0px;
`;

const Subtitle = styled.Text`
  font-size: 20px;
  padding-bottom: 20px;
`;

const Mnemonic = styled.Text`
  font-size: 20px;
  padding-bottom: 20px;
  color: #0492c2;
`;

const BalanceContainer = styled.View`
  display: flex;
  flex-direction: row;
  padding: 30px 0px;
`;

const BalanceValue = styled.Text`
  font-size: 70px;
  padding-right: 20px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-bottom: 20px;
`;

const SafeArea = styled.SafeAreaView`
  display: flex;
  flex: 1;
  align-items: center;
`;

const BottomContainer = styled.View`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-top: 20px;
`;

const DropDownContainer = styled.View`
  width: 50%;
`;

const AccountContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  z-index: 1;
`;

const TouchableContainer = styled.TouchableOpacity`
  width: 90%;
  height: 100px;
`;

type Item = {
  label: string;
  value: number;
};

const Home: React.FC = () => {
  const {
    wallets,
    activeIndex,
    balance,
    mnemonic,
    createWallet,
    createAccount,
    changeWallet,
  } = useContext(WalletContext);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [isVisibleReceive, setIsVisibleReceive] = useState(false);
  const [isVisibleTransfer, setIsVisibleTransfer] = useState(false);
  const [isVisibleRecover, setIsVisibleRecover] = useState(false);

  const loadWallets = useCallback(async () => {
    const mappedItems = wallets.map((wallet, i) => {
      return {
        label: `${wallet.address.slice(0, 2)}${wallet.address
          .slice(2, 5)
          .toUpperCase()}...${wallet.address.slice(-5).toUpperCase()}`,
        value: i,
      };
    });
    setItems(mappedItems);
  }, [wallets]);

  useEffect(() => {
    loadWallets();
  }, [wallets, loadWallets]);

  return (
    <SafeArea>
      <Title>React-Native Wallet</Title>
      <Subtitle>Wallets</Subtitle>
      <AccountContainer>
        <DropDownContainer>
          <DropDownPicker
            open={open}
            value={activeIndex}
            items={items}
            setOpen={setOpen}
            setValue={fncValue => {
              const index = fncValue();
              changeWallet(index);
            }}
            setItems={setItems}
          />
        </DropDownContainer>
        <Button
          title="Add Wallet"
          onPress={() => createWallet()}
          icon={<FontAwesomeIcon icon={faWallet} color="#fff" size={20} />}
          titleStyle={{marginLeft: 15}}
          disabled={wallets.length === 0}
        />
      </AccountContainer>
      <BalanceContainer>
        <BalanceValue>{balance}</BalanceValue>
        <FontAwesomeIcon icon={faCoins} color="#000" size={30} />
      </BalanceContainer>
      <ButtonContainer>
        <Button
          title="Receive"
          onPress={() => setIsVisibleReceive(true)}
          icon={
            <FontAwesomeIcon icon={faHandHoldingUsd} color="#fff" size={20} />
          }
          titleStyle={{marginLeft: 15}}
        />
        <Button
          title="Transfer"
          onPress={() => setIsVisibleTransfer(true)}
          icon={<FontAwesomeIcon icon={faShareSquare} color="#fff" size={20} />}
          titleStyle={{marginLeft: 15}}
        />
      </ButtonContainer>
      <Title>Accounts</Title>
      <ButtonContainer>
        <Button
          title="Create"
          onPress={() => createAccount()}
          icon={<FontAwesomeIcon icon={faPlus} color="#fff" size={20} />}
          titleStyle={{marginLeft: 15}}
        />
        <Button
          title="Recover"
          onPress={() => setIsVisibleRecover(true)}
          icon={<FontAwesomeIcon icon={faRedo} color="#fff" size={20} />}
          titleStyle={{marginLeft: 15}}
        />
      </ButtonContainer>

      <BottomContainer>
        <TouchableContainer
          onPress={() => {
            Clipboard.setString(mnemonic);
            Snackbar.show({
              text: 'Mnemonic copied!',
            });
          }}>
          <Mnemonic>Mnemonic: {mnemonic}</Mnemonic>
        </TouchableContainer>
        <Subtitle>Connectoin: localhost</Subtitle>
      </BottomContainer>
      <ReceiveModal
        isVisible={isVisibleReceive}
        setIsVisible={setIsVisibleReceive}
      />
      <TransferModal
        isVisible={isVisibleTransfer}
        setIsVisible={setIsVisibleTransfer}
      />
      <RecoverModal
        isVisible={isVisibleRecover}
        setIsVisible={setIsVisibleRecover}
      />
    </SafeArea>
  );
};

export default Home;
