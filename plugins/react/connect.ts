import { Component, ComponentClass, createElement } from 'react'

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
interface Model {
  subscribe: (subscriber: (...args: any[]) => any) => () => void
}

const connect = <M extends Model, X>(model: M, mapModelToProps: (model: M) => X) => {
  return <P extends Partial<X>>(WrappedComponent: ComponentClass<P>): ComponentClass<Omit<P, keyof X>> => {
    return class Connect extends Component<Omit<P, keyof X>> {
      private cancel = model.subscribe(() => {
        this.forceUpdate()
      })
      componentWillUnmount() {
        this.cancel()
      }
      render() {
        const props = Object.assign({}, mapModelToProps(model), this.props) as any as P
        return createElement(WrappedComponent, props)
      }
    }
  }
}

export default connect
