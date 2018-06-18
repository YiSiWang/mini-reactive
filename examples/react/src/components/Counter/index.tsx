import connect from 'mini-reactive/plugins/react/connect'
import model from './model'
import Counter from './view'
export default connect(model, ({ state, mutations }) => ({
  count: state.count,
  onIncrease: mutations.increase,
  onDecrease: mutations.decrease,
}))(Counter)
