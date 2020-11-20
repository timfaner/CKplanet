import {
    Collector,
    Amount,
    Cell,
    Script,
    OutPoint,
    AmountUnit,
  } from "@lay2/pw-core";
  
  export default class Vuex_Collector extends Collector {

    constructor(store) {
      super();
      console.log("Using vuex collector")
      this.store = store
    }

  
    async getBalance(lock_args) {
      const cells = await this.collect(lock_args,{ withData:true });
      //FIXME
      if (!cells.length) return Amount.ZERO;
      return cells
        .map((c) => c.capacity)
        .reduce((sum, cap) => (sum = sum.add(cap)));
    }
  
    async collect( lock_args,{ withData }) {
        this.cells = [];

        this.store.state.cells_pool[lock_args].empty_cells
        this.store.state.cells_pool[lock_args].filled_cells

  
      const emptyCells = this.store.state.cells_pool[lock_args].empty_cells
      const filledCells = this.store.state.cells_pool[lock_args].filled_cells
  
      
      let rawCells

      if (withData) {
        rawCells = filledCells
      }
      else{
        rawCells = emptyCells
      }


      for (let rawCell of rawCells) {
        const cell = new Cell(
          new Amount(rawCell.output.capacity, AmountUnit.shannon),
          Script.fromRPC(rawCell.output.lock),
          Script.fromRPC(rawCell.output.type),
          OutPoint.fromRPC(rawCell.out_point),
          rawCell.output_data
        );
  
        this.cells.push(cell);
      }
  

      return this.cells;
    }
  }
  