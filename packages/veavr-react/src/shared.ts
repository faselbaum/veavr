import { HasRequiredKeys, ConditionalKeys } from 'type-fest'
import { ToPath } from 'type-fest/source/get.js'

export type VeavePartsRegistry<TBase extends VeavrPartsRegistry> = Partial<
  Record<
    keyof TBase,
    React.ComponentType<any> | keyof React.JSX.IntrinsicElements
  >
>

export type VeavrPartsRegistry = Record<
  PropertyKey,
  React.ComponentType<any> | keyof React.JSX.IntrinsicElements
>

export type MergePartsRegistries<
  TParts extends VeavrPartsRegistry,
  TWovenParts extends VeavePartsRegistry<TParts> | undefined,
> =
  Exclude<TWovenParts, undefined> extends never
    ? TParts
    : Omit<TParts, keyof TWovenParts> & {
        [P in keyof TWovenParts]: TWovenParts[P] extends undefined
          ? TParts[P]
          : TWovenParts[P]
      }

export type PropsGenerator<
  TPart extends React.ComponentType<any> | keyof React.JSX.IntrinsicElements,
  TArgs extends any[],
  TOut = undefined,
> = (
  ...args: TArgs
) => TOut extends undefined ? React.ComponentProps<TPart> : TOut

export type KeysOfPropsGenerators<T> = ConditionalKeys<
  T,
  PropsGenerator<any, any>
>

export type PartPropsMap<
  TParts extends VeavrPartsRegistry,
  TAssignedPartProps,
> = TAssignedPartProps extends undefined
  ? {
      [P in keyof TParts]?:
        | React.ComponentProps<TParts[P]>
        | PropsGenerator<TParts[P], any>
    } & {
      [R in ConditionalKeys<
        {
          [P in keyof TParts]: HasRequiredKeys<
            React.ComponentProps<TParts[P]>
          > extends false
            ? true
            : never
        },
        never
      >]-?: React.ComponentProps<TParts[R]> | PropsGenerator<TParts[R], any>
    }
  : Omit<
      PartPropsMap<TParts, undefined>,
      KeysOfPropsGenerators<TAssignedPartProps>
    > & {
      [P in KeysOfPropsGenerators<TAssignedPartProps>]: TAssignedPartProps[P] extends PropsGenerator<
        any,
        any
      >
        ? PropsGenerator<TParts[P], Parameters<TAssignedPartProps[P]>>
        : never
    }

export type BindStateFunction<TState> = () => TState

export type ExtractTypeByKey<
  TArg extends Record<PropertyKey, unknown> | undefined,
  TKey extends PropertyKey | undefined = undefined,
  TDefault = undefined,
> =
  TArg extends Record<PropertyKey, unknown>
    ? TArg[TKey extends PropertyKey ? TKey : never]
    : TDefault
