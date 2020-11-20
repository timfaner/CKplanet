<template>
  <div>
    <el-progress type="dashboard" :percentage="percentage" :color="colors">
    </el-progress>
    <p>
      {{ status }}
    </p>
  </div>
</template>

<script>
export default {
  name: "TxStatusDashBoard",
  created() {
    window.document.body.addEventListener("tx-status", (e) => {
      this.status = e.detail.status;
      this.count = this.count + 1;
      if (e.detail.status === "proposed")
        this.proposed_cout = this.proposed_cout + 1;
      else if (e.detail.status === "pending")
        this.pending_count = this.pending_count + 1;
      else if (e.detail.status === "committed") this.committed === true;

      console.log(e);
      e.stopPropagation();
    });
  },
  computed: {
    percentage: function() {
      this.count;
      console.log(this.status);
      console.log(this.pending_count);
      console.log(this.proposed_cout);

      let tmp = 0;
      switch (this.status) {
        case "preparing to sign tx":
          tmp = 5;
          break;
        case "sending tx to node":
          tmp = 10;
          break;
        case "waiting to commited":
          tmp = 15;
          break;
        case "pending":
          tmp = 15 + 7 * this.pending_count;
          if (tmp > 75) {
            tmp = 75;
          }
          break;
        case "proposed":
          tmp = 75 + 6 * this.proposed_cout;
          if (tmp >= 95) {
            tmp = 95;
          }
          break;
        case "committed":
          tmp = 100;
          break;
      }

      console.log(tmp);

      return tmp;
    },
  },
  data() {
    return {
      count: "",
      status: "",
      pending_count: 0,
      proposed_cout: 0,
      committed: false,

      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#1989fa", percentage: 60 },
        { color: "#6f7ad3", percentage: 80 },
        { color: "#5cb87a", percentage: 100 },
      ],
    };
  },
  methods: {},
};
</script>
