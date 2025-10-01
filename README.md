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
运行nmp i 
npm run dev 即可运行

前端工程能正常连接钱包，调用合约还有初始化FHE有一些小问题，开发者可自行解决。

这是一个用于学习的案例。
