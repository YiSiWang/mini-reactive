# Mini Reactive

*Mini, reactive, model based state management*

# Quick Start

Basic usage:

```typescript
import { createModel, Mutations, Actions } from "../index"

// Define your model with state, mutations and actions.
class MyState {
  count = 1
}
class MyMutations extends Mutations<MyState> {
  increase(n: number) {
    this.state.count += n // Just mutate it. :)
  }
}
class MyActions extends Actions<MyState, MyMutations> {
  async increaseAsync(arg: number) {
    const count = await fetch(arg)
    this.mutations.increase(count)
  }
}

// Create a model and subscribe to its changes.
// (Subscribers were triggered whenever a mutation happens.)
const model = createModel(MyState, MyMutations, MyActions)
model.subscribe(state => renderComponentWith(state))

// Fire a mutation.
// (Your component automatically gets updated.)
model.mutations.increase(42)

// Do async things by calling an action.
model.actions.increaseAsync(42)
  .then(() => console.log('success'))
  .catch(() => console.log('fail'))
```

Build UI with React:

```tsx
import { PureComponent } from 'react'
import { connect } from 'mini-reactive/plugins/react'

// Write your awesome pure component.
interface Props { count: number, increase: () => void }
class MyComponent extends PureComponent<Props> {
  render() {
    return <div>
      <span>Count: {this.props.count}</span>
      <button onClick={() => this.props.increase(1)}>+1</button>
    </div>
  }
}

// Connect to your model.
const MySmartComponent = connect(model, model => {
  // Map model to props
  count: model.state.count,
  increase: model.action.increase,
})(MyComponent)

// Render it.
render = () => <MySmartComponent/>

// Now, your smart component is reactive.
model.mutations.increase(42)
```

RxJS
