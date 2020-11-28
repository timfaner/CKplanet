<template>
  <div class="home">
    <div
      v-if="loged_in"
      class="container  col-11"
      
    >
      <div class="row">
        <h3>Planets</h3>
        <el-button
          class="ml-auto mainBtn"
          type="warning"
          @click="dialogNewCycle = true"
        >
          create planets
        </el-button>
      </div>

      <el-dialog
        title="Create New Planet"
        :visible.sync="dialogNewCycle"
        :close-on-click-modal="false"
        width="40%"
      >
        <UpdateCycleProfile
          v-on:closedialog="dialogNewCycle = false"
          mode="create"
        ></UpdateCycleProfile>
        <div slot="footer" class="dialog-footer"></div>
      </el-dialog>

      <el-tabs >
        <el-tab-pane>
          <p slot="label">My Planets ({{ cycles.ego_cycles.length }})</p>
          <div class="container">
            <CycleItem
              v-for="cycle in cycles.ego_cycles"
              :key="cycle.cycle_id"
              :cycle_profile="cycle.cycle_profile"
              :lock_args="cycle.lock_args"
              :cycle_id="cycle.cycle_id"
              :cycle_member_num="cycle.user_lists.length"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <p slot="label">Joined Planets ({{ cycles.autrui_cycles_joined.length }})</p>

          <div class="container">
            <div />
            <CycleItem
              v-for="cycle in cycles.autrui_cycles_joined"
              :key="cycle.cycle_id"
              :cycle_profile="cycle.cycle_profile"
              :lock_args="cycle.lock_args"
              :cycle_id="cycle.cycle_id"
              :cycle_member_num="cycle.user_lists.length"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <p slot="label">Pending Planets({{ cycles.autrui_cycles_pending.length }})</p>
          <div class="container">
            <div />
            <CycleItem
              v-for="cycle in cycles.autrui_cycles_pending"
              :key="cycle.cycle_id"
              :cycle_profile="cycle.cycle_profile"
              :lock_args="cycle.lock_args"
              :cycle_id="cycle.cycle_id"
              :cycle_member_num="cycle.user_lists.length"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-else>
      <p>
        please setup the wallet and dataserver and go on
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from 'vuex'
import UpdateCycleProfile from "../components/UpdateCycleProfile.vue";
import CycleItem from "../components/CycleItem.vue";

import { mapState } from "vuex";
import { DataSetter } from "@/ckb/data_handler";
import { DataServer } from "@/ckb/data_server";
import { getDataID } from "@/ckb/ckplanet";
import { isEquivalent } from "@/ckb/utils";

