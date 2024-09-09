import * as TypeFest from 'type-fest'
import * as Shared from './shared.js'
import * as ImplementerApi from './implementer-api.js'
import * as DeepMerge from 'ts-deepmerge'

//#region veavr

export type VeavrFunctionArgs<
  TParts extends Shared.VeavrPartsRegistry,
  TImplementerFunction extends ImplementerApi.VeavrImplementerFunction<
    TParts,
    any,
    any,
    any
  >,
> = {
  parts: TParts
  component: TImplementerFunction
}

export type VeaveFunctionArgs<
  TProps,
  TWovenProps,
  TParts extends Shared.VeavrPartsRegistry,
  TWovenParts extends Shared.VeavePartsRegistry<TParts> | undefined,
  TImplementerFunction extends ImplementerApi.VeavrImplementerFunction<
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

export type VeavrComponentProps<
  TParts extends Shared.VeavrPartsRegistry,
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
  $vvr?: {
    attach?: VOverrides
    override?: VOverrides
  }
}

/**
 * WIP Type that's supposed to omit internally assigned props from the $vvr.attach interface
 */
export type VeavrComponentPropsAssignedPropsExcluded<
  TParts extends Shared.VeavrPartsRegistry,
  TComponentProps,
  TBoundProps extends {
    [P in keyof TParts]?:
      | React.ComponentProps<TParts[P]>
      | Shared.PropsGenerator<TParts[P], any>
  },
> = TComponentProps & {
  $vvr?: {
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

export type VeavrFunctionComponent<
  TParts extends Shared.VeavrPartsRegistry,
  TProps,
  TLoom extends ImplementerApi.Loom<
    { state: any; assignedProps: any },
    TParts,
    any,
    any
  >,
> = React.FunctionComponent<
  TProps &
    VeavrComponentProps<
      TParts,
      TProps,
      ReturnType<TLoom['binders']['partProps']>
    >
> & {
  veave: <TWovenProps = TProps>() => <
    TWovenParts extends Shared.VeavePartsRegistry<TParts> | undefined,
    TVeaveImplementerFunction extends ImplementerApi.VeavrImplementerFunction<
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
    args: VeaveFunctionArgs<
      TProps,
      NoInfer<TWovenProps>,
      TParts,
      TWovenParts,
      TVeaveImplementerFunction
    >
  ) => VeavrFunctionComponent<
    Shared.MergePartsRegistries<TParts, NoInfer<TWovenParts>>,
    TWovenProps,
    ReturnType<TVeaveImplementerFunction>
  >
}

export function veavr<TProps>() {
  function veavrInner<
    TParts extends Shared.VeavrPartsRegistry,
    TImplementerFunction extends ImplementerApi.VeavrImplementerFunction<
      TParts,
      TProps,
      ImplementerApi.Loom<undefined, TParts, {}, undefined>,
      any
    >,
  >(
    args: VeavrFunctionArgs<TParts, TImplementerFunction>
  ): VeavrFunctionComponent<TParts, TProps, ReturnType<TImplementerFunction>> {
    function makeFunctionComponment<TParts extends Shared.VeavrPartsRegistry>(
      veaves: (
        | VeavrFunctionArgs<any, any>
        | VeaveFunctionArgs<any, any, any, any, any>
      )[]
    ): VeavrFunctionComponent<
      TParts,
      TProps,
      ReturnType<TImplementerFunction>
    > {
      const veavrFunctionComponent: VeavrFunctionComponent<
        TParts,
        TProps,
        ReturnType<TImplementerFunction>
      > = (props) => {
        const { $vvr, ...restProps } = props
        const attachedProps: Record<PropertyKey, any> = $vvr?.attach ?? {}
        const overriddenProps: Record<PropertyKey, any> = $vvr?.override ?? {}
        const preparedProps = prepareProps(restProps, veaves)

        let loom: ImplementerApi.LoomClass<any, any, any, any> =
          new ImplementerApi.LoomClass()
        let parts: Shared.VeavrPartsRegistry = {}

        for (let i = 0; i < veaves.length; i++) {
          const veave = veaves[i]

          parts = { ...parts, ...veave.parts }
          loom = veave
            .component({ props: preparedProps[i], veavr: loom })
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
      veavrFunctionComponent.veave = () =>
        ((veaveArgs: VeaveFunctionArgs<any, any, any, any, any>) => {
          return makeFunctionComponment([...veaves, veaveArgs])
        }) as any

      return veavrFunctionComponent
    }

    return makeFunctionComponment([args])
  }

  return veavrInner
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
  veaves: (
    | VeavrFunctionArgs<any, any>
    | VeaveFunctionArgs<any, any, any, any, any>
  )[]
): unknown[] {
  const result: unknown[] = Array.from(new Array(veaves.length))
  result[veaves.length - 1] = props

  let currentProps = props

  for (let i = veaves.length - 1; i >= 0; i--) {
    if (i === veaves.length - 1) {
      continue
    }

    const veave = veaves[i + 1]

    const preparedProps =
      'prepareProps' in veave && typeof veave['prepareProps'] === 'function'
        ? veave['prepareProps'](currentProps)
        : currentProps
    currentProps = preparedProps

    result[i] = preparedProps
  }

  return result
}

//#endregion

//#region veave

//#endregion

//#region loom

//#endregion
