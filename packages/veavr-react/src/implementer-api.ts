import * as Shared from './shared.js'
import * as TypeFest from 'type-fest'

export interface ExtendFunction<TLoom extends Loom<any, any, any, any>> {
  (): TLoom
  <TWovenParts extends Shared.VeavePartsRegistry<TLoom['parts']> | undefined>(
    parts?: TWovenParts
  ): Loom<
    {
      assignedProps: ReturnType<TLoom['binders']['partProps']>
      state: ReturnType<TLoom['binders']['state']>
    },
    Shared.MergePartsRegistries<TLoom['parts'], TWovenParts>,
    ReturnType<TLoom['binders']['state']>,
    ReturnType<TLoom['binders']['partProps']>
  >
}

export declare const SYMB_SOURCE_TYPE: unique symbol

export type State<
  T extends Record<PropertyKey, any>,
  TWiden extends boolean = false,
  TRoot extends Record<PropertyKey, any> = T,
> = {
  [P in keyof T]: P extends `\$${infer Name}`
    ? T[P]
    : T[P] extends (...args: any) => any
      ? (
          ...args: [
            state: State<
              TRoot extends T
                ? T & (TWiden extends true ? Record<PropertyKey, any> : {})
                : TRoot
            >,
            ...Parameters<T[P]>,
          ]
        ) => ReturnType<T[P]>
      : T[P] extends Record<PropertyKey, any>
        ? State<T[P], true, TRoot>
        : T[P]
}

export type Loom<
  TBase extends
    | {
        state: unknown
        assignedProps: unknown
      }
    | undefined,
  TParts extends Shared.VeavrPartsRegistry,
  TState extends Record<PropertyKey, any>,
  TAssignedPartProps,
> = {
  baseLoom: Loom<any, any, any, any> | undefined
  parts: TParts
  binders: {
    state: (args: {
      baseState: Shared.ExtractTypeByKey<TBase, 'state', TState>
    }) => TState
    partProps: (args: {
      state: TState
      baseAssignedProps: Shared.ExtractTypeByKey<
        TBase,
        'assignedProps',
        TAssignedPartProps
      >
    }) => TAssignedPartProps
    node: (args: {
      parts: TParts
      state: TState
      assignedProps: TAssignedPartProps
    }) => React.ReactNode
  }
  bindState: <IState extends Record<PropertyKey, any> = TState>(
    bindFunc: (args: {
      baseState: State<TState, true>
    }) => State<TState & IState>
  ) => Loom<TBase, TParts, TState & IState, TAssignedPartProps>
  bindProps: <
    IAssignedPartProps extends Shared.PartPropsMap<
      TParts extends Shared.VeavrPartsRegistry ? TParts : {},
      TAssignedPartProps
    >,
  >(
    bindFunc: (args: {
      state: State<TState>
      baseAssignedProps: TAssignedPartProps
    }) => IAssignedPartProps
  ) => Loom<TBase, TParts, TState, IAssignedPartProps>
  bindNode: (
    bindFunc: (args: {
      parts: TParts
      state: State<TState>
      assignedProps: Shared.PartPropsMap<
        TParts extends Shared.VeavrPartsRegistry ? TParts : {},
        TAssignedPartProps
      > &
        TAssignedPartProps
    }) => React.ReactNode
  ) => Loom<TBase, TParts, TState, TAssignedPartProps>
  extend: ExtendFunction<Loom<TBase, TParts, TState, TAssignedPartProps>>
}

export type VeavrImplementerFunctionArgs<
  TParts extends Shared.VeavrPartsRegistry,
  TProps,
  TLoom extends Loom<
    { state: unknown; assignedProps: unknown },
    TParts,
    {},
    unknown
  >,
> = {
  props: TProps
  veavr: TLoom
}

export type VeavrImplementerFunction<
  TParts extends Shared.VeavrPartsRegistry,
  TProps,
  TInLoom extends Loom<any, TParts, any, any>,
  TReturn extends Loom<
    {
      state: ReturnType<TInLoom['binders']['state']>
      assignedProps: ReturnType<TInLoom['binders']['state']>
    },
    TParts,
    any,
    any
  >,
