<template>
  <div id="UpdateDataServer">
    <el-form :disabled='btnloading' :model="form">

      <el-form-item label="Server ip" :label-width="formLabelWidth">
        <el-input
          v-model="data_server_ip"
          placeholder="Please enter the data server ip"

          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-collapse-transition>
          <TxStatusDashBoard v-if="showProgress"> </TxStatusDashBoard>
        </el-collapse-transition>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="btnloading"
          @click="UpdateDataServer()"

          >SAVE</el-button

        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TxStatusDashBoard from "@/components/TxStatusDashBoard.vue";
import { DataServer } from "@/ckb/data_server";

import { mapState, mapMutations } from "vuex";

export default {
  name: "UpdateDataServer",
  components: {
    TxStatusDashBoard,
  },
  computed: mapState({
    user_address: (state) => state.user_chain_info.address,
    user_lock_args: (state) => state.user_chain_info.lock_args,
  }),
  methods: {
    ...mapMutations(["dataServerConnect"]),

    UpdateDataServer: async function() {
      this.showProgress = true;
      this.btnloading = true;

      let user_ds = new DataServer(this.$store, this.user_lock_args);

      user_ds.setIp(this.data_server_ip);

      try {
        await user_ds.getDataserverAuth();
        this.dataServerConnect(true);

        await user_ds.updateDataServerInfo();
        this.$message({

          message: "Successfully connected with server information",

          type: "success",
        });

        this.showProgress = false;
        this.btnloading = false;

        this.$emit("closedialog");
      } catch (error) {
        this.showProgress = false;
        this.btnloading = false;
        this.$message.error(error.message);
      }
    },
  },
  data: function() {
    return {
      showProgress: false,
      btnloading: false,
      data_server_ip: "",
      form: null,
      formLabelWidth: "100",
      test: null,
      nickname: "",
    };
  },
  props: {},
};
</script>

<style scoped>
#UpdateDataServer {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.profile {
  text-align: left;
}

.minbutton {
  min-width: 150px;
  display: inline-block;
}
</style>
