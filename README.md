<img width="1876" height="715" alt="image" src="https://github.com/user-attachments/assets/c5b92d02-d510-4383-a639-f820b471c08d" />
一个简单的FHE 使用示例

fhevm-hardhat-template

后端工程来自官方模板：
部署网络：sepolia
合约已部署地址为：0xCb4bE48b79602E8303DB1b342edDe5D6a8c2676C

ABI文件为：
const CONTRACT_ABI = [
  "function getCount() external view returns (uint256)",
  "function increment(uint32 inputEuint32, bytes inputProof) external",
  "function decrement(uint32 inputEuint32, bytes inputProof) external"
];

前端工程自定义：
nmp i 

npm run dev 
即可运行

前端工程能正常连接钱包，调用合约还有初始化FHE有一些小问题，开发者可自行解决。


ps：一些需要注意的事项
1. 后端合约编写及部署流程参考：https://docs.zama.ai/protocol/solidity-guides
2. 你可以使用hardhat来部署和调用合约测试
   $ npx hardhat deploy --network sepolia
   npx hardhat --network sepolia task:decrypt-count
   npx hardhat --network sepolia task:increment --value 1

3. 前端工程需要注意@fhevm/react@0.3.0 是找不到的，因此你需要进行如下操作：
'@fhevm/react@0.3.0' 不在此注册表中，因此您应该在 package.json 上将其删除，并将文件夹“packages/fhevm-react”复制到钩子中并替换文件 use*.tsx 中的导入：
从“@fhevm/react”导入{FhevmDecryptionSignature，类型 FhevmInstance，类型 GenericStringStorage}；
和：
从“./fhevm-react”导入{...}


这是一个用于学习的案例。
