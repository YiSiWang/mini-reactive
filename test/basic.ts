import { createModel, Mutations, Actions } from "../index"

const fakeFetch = <T>(mock: T) =>
  new Promise<T>(r => setTimeout(() => r(mock), 500))

class MyState {
  foo = 1
  bar = 2
  get baz() {
    return this.foo + this.bar
  }
}
class MyMutations extends Mutations<MyState> {
  increaseFoo(n: number) {
    this.state.foo += n
  }
  increaseBar(n: number) {
    this.state.bar += n
  }
  increaseBoth(n: number) {
    this.increaseFoo(n)
    this.increaseBar(n)
  }
}
class MyActions extends Actions<MyState, MyMutations> {
  async fetchFooThenIncrease(mock: number) {
    const foo = await fakeFetch(mock)
    this.mutations.increaseFoo(foo)
    return this.state.foo
  }
  async fetchBarThenIncrease(mock: number) {
    const bar = await fakeFetch(mock)
    this.mutations.increaseFoo(bar)
    return this.state.bar
  }
  async doBoth(mock: number) {
    const foo = await this.fetchFooThenIncrease(mock)
    const bar = await this.fetchBarThenIncrease(mock)
    return foo + bar
  }
}


async function test() {
  const model = createModel(MyState, MyMutations, MyActions)
  console.assert(model.state.foo === 1 && model.state.baz === 3)

  model.mutations.increaseFoo(1)
  console.assert(model.state.foo === 2 && model.state.baz === 4)

  const p = model.actions.fetchFooThenIncrease(1)
  console.assert(p instanceof Promise && model.state.foo === 2)

  const foo = await p
  console.assert(foo === 3 && model.state.foo === 3)
}
test()
