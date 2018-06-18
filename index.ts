type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
}

export abstract class Mutations<State> {
  protected state: State
  constructor(state: State) {
    this.state = state
  }
  commit(mutation: (state: State) => any) {
    mutation(this.state)
  }
}
export abstract class Actions<State, Mutations> {
  protected state: DeepReadonly<State>
  protected mutations: Mutations
  constructor(state: State, mutations: Mutations) {
    this.state = state as any
    this.mutations = mutations
  }
}
export const createModel = <S, M, A>(
  State: { new (): S, },
  Mutations: { new (s: S): M, },
  Actions: { new (s: S, m: M): A },
) => {
  let subscribers = [] as ((state: S) => any)[]
  let mutating = 0
  function commitify(func: Function, thisp?: any) {
    const tmp = {
      [func.name]: function (this: any, ...args: any[]) {
        mutating++
        func.apply(thisp || this, args)
        mutating--
        if (!mutating) {
          subscribers.forEach(subscriber => subscriber(state))
        }
      }
    }
    return tmp[func.name] as typeof func
  }

  const state = new State();
  const mutations = new Mutations(state);
  for (const key in mutations) {
    const mutation = (mutations as any)[key]
    if (key !== 'constructor' && typeof mutation === 'function') {
      (mutations as any)[key] = commitify(mutation, mutations)
    }
  }
  const actions = new Actions(state, mutations)

  return {
    state: state as any as DeepReadonly<S>,
    mutations: mutations,
    actions,
    subscribe(subscriber: (state: S) => any) {
      subscribers.push(subscriber)
      return () => {
        subscribers = subscribers.filter(s => s !== subscriber)
      }
    }
  }
}