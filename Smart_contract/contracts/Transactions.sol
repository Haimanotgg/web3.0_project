// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    uint transactionCounter;

    event Transfer(address from, address receiver, uint256 amount, string message, uint timestamp, string keyword);

struct TransferStruct {
    address from;
    address receiver;
    uint amount;
    string message;
    uint timestamp;
    string keyword;
}
}