> = (args: VeavrImplementerFunctionArgs<TParts, TProps, TInLoom>) => TReturn

export class LoomClass<
  TBase extends
    | {
        state: unknown
        assignedProps: unknown
      }
    | undefined,
  TParts extends Shared.VeavrPartsRegistry,
  TState extends Record<PropertyKey, any>,
  TAssignedPartProps,
> implements Loom<TBase, TParts, TState, TAssignedPartProps>
{
  baseLoom: LoomClass<any, any, any, any> | undefined = undefined
  parts: TParts = {} as TParts
  binders: {
    state: (args: {
      baseState: Shared.ExtractTypeByKey<TBase, 'state', TState>
    }) => TState
    partProps: (args: {
      state: TState
      baseAssignedProps: Shared.ExtractTypeByKey<
        TBase,
        'assignedProps',
        TAssignedPartProps
      >
    }) => TAssignedPartProps
    node: (args: {
      parts: TParts
      state: TState
      assignedProps: TAssignedPartProps
    }) => React.ReactNode
  } = {
    state: undefined as any,
    partProps: undefined as any,
    node: undefined as any,
  }

  bindState: <IState extends Record<PropertyKey, any> = TState>(
    bindFunc: (args: {
      baseState: State<TState, true>
    }) => State<TState & IState>
  ) => Loom<TBase, TParts, TState & IState, TAssignedPartProps> = (
    bindFunc
  ) => {
    this.binders.state = bindFunc as any
    return this as any
  }

  bindProps: <
    IAssignedPartProps extends Shared.PartPropsMap<
      TParts extends Shared.VeavrPartsRegistry ? TParts : {},
      TAssignedPartProps
    >,
  >(
    bindFunc: (args: {
      state: State<TState>
      baseAssignedProps: TAssignedPartProps
    }) => IAssignedPartProps
  ) => Loom<TBase, TParts, TState, IAssignedPartProps> = (bindFunc) => {
    this.binders.partProps = bindFunc as any
    return this as any
  }

  bindNode: (
    bindFunc: (args: {
      parts: TParts
      state: State<TState>
      assignedProps: Shared.PartPropsMap<
        TParts extends Shared.VeavrPartsRegistry ? TParts : {},
        TAssignedPartProps
      > &
        TAssignedPartProps
    }) => React.ReactNode
  ) => Loom<TBase, TParts, TState, TAssignedPartProps> = (bindFunc) => {
    this.binders.node = bindFunc as any
    return this as any
  }

  extend: ExtendFunction<Loom<TBase, TParts, TState, TAssignedPartProps>> = <
    TWovenParts,
  >(
    parts?: TWovenParts
  ) => {
    const loom = new LoomClass<any, any, any, any>()
    loom.baseLoom = this
    loom.parts = parts
    return loom as any
  }

  resolveState(binders: (typeof this.binders)['state'][] = []): TState {
    if (this.baseLoom === undefined) {
      let result: any = this.binders.state
        ? this.binders.state({ baseState: undefined as any })
        : undefined

      for (const binder of binders) {
        result = binder!({ baseState: result })
      }

      return result
    }

    return this.baseLoom.resolveState(
      this.binders.state ? [this.binders.state, ...binders] : binders
    )
  }

  resolvePartProps(
    state: any,
    binders: (typeof this.binders)['partProps'][] = []
  ): TAssignedPartProps {
    if (this.baseLoom === undefined) {
      let result: any = this.binders.partProps
        ? this.binders.partProps({ state, baseAssignedProps: undefined as any })
        : undefined

      for (const binder of binders) {
        result = binder!({ state, baseAssignedProps: result })
      }

      return result
    }

    return this.baseLoom.resolvePartProps(
      state,
      this.binders.partProps ? [this.binders.partProps, ...binders] : binders
    )
  }

  render(parts: any, state: any, assignedProps: any): React.ReactNode {
    if (this.baseLoom === undefined) {
      return this.binders.node
        ? this.binders.node({ parts, state, assignedProps })
        : undefined
    }

    return this.baseLoom.render(parts, state, assignedProps)
  }
}
