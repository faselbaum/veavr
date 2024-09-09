import * as TypeFest from 'type-fest'
import * as Shared from './shared.js'
import * as ImplementerApi from './implementer-api.js'
import * as DeepMerge from 'ts-deepmerge'

//#region weavr

export type WeavrFunctionArgs<
  TParts extends Shared.WeavrPartsRegistry,
  TImplementerFunction extends ImplementerApi.WeavrImplementerFunction<
    TParts,
    any,
    any,
    any
  >,
> = {
  parts: TParts
  component: TImplementerFunction
}

export type WeaveFunctionArgs<
  TProps,
  TWovenProps,
  TParts extends Shared.WeavrPartsRegistry,
  TWovenParts extends Shared.WeavePartsRegistry<TParts> | undefined,
  TImplementerFunction extends ImplementerApi.WeavrImplementerFunction<
    Shared.MergePartsRegistries<TParts, TWovenParts>,
    any,
    any,
    any
  >,
> = {
  parts?: TWovenParts | undefined
  component: TImplementerFunction
} & (TWovenProps extends TProps
  ? {
      prepareProps?: ((args: TWovenProps) => TProps) | undefined
    }
  : {
      prepareProps: (args: TWovenProps) => TProps
    })

export type WeavrComponentProps<
  TParts extends Shared.WeavrPartsRegistry,
  TComponentProps,
  TBoundProps extends {
    [P in keyof TParts]?:
      | React.ComponentProps<TParts[P]>
      | Shared.PropsGenerator<TParts[P], any>
  },
  VOverrides = {
    [P in keyof TParts]?: TBoundProps[P] extends Shared.PropsGenerator<
      TParts[P],
      any
    >
      ?
          | Shared.PropsGenerator<
              TParts[P],
              Parameters<TBoundProps[P]>,
              TypeFest.PartialDeep<React.ComponentProps<TParts[P]>>
            >
          | TypeFest.PartialDeep<React.ComponentProps<TParts[P]>>
      : TypeFest.PartialDeep<React.ComponentProps<TParts[P]>>
  },
> = TComponentProps & {
  $wvr?: {
    attach?: VOverrides
    override?: VOverrides
  }
}

/**
 * WIP Type that's supposed to omit internally assigned props from the $wvr.attach interface
 */
export type WeavrComponentPropsAssignedPropsExcluded<
  TParts extends Shared.WeavrPartsRegistry,
  TComponentProps,
  TBoundProps extends {
    [P in keyof TParts]?:
      | React.ComponentProps<TParts[P]>
      | Shared.PropsGenerator<TParts[P], any>
  },
> = TComponentProps & {
  $wvr?: {
    attach?: {
      [P in keyof TParts]?: TBoundProps[P] extends Shared.PropsGenerator<
        TParts[P],
        any
      >
        ?
            | Omit<
                React.ComponentProps<TParts[P]>,
                keyof ReturnType<TBoundProps[P]>
              >
            | Shared.PropsGenerator<
                TParts[P],
                Parameters<TBoundProps[P]>,
                Omit<
                  React.ComponentProps<TParts[P]>,
                  keyof ReturnType<TBoundProps[P]>
                >
              >
        : Omit<React.ComponentProps<TParts[P]>, keyof TBoundProps[P]>
    }
    override?: {
      [P in keyof TParts]?: TBoundProps[P] extends Shared.PropsGenerator<
        TParts[P],
        any
      >
        ?
            | Shared.PropsGenerator<
                TParts[P],
                Parameters<TBoundProps[P]>,
                TypeFest.PartialDeep<React.ComponentProps<TParts[P]>>
              >
            | TypeFest.PartialDeep<React.ComponentProps<TParts[P]>>
        : TypeFest.PartialDeep<React.ComponentProps<TParts[P]>>
    }
  }
}

export type WeavrFunctionComponent<
  TParts extends Shared.WeavrPartsRegistry,
  TProps,
  TLoom extends ImplementerApi.Loom<
    { state: any; assignedProps: any },
    TParts,
    any,
    any
  >,
> = React.FunctionComponent<
  TProps &
    WeavrComponentProps<
      TParts,
      TProps,
      ReturnType<TLoom['binders']['partProps']>
    >
> & {
  weave: <TWovenProps = TProps>() => <
    TWovenParts extends Shared.WeavePartsRegistry<TParts> | undefined,
    TWeaveImplementerFunction extends ImplementerApi.WeavrImplementerFunction<
      Shared.MergePartsRegistries<TParts, NoInfer<TWovenParts>>,
      NoInfer<TWovenProps>,
      ImplementerApi.Loom<
        {
          state: ReturnType<TLoom['binders']['state']>
          assignedProps: ReturnType<TLoom['binders']['partProps']>
        },
        Shared.MergePartsRegistries<TParts, NoInfer<TWovenParts>>,
        ReturnType<TLoom['binders']['state']>,
        ReturnType<TLoom['binders']['partProps']>
      >,
      any
    >,
  >(
    args: WeaveFunctionArgs<
      TProps,
      NoInfer<TWovenProps>,
      TParts,
      TWovenParts,
      TWeaveImplementerFunction
    >
  ) => WeavrFunctionComponent<
    Shared.MergePartsRegistries<TParts, NoInfer<TWovenParts>>,
    TWovenProps,
    ReturnType<TWeaveImplementerFunction>
  >
}

