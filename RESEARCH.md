# 往届获奖项目参考（Monad）

Metropolis 是 Monad 首届全球黑客松（2026.09.01–10.13，结果 11.03 公布），尚无 Metropolis 本身的历史获奖名单。以下为 Monad 生态过往获奖项目与同类产品，作为本项目的对标参考。

## 1. evm/accathon（Monad，2026.04 公布）

Top 5 获奖：`KiSignals`、`StageFun`、`OwnPay`、`Gorillionaire`、`StitchAI`。
Bounty 获奖还包括：Butter-Fi、Sheriza AI、Monfundme、Browmia、Replicant Network、Poink、AIJarvis、Rebalancr。

与 Social/Attention & Culture 强相关的提炼：

- **KiSignals**：信号/预测类产品 → 对应本项目「文化信号 + momentum 排行 + 早期策展」。
- **StageFun**：`@stagedotfun`，娱乐 launchpad / chart arena → 对应本项目「Live Signals 市场 + Leaderboard + 文化榜单」。
- **Poink / Superfan 类**：粉丝支持、注意力打赏 → 对应本项目「Tip 打赏 + 创作者费 + 粉丝经济」。

## 2. Monad.Social（社区产品）

以 `Superfan` 为卖点的社交/注意力方向：让粉丝直接支持创作者、让注意力变成可验证价值。本项目通过「Boost 铸造注意力份额 + Tip 直接打赏 + 创作者费」实现了同样的闭环。

## 3. Monad AI Hackathon（2026.03）

获奖方向：AI Agent 交易、内容生成、代理支付（OpenAlice、Orbit AI、Anime AI Studio 等）。可作为后续「AI 策展代理 / 自动交易注意力」的扩展方向，但不属于本赛道核心。

## 4. 本项目如何映射获奖共性

| 获奖项目共性 | 本项目实现 |
| --- | --- |
| 把社交/文化信号变成可交易资产 | Signal 铸造 + Boost 注意力市场 |
| 排行榜 / 娱乐场氛围 | Leaderboard（momentum / MON locked 双榜） |
| 创作者经济 | 5% 创作者费 + 直接 Tip |
| 实时、可验证的链上动态 | Culture Feed 事件流 + 链上统计 |
| 强视觉、滚动叙事体验 | scroll-snap 全屏翻页 + 3D 翻卡 + 霓虹 HUD |

## 5. 可实现性说明

- 所有核心逻辑都在链上：`createSignal / boost / unboost / tip / claimCreatorFees / topSignals`。
- 前端不依赖服务端：直接读 Monad Testnet RPC 与合约事件。
- Demo mode 保证评委在未连钱包时也能看到完整 UI 与动效。
- 后续可扩展：AI 策展代理、Signal 图片/IPFS 元数据、时间窗口排行榜、社交关系图。
