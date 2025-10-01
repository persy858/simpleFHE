import React, { useState } from "react";
import { ethers } from "ethers";
import { FhevmInstance } from "@fhevmjs";

// 合约信息
const CONTRACT_ADDRESS = "0xCb4bE48b79602E8303DB1b342edDe5D6a8c2676C";
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "getCount",
    "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint32", "name": "inputEuint32", "type": "uint32" },
      { "internalType": "bytes", "name": "inputProof", "type": "bytes" }
    ],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint32", "name": "inputEuint32", "type": "uint32" },
      { "internalType": "bytes", "name": "inputProof", "type": "bytes" }
    ],
    "name": "decrement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111

export default function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [voteCount, setVoteCount] = useState(null);
  const [fheInstance, setFheInstance] = useState(null);

  // 初始化 FHE SDK
  const initFhe = async () => {
    if (!fheInstance) {
      const instance = await FhevmInstance.create({
        chainId: 11155111, // Sepolia
        networkUrl: "https://sepolia.infura.io/v3/2ae99c5381a644d3bb26ff74dc20e10d" // 换成你的 RPC
      });
      setFheInstance(instance);
      return instance;
    }
    return fheInstance;
  };

  // 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("请先安装 MetaMask");
      return;
    }
    try {
      // 检查网络
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      await signer.signMessage("Login to voting dApp (Sepolia)");

      const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(_contract);

      await fetchVoteCount(_contract);
    } catch (err) {
      console.error(err);
      alert("连接钱包失败: " + err.message);
    }
  };

  // 获取票数
  const fetchVoteCount = async (_contract = contract) => {
    if (!_contract) return;
    try {
      const instance = await initFhe();
      const encryptedCount = await _contract.getCount();
      const decrypted = await instance.decrypt32(encryptedCount);
      setVoteCount(decrypted);
    } catch (err) {
      console.error("获取票数失败:", err);
    }
  };

  // 投票
  const vote = async () => {
    if (!contract) {
      alert("请先连接钱包");
      return;
    }
    try {
      const instance = await initFhe();
      const { input, proof } = await instance.encrypt32(1); // 加密数字 1
      const tx = await contract.increment(input, proof);
      await tx.wait();
      await fetchVoteCount();
    } catch (err) {
      console.error("投票失败:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* 右上角连接钱包 */}
      <div className="absolute top-4 right-4">
        {account ? (
          <span className="px-4 py-2 bg-green-500 text-white rounded-lg shadow">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow"
          >
            连接钱包
          </button>
        )}
      </div>

      {/* 投票按钮 */}
      <button
        onClick={vote}
        className="w-32 h-32 rounded-full bg-green-500 text-white text-xl shadow-lg hover:bg-green-600 transition"
      >
        投票
      </button>

      {/* 总票数 */}
      <div className="mt-6 text-2xl font-bold text-gray-700">
        {voteCount !== null ? `总票数：${voteCount}` : "请连接钱包"}
      </div>
    </div>
  );
}