export function weavr<TProps>() {
  function weavrInner<
    TParts extends Shared.WeavrPartsRegistry,
    TImplementerFunction extends ImplementerApi.WeavrImplementerFunction<
      TParts,
      TProps,
      ImplementerApi.Loom<undefined, TParts, {}, undefined>,
      any
    >,
  >(
    args: WeavrFunctionArgs<TParts, TImplementerFunction>
  ): WeavrFunctionComponent<TParts, TProps, ReturnType<TImplementerFunction>> {
    function makeFunctionComponment<TParts extends Shared.WeavrPartsRegistry>(
      weaves: (
        | WeavrFunctionArgs<any, any>
        | WeaveFunctionArgs<any, any, any, any, any>
      )[]
    ): WeavrFunctionComponent<
      TParts,
      TProps,
      ReturnType<TImplementerFunction>
    > {
      const weavrFunctionComponent: WeavrFunctionComponent<
        TParts,
        TProps,
        ReturnType<TImplementerFunction>
      > = (props) => {
        const { $wvr, ...restProps } = props
        const attachedProps: Record<PropertyKey, any> = $wvr?.attach ?? {}
        const overriddenProps: Record<PropertyKey, any> = $wvr?.override ?? {}
        const preparedProps = prepareProps(restProps, weaves)

        let loom: ImplementerApi.LoomClass<any, any, any, any> =
          new ImplementerApi.LoomClass()
        let parts: Shared.WeavrPartsRegistry = {}

        for (let i = 0; i < weaves.length; i++) {
          const weave = weaves[i]

          parts = { ...parts, ...weave.parts }
          loom = weave
            .component({ props: preparedProps[i], weavr: loom })
            .extend()
        }

        const state = loom.resolveState()
        const assignedProps = loom.resolvePartProps(state)

        const mergedPartProps = mergePartProps(
          assignedProps,
          attachedProps,
          overriddenProps
        )

        return loom.render(parts, state, mergedPartProps)
      }
      weavrFunctionComponent.weave = () =>
        ((weaveArgs: WeaveFunctionArgs<any, any, any, any, any>) => {
          return makeFunctionComponment([...weaves, weaveArgs])
        }) as any

      return weavrFunctionComponent
    }

    return makeFunctionComponment([args])
  }

  return weavrInner
}

function mergePartProps(
  innerProps: any,
  attachedProps: any,
  overrideProps: any
): any {
  const mergedGenerators = Object.keys(innerProps).reduce((acc, cur) => {
    if (typeof innerProps[cur] !== 'function') {
      return acc
    }

    return {
      ...acc,
      [cur]: mergeGeneratorProps(innerProps[cur], {
        attach: attachedProps[cur],
        override: overrideProps[cur],
      }),
    }
  }, {})

  return DeepMerge.merge(
    attachedProps ?? {},
    innerProps ?? {},
    overrideProps ?? {},
    mergedGenerators
  )
}

function mergeGeneratorProps(
  generator: Shared.PropsGenerator<any, any>,
  outerProps: Record<
    'attach' | 'override',
    Shared.PropsGenerator<any, any> | Record<PropertyKey, unknown> | undefined
  >
): Shared.PropsGenerator<any, any> {
  const newGenerator = (...args: any) => {
    const attachedProps =
      (typeof outerProps.attach === 'function'
        ? outerProps.attach(...args)
        : outerProps.attach) ?? {}

    const overriddenProps =
      (typeof outerProps.override === 'function'
        ? outerProps.override(...args)
        : outerProps.override) ?? {}

    const generatorResult = generator(...args) ?? {}

    const mergedProps = DeepMerge.merge(
      attachedProps,
      generatorResult,
      overriddenProps
    )

    console.log(mergedProps)

    return mergedProps
  }

  return newGenerator
}

function prepareProps(
  props: any,
  weaves: (
    | WeavrFunctionArgs<any, any>
    | WeaveFunctionArgs<any, any, any, any, any>
  )[]
): unknown[] {
  const result: unknown[] = Array.from(new Array(weaves.length))
  result[weaves.length - 1] = props

  let currentProps = props

  for (let i = weaves.length - 1; i >= 0; i--) {
    if (i === weaves.length - 1) {
      continue
    }

    const weave = weaves[i + 1]

    const preparedProps =
      'prepareProps' in weave && typeof weave['prepareProps'] === 'function'
        ? weave['prepareProps'](currentProps)
        : currentProps
    currentProps = preparedProps

    result[i] = preparedProps
  }

  return result
}

//#endregion

//#region weave

//#endregion

//#region loom

//#endregion