export default {
  name: "Home",
  computed: {
    localComputed() {
      return {
        ego_cycles_num: () => 1,
        autrui_cycles_num: () => 1,
      };
    },
    ...mapState({
      pending_cycles_num: () => 1,
      loged_in: (state) => {
        return (
          state.ckplanet.wallet_connected &&
          state.ckplanet.data_server_connected
        );
      },
      user_lock_args: (state) => state.user_chain_info.lock_args,
      join_approvals: function(state) {
        let approvals = []
        for(let ar of state.ckplanet.join_approvals){
          if (ar.to===this.user_lock_args){
            approvals.push(ar)
          }
        }
        return approvals
      },
      cycles: function(state) {
        let user_lock_args = state.user_chain_info.lock_args;
        let cycles = state.ckplanet.cycles_pool;
        let ego_cycles = [];
        let autrui_cycles_joined = [];
        let autrui_cycles_pending = [];
        let tmp = [];
        for (const lock_args in cycles) {
          for (const cycle_id in cycles[lock_args]) {
            let cycle = cycles[lock_args][cycle_id];
            cycle = { ...cycle, ...{ lock_args, cycle_id } };
            tmp.push(cycle);
          }
        }
        ego_cycles = tmp.filter(function(cycle) {
          return cycle.lock_args === user_lock_args;
        });
        autrui_cycles_joined = tmp.filter((cycle) =>{
          let joined_status = this.$store.getters.cycle_joined_status(cycle.lock_args,cycle.cycle_id)
          return cycle.lock_args !== user_lock_args  && joined_status ==="joined";
        });
        autrui_cycles_pending = tmp.filter((cycle) =>{
          let joined_status = this.$store.getters.cycle_joined_status(cycle.lock_args,cycle.cycle_id)
          return cycle.lock_args !== user_lock_args  && joined_status ==="pending";
        });
        return { ego_cycles, autrui_cycles_pending, autrui_cycles_joined};
      },
    }),
  },
  data() {
    return {
      dialogNewCycle: false,
      approval_count_tmp: 0,
    };
  },
  components: {
    CycleItem,
    UpdateCycleProfile,
  },

  created() {
    this.$watch(function() {
      return this.join_approvals.length;
    }, this.processApproval);
  },

  methods: {
    ...mapActions([
      "getJoinCyclesIndex"
      ]),
    processApproval: async function() {
      if (this.join_approvals.length > this.approval_count_tmp) {
        this.approval_count_tmp = this.join_approvals.length;

        console.debug("[process_approvals] Begin process approvals");
        let joined_cycle = this.$store.state.ckplanet.user_joined_cycles_index;

        for (let ap of this.join_approvals) {
          let k = true;
          for (let tmp of joined_cycle) {
            if (
              isEquivalent(tmp, {
                cycle_id: ap.cycle_id,
                lock_args: ap.lock_args,
              })
            ) {
              k = false;
              console.debug(`[process_approvals] ${ap.lock_args}:${ap.cycle_id} already in user_joined_list`)
              break
            }
          }
          if (ap.result === false) 
          {k = false;
          console.debug(`[process_approvals] ${ap.lock_args}:${ap.cycle_id} resualt is [${ap.result}]`)}

          if (k) {
            console.debug(`[process_approvals] prepare to add ${ap.lock_args}:${ap.cycle_id} to user_joined list`)
            await this.joinCycle(ap.lock_args, ap.cycle_id);
            this.$notify({
              title: "Notification",
              message: "New Cycle Joined",
              duration: 3000,
            });
          }

          this.$store.commit("deleteJoinApproval", ap);
        }
      } else if (this.join_approvals.length <= this.approval_count_tmp) {
        console.debug("[process_approvals] Bypass");
        this.approval_count_tmp = this.join_approvals.length;
      }
    },
    joinCycle: async function(lock_args, cycle_id) {
      let user_ds = new DataServer(this.$store, this.user_lock_args);
      let data_setter = new DataSetter(user_ds);
      let joined_cycle = this.$store.state.ckplanet.user_joined_cycles_index;

      if (lock_args === this.user_lock_args) {
        return;
      }
      if (
        this.$store.getters.cycle_joined_status(lock_args, cycle_id) !==
        "disjointed"
      ) {
        console.debug(
          `[joinCycle] ${lock_args}:${cycle_id} already in user_list`
        );
        return;
      }

      joined_cycle.push({
        lock_args,
        cycle_id,
      });

      let data_type = "user_joined_cycle_list";
      let data_id = getDataID(data_type);
      await data_setter.postData(joined_cycle, data_id, "public", false, "");

      this.getJoinCyclesIndex(this.user_lock_args).catch((e) =>
        this.$message("更新用户列表失败", e)
      );
    },
  },
};
</script>

<style>


.mainBtn{
  border-radius: 5px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  border-color: white;
}

.t1 {
  line-height: 1.7;
  font-size: 20px;
  margin-top: 4px;
}

.t2 {
  line-height: 1.5;
  font-size: 18px;
}

.t3 {
  line-height: 1.5;
  font-size: 16px;
}



.profile {
  text-align: left;
}

.minbutton {
  min-width: 150px;
  display: inline-block;
}
</style>
