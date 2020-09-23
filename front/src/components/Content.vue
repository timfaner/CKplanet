<template>
<div class="py-2">
    <div class="row mx-2 my-2">
        <el-avatar   shape="square"  :size=50 :src="url"></el-avatar>
        
        <div class="content mx-4 border px-3 py-3 col-10" style="border-radius: 5px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: #EBEEF5">
        <div class="row">
        <h5 class="ml-3"> vitalik buterin 发表了 以太坊白皮书
        </h5>
        <div class="ml-auto mr-2">
        <el-popover
            placement="top"
            width="160"
            v-model="visible">
            <p>确定删除吗这条动态吗？</p>
            <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
            </div>
            <el-button slot="reference"  type="text" icon="el-icon-delete"></el-button>
        </el-popover>
            </div>
        </div>
        <p>
            当中本聪在2009年1月启动比特币区块链时，他同时向世界引入了两种未经测试的革命性的新概念。第一种就是比特币（bitcoin），一种去中心化的点对点的网上货币，在没有任何资产担保、内在价值或者中心发行者的情况下维持着价值。到目前为止，比特币已经吸引了大量的公众注意力，就政治方面而言它是一种没有中央银行的货币并且有着剧烈的价格波动。然而，中本聪的伟大试验还有与比特币同等重要的一部分：基于工作量证明的区块链概念使得人们可以就交易顺序达成共识。作为应用的比特币可以被描述为一个先申请（first-to-file）系统：如果某人有50BTC并且同时向A和B发送这50BTC，只有被首先被确认的交易才会生效。没有固有方法可以决定两笔交易哪一笔先到，这个问题阻碍了去中心化数字货币的发展许多年。中本聪的区块链是第一个可靠的去中心化解决办法。现在，开发者们的注意力开始迅速地转向比特币技术的第二部分，区块链怎样应用于货币以外的领域。
        </p>
        </div>

    </div>
    </div>
</template>

<script>
export default {
  name: 'Content',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
