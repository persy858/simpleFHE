import React, { useState } from "react";
import { ethers } from "ethers";
import { FhevmInstance, FhevmDecryptionSignature } from "../fhevm-react";

// 合约信息
const CONTRACT_ADDRESS = "0xCb4bE48b79602E8303DB1b342edDe5D6a8c2676C";
const CONTRACT_ABI = [
  "function getCount() external view returns (uint256)",
  "function increment(uint32 inputEuint32, bytes inputProof) external",
  "function decrement(uint32 inputEuint32, bytes inputProof) external"
];

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111

export default function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [voteCount, setVoteCount] = useState<number | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [instance, setInstance] = useState<FhevmInstance | null>(null);

  // 初始化 FHE SDK
  const initFhe = async (): Promise<FhevmInstance> => {
    if (!instance) {
      const i = await instance.create({
        chainId: 11155111, // Sepolia
        networkUrl: "https://sepolia.infura.io/v3/2ae99c5381a644d3bb26ff74dc20e10d" // 换成你的 RPC
      });
      setInstance(i);
      return i;
    }
    return instance;
  };

  // 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("请先安装 MetaMask");
      return;
    }
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== SEPOLIA_CHAIN_ID) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }]
      });
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const accounts: string[] = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    setAccount(accounts[0]);

    const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    setContract(_contract);

    await fetchVoteCount(_contract, signer);
  };

  // 获取票数（解密）
  const fetchVoteCount = async (
    _contract: ethers.Contract | null = contract,
    signer?: ethers.JsonRpcSigner
  ) => {
    if (!_contract || !signer) return;
    const i = await initFhe();

    const encryptedHandle: string = await _contract.getCount();

    const sig = await FhevmDecryptionSignature.loadOrSign(
      i,
      [CONTRACT_ADDRESS as `0x${string}`],
      signer,
      window.localStorage
    );

    if (!sig) return;

    const res = await i.userDecrypt(
      [{ handle: encryptedHandle, contractAddress: CONTRACT_ADDRESS as `0x${string}` }],
      sig.privateKey,
      sig.publicKey,
      sig.signature,
      sig.contractAddresses,
      sig.userAddress,
      sig.startTimestamp,
      sig.durationDays
    );

    setVoteCount(Number(res[encryptedHandle]));
  };

  // 投票
  const vote = async () => {
    if (!contract || !account) return;
    const i = await initFhe();

    const input = i.createEncryptedInput(CONTRACT_ADDRESS as `0x${string}`, account);
    input.add32(1); // 投票 +1
    const enc = await input.encrypt();

    const tx = await contract.increment(enc.handles[0], enc.inputProof);
    await tx.wait();

    await fetchVoteCount(contract);
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
