import React, {createContext, ReactNode, useState} from 'react';
import {ethers} from 'ethers';

type WalletContextType = {
  wallets: ethers.Wallet[];
  activeIndex: number;
  provider: ethers.providers.JsonRpcProvider;
  balance: string;
  mnemonic: string;
  createAccount: () => void;
  createWallet: () => void;
  recover: (mnemonic: string) => void;
  send: (address: string, value: string) => void;
  changeWallet: (index: number) => void;
  receiveFromPrivateKey: (privateKey: string) => void;
};

export const WalletContext = createContext({} as WalletContextType);

type Props = {
  children?: ReactNode;
};

export function WalletProvider({children}: Props) {
  const provider = new ethers.providers.JsonRpcProvider(
    'http://127.0.0.1:7545',
  );
  const standardPath = "m/44'/60'/0'/0";
  const [activeIndex, setActiveIndex] = useState(-1);
  const [wallets, setWallets] = useState<ethers.Wallet[]>([]);
  const [mnemonic, setMnemonic] = useState('');
  const [balance, setBalance] = useState('0.00');

  const _setBalance = async (wallet: ethers.Wallet) => {
    const bigBalance = await wallet.getBalance();
    const newBalance = parseFloat(ethers.utils.formatEther(bigBalance));
    setBalance(
      newBalance.toFixed(
        Math.max(2, (newBalance.toString().split('.')[1] || []).length),
      ),
    );
  };

  const createWallet = async () => {
    const newIndex = wallets.length;
    setActiveIndex(newIndex);
    const path = `${standardPath}/${newIndex}`;
    const newWallet = ethers.Wallet.fromMnemonic(mnemonic, path).connect(
      provider,
    );
    setActiveIndex(newIndex);
    setWallets([...wallets, newWallet]);

    _setBalance(newWallet);
  };

  const createAccount = () => {
    const entropy = ethers.utils.randomBytes(16);
    const newMnemonic = ethers.utils.entropyToMnemonic(entropy);
    const path = `${standardPath}/0`;
    const newWallet = ethers.Wallet.fromMnemonic(newMnemonic, path).connect(
      provider,
    );
    setMnemonic(newMnemonic);
    setActiveIndex(0);
    setWallets([newWallet]);
    _setBalance(newWallet);
  };

  const recover = async (fromMnemonic: string) => {
    let newWallets: ethers.Wallet[] = [];
    for (let i = 0; i < 2; i++) {
      const path = `${standardPath}/${i}`;
      const newWallet = ethers.Wallet.fromMnemonic(fromMnemonic, path).connect(
        provider,
      );
      const transactions = await newWallet.getTransactionCount();
      const bigBalance = await newWallet.getBalance();
      const newBalance = parseFloat(ethers.utils.formatEther(bigBalance));
      if (transactions > 0 || newBalance !== 0.0) {
        newWallets.push(newWallet);
      }
    }
    setWallets(newWallets);
    if (newWallets.length > 0) {
      _setBalance(newWallets[0]);
    }
  };

  const send = async (address: string, value: string) => {
    const gasPrice = await provider.getGasPrice();
    const senderWallet = wallets[activeIndex];
    const tx = {
      from: senderWallet.address,
      to: address,
      value: ethers.utils.parseEther(value),
      gasPrice,
      nonce: provider.getTransactionCount(senderWallet.address, 'latest'),
      gasLimit: ethers.utils.hexlify(1000000),
    };
    const transaction = await senderWallet.sendTransaction(tx);
    await transaction.wait();
    _setBalance(wallets[activeIndex]);
  };

  const receiveFromPrivateKey = async (privateKey: string) => {
    const gasPrice = await provider.getGasPrice();
    const senderWallet = new ethers.Wallet(privateKey, provider);
    const tx = {
      from: senderWallet.address,
      to: wallets[activeIndex].address,
      value: ethers.utils.parseEther('5.0'),
      gasPrice,
      nonce: provider.getTransactionCount(senderWallet.address, 'latest'),
      gasLimit: ethers.utils.hexlify(1000000),
    };
    const transaction = await senderWallet.sendTransaction(tx);
    await transaction.wait();
    _setBalance(wallets[activeIndex]);
  };

  const changeWallet = (index: number) => {
    setActiveIndex(index);

    _setBalance(wallets[index]);
  };

  return (
    <WalletContext.Provider
      value={{
        wallets,
        activeIndex,
        provider,
        balance,
        mnemonic,
        createAccount,
        createWallet,
        recover,
        send,
        changeWallet,
        receiveFromPrivateKey,
      }}>
      {children}
    </WalletContext.Provider>
  );
}
