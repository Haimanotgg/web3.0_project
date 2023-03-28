import React, {useEffect, useState} from "react";
import {ethers} from "ethers";

import { contractABI, contractAddress } from '../utils/Constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log(
        {signer,
        provider,
        transactionsContract})
}

export const TransactionProvider =({children})=>{
    return (
        <TransactionContext.provider value ={{}}>
            {children}
        </TransactionContext.provider>)

  };