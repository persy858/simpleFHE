<img width="1616" height="1080" alt="image" src="https://github.com/user-attachments/assets/953cb9e9-6479-467a-b223-c2dfbb261538" />

一个简单的FHE 使用示例， 你可以尝试加密投票并且解密总票数，非常清晰简单，易于学习和快速部署。

你可以在这里尝试：https://front-hgme7q4oe-kaiandchang-1007s-projects.vercel.app/

fhevm-hardhat-template

后端工程来自官方模板：
部署网络：sepolia
合约已部署地址为：0x00630EDf72e1d0959d350674Ce1C1baD83da6bf0



前端工程自定义：
nmp install

npm run dev 
即可运行

前端工程可以非常简单的进行加密投票和解密操作。




ps：制作过程一些经验：
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

  
这是一个用于学习的案例。帮助开发者快速理解FHE的加解密流程。

FOR ENGLISH:

A simple FHE usage example: you can try encrypting a vote and decrypting the total count.
It’s very clear, simple to learn, and easy to deploy quickly.

👉 Try it here:
https://front-hgme7q4oe-kaiandchang-1007s-projects.vercel.app/

fhevm-hardhat-template

The backend project is based on the official template:

Deployment network: Sepolia

Contract deployed at: 0x00630EDf72e1d0959d350674Ce1C1baD83da6bf0

Frontend project (custom)
npm install
npm run dev


Then you can run it.

The frontend allows very simple vote encryption and decryption operations.

Notes from the process

Backend contract development and deployment steps:
Refer to https://docs.zama.ai/protocol/solidity-guides

You can use Hardhat to deploy and test contract calls:

npx hardhat deploy --network sepolia
npx hardhat --network sepolia task:decrypt-count
npx hardhat --network sepolia task:increment --value 1


For the frontend project, note that @fhevm/react@0.3.0 is not available on npm.

Remove it from your package.json.

Copy the folder packages/fhevm-react into your project hooks, and update the imports in your use*.tsx files.

Replace:

import { FhevmDecryptionSignature, type FhevmInstance, type GenericStringStorage } from "@fhevm/react";


with the relative import from your local copy.

✅ This way, you have a minimal backend + frontend setup where you can encrypt votes and decrypt total counts using Zama’s FHE protocol.
