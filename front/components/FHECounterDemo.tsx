"use client";

import { useFhevm } from "../fhevm-react/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { useFHECounter } from "../hooks/useFHECounter";
import { errorNotDeployed } from "./ErrorNotDeployed";
import { stringify } from "querystring";

/*
 * Main FHECounter React component with 3 buttons
 *  - "Decrypt" button: allows you to decrypt the current FHECounter count handle.
 *  - "Increment" button: allows you to increment the FHECounter count handle using FHE operations.
 *  - "Decrement" button: allows you to decrement the FHECounter count handle using FHE operations.
 */
export const FHECounterDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true, // use enabled to dynamically create the instance on-demand
  });

  //////////////////////////////////////////////////////////////////////////////
  // useFHECounter is a custom hook containing all the FHECounter logic, including
  // - calling the FHECounter contract
  // - encrypting FHE inputs
  // - decrypting FHE handles
  //////////////////////////////////////////////////////////////////////////////

  const fheCounter = useFHECounter({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage, // is global, could be invoked directly in useFHECounter hook
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // UI Stuff:
  // --------
  // A basic page containing
  // - A bunch of debug values allowing you to better visualize the React state
  // - 1x "Decrypt" button (to decrypt the latest FHECounter count handle)
  // - 1x "Increment" button (to increment the FHECounter)
  // - 1x "Decrement" button (to decrement the FHECounter)
  //////////////////////////////////////////////////////////////////////////////

  const buttonClass =
    "inline-flex items-center justify-center rounded-xl bg-black px-4 py-4 font-semibold text-white shadow-sm " +
    "transition-colors duration-200 hover:bg-blue-700 active:bg-blue-800 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const titleClass = "font-semibold text-black text-lg mt-4";

  if (!isConnected) {
    return (
      <div className="mx-auto">
        <button
          className={buttonClass}
          disabled={isConnected}
          onClick={connect}
        >
          <span className="text-4xl p-6">Connect to MetaMask</span>
        </button>
      </div>
    );
  }

  console.log(fheCounter);
  if (fheCounter.isDeployed === false) {
    return errorNotDeployed(chainId);
  }

  return (
      <div id="title" className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-100 to-gray-200">
        {/* 投票按钮 */}
        <div className="mb-8">
          <button
            className="w-36 h-36 rounded-full bg-gradient-to-r from-green-400 to-green-600 
                       text-white text-2xl font-bold shadow-lg hover:scale-105 hover:shadow-xl 
                       transition-transform duration-300 ease-in-out disabled:opacity-50 disabled:pointer-events-none"
            disabled={!fheCounter.canIncOrDec}
            onClick={() => fheCounter.incOrDec(+1)}
          >
            {fheCounter.canIncOrDec
              ? "投票"
              : fheCounter.isIncOrDec
                ? "投票中..."
                : "无法投票"}
          </button>
        </div>
    
        {/* 总票数显示卡片 */}
        <div className="w-64 text-center py-6 mb-8 rounded-2xl bg-white shadow-md border border-gray-200">
          <p className="text-gray-600 text-lg font-medium">总票数</p>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">
            {fheCounter.isDecrypted ? fheCounter.clear : "请先解密"}
          </p>
        </div>
    
        {/* 解密按钮 */}
        <div>
          <button
            className={`px-8 py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-300 ease-in-out
              ${fheCounter.isDecrypted
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg"}
              ${!fheCounter.canDecrypt ? "opacity-50 pointer-events-none" : ""}
            `}
            disabled={!fheCounter.canDecrypt}
            onClick={fheCounter.decryptCountHandle}
          >
            {fheCounter.canDecrypt
              ? "解密"
              : fheCounter.isDecrypted
                ? "解密成功"
                : fheCounter.isDecrypting
                  ? "解密中..."
                  : "无法解密"}
          </button>
        </div>
      </div>
    );
    
};

function printProperty(name: string, value: unknown) {
  let displayValue: string;

  if (typeof value === "boolean") {
    return printBooleanProperty(name, value);
  } else if (typeof value === "string" || typeof value === "number") {
    displayValue = String(value);
  } else if (typeof value === "bigint") {
    displayValue = String(value);
  } else if (value === null) {
    displayValue = "null";
  } else if (value === undefined) {
    displayValue = "undefined";
  } else if (value instanceof Error) {
    displayValue = value.message;
  } else {
    displayValue = JSON.stringify(value);
  }
  return (
    <p className="text-black">
      {name}:{" "}
      <span className="font-mono font-semibold text-black">{displayValue}</span>
    </p>
  );
}

function printBooleanProperty(name: string, value: boolean) {
  if (value) {
    return (
      <p className="text-black">
        {name}:{" "}
        <span className="font-mono font-semibold text-green-500">true</span>
      </p>
    );
  }

  return (
    <p className="text-black">
      {name}:{" "}
      <span className="font-mono font-semibold text-red-500">false</span>
    </p>
  );
}
