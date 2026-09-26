# Monad Metropolis — 社交注意力与文化

> **Monad Metropolis Hackathon · Social/Attention & Culture Track**
> Attention is the currency of culture. / 注意力，就是文化的货币。

一个部署在 **Monad Testnet** 上的链上「社交注意力市场」。任何人都可以把一个 meme、创作者或想法铸造成 **Signal**，社区用原生 **MON** 为其注入注意力（boost）；注意力随时间衰减，只有持续被关注的「文化动能」才会留在榜首。早期策展人获得份额并可按比例退出，创作者从每次 boost 中获得创作者费用，也能直接收到粉丝打赏（Tip）。

> ✅ 已部署合约地址：`0xc2B8675EEFeDF74C8f7b2292731d0AF0B6BC741c`

---

## 1. 项目关联

- **赛道方向 · Social/Attention & Culture**
  - 把「注意力」变成可衡量、可交易、会衰减的链上原语。
  - 把「文化」变成有动能的信号市场：热点、创作者、meme 都是资产。
  - 参考 Monad 往届获奖项目（KiSignals、StageFun、Monad.Social「Superfan」等）的思路：文化信号交易 + 创作者经济 + 粉丝支持 + 排行榜/娱乐场。
- **项目逻辑**
  - `boost`：用 MON 注入注意力 → 铸造份额 + 推高 momentum。
  - `unboost`：按比例退出 MON（1% exit fee 重新分给剩余持有者）。
  - `tip`：粉丝直接给创作者打赏（不铸份额）。
  - `creator fee`：每次 boost 的 5% 给 Signal 创建者。
  - `momentum decay`：动量按时间线性衰减（约 17%/天），实时排行。
- **视觉与逻辑统一**
  - 赛博都市暗色 UI：霓虹紫 + 金色「注意力价值」，HUD/终端字体、扫描线、粒子场。
  - 滚动式翻页体验：`scroll-snap` 全屏章节 + 顶部进度条 + 右侧页面指示点 + 章节进入时的 3D 翻页动画。
  - 每个 Signal 卡片的 glow 强度、动量条、sparkline 都直接对应链上 `momentum` 与 `pool`。

---

## 2. 主要功能

- **Live Signals 市场**：搜索、筛选，`Trending / Most boosted / Newest` 三种排序。
- **Boost / Tip / Exit**：用 MON 助推文化信号、给创作者打赏、按份额退出。
- **Create Signal**：一键铸造新的文化时刻。
- **Leaderboard**：按 `momentum`（实时注意力）或 `pool`（锁定 MON）双榜。
- **Culture Feed**：链上实时事件流（mint / boost / unboost / tip）。
- **Portfolio**：我的注意力份额、估算 MON 价值、创作者费领取。
- **链上统计**：Live signals、锁定 MON、总交易量、创作者打赏总额。

---

## 3. 目录结构

```
Monad Metropolis Hackathon/
├─ contracts/          # Solidity 合约 + Hardhat 部署脚本
│  ├─ contracts/Metropolis.sol
│  ├─ scripts/deploy.ts
│  ├─ test/Metropolis.test.ts
│  ├─ hardhat.config.ts
│  └─ .env.example
├─ frontend/           # Vite + React + Tailwind + Framer Motion
│  ├─ src/components/
│  ├─ src/hooks/useMetropolis.ts
│  ├─ src/context/WalletContext.tsx
│  ├─ src/lib/
│  └─ index.html
└─ RESEARCH.md         # 往届获奖项目参考
```

---

## 4. 快速开始

环境要求：`Node.js >= 18`、`npm`、一个支持 Monad Testnet 的钱包（MetaMask / Rabby）。

### 4.1 编译并测试合约

```bash
cd contracts
npm install
npm run build      # 编译 Solidity
npm test           # 运行本地测试
```

### 4.2 部署到 Monad Testnet（如需重新部署）

1. 复制环境变量模板并填入部署者私钥：

```bash
cd contracts
cp .env.example .env
# 编辑 .env：
# PRIVATE_KEY=0x你的部署私钥
# MONAD_RPC_URL=https://testnet-rpc.monad.xyz
```

2. 部署：

```bash
npm run deploy
```

3. 部署成功后，脚本会打印合约地址。把它填到前端：

`frontend/src/lib/deployments.ts` 中的 `METROPOLIS_ADDRESS`。

> 注：官方 RPC 偶发连接超时，若部署失败可临时改用 `https://monad-testnet.drpc.org`。

### 4.3 运行前端

```bash
cd ../frontend
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`，点击右上角 **Connect Wallet**，钱包会提示切换到 **Monad Testnet**。

---

## 5. 合约说明

`contracts/contracts/Metropolis.sol`

| 函数 | 说明 |
| --- | --- |
| `createSignal(name, uri)` | 铸造一个文化 Signal |
| `boost(id)` | 支付 MON 注入注意力，铸造注意力份额 |
| `unboost(id, shares)` | 销毁份额，按比例取回 MON |
| `tip(id)` | 给创作者直接打赏（不铸份额） |
| `claimCreatorFees(id)` | 创建者领取累计的创作者费用 |
| `topSignals(limit)` | 返回按实时 momentum 排序的榜单 |
| `previewMomentum(id)` | 查询应用衰减后的动量 |

费用参数（可在合约中通过 owner 调整）：

- 平台费 `2.5%`
- 创作者费 `5.0%`
- 退出费 `1.0%`（重新分配给剩余持有者）
- 动量衰减约 `17%/天`

---

## 6. Monad Testnet

- Chain ID：`10143`
- RPC：`https://testnet-rpc.monad.xyz`
- 原生代币：`MON`
- Explorer：`https://testnet.monadexplorer.com`

---

## 7. 演示模式

未连接钱包时，前端自动进入 **Demo mode**，展示本地模拟的 Signals 数据，方便评审直接体验 UI 与动效。连接钱包后切换为真实链上数据与交易。

---

## 8. 技术栈

- **合约**：Solidity `0.8.26`、Hardhat、ethers v6
- **前端**：Vite、React 18、TypeScript、Tailwind CSS、Framer Motion、Lucide Icons、ethers v6
- **设计系统**：Cyberpunk dark HUD，紫金「注意力价值」配色，Space Grotesk / Inter / JetBrains Mono
