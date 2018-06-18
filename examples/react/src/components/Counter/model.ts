import { createModel, Mutations, Actions } from 'mini-reactive'

class CounterState {
  count = 0
}

class CounterMutations extends Mutations<CounterState> {
  increase = () => {
    this.state.count++
  }
  decrease() {
    this.state.count--
  }
}

class CounterActions extends Actions<CounterState, CounterMutations> {}

export default createModel(CounterState, CounterMutations, CounterActions)
