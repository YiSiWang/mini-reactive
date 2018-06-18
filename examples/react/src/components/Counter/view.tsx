import * as React from "react"

interface CounterProps {
  count: number
  onIncrease: () => void
  onDecrease: () => void
}

export default class Counter extends React.Component<CounterProps, {}> {
  render() {
    return (
      <section>
        <div>Count: {this.props.count}</div>
        <button onClick={this.props.onIncrease}>Count++</button>
        <button onClick={this.props.onDecrease}>Count--</button>
      </section>
    )
  }
}
