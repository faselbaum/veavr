# veavr

Build flexible ui components.

---

veavr is a library which helps you build highly customizable ui components
featuring tight integration with TypeScript.

```
The project is still in it's early stages and should be treated as experimental.
As such veavr's API's and their documentation are not yet final.
You might encounter bugs or performance issues along the way.
If you still feel like giving it a try you're welcome.

The library is currently available for:

- react
```

## Features

- Assign props to any deeply nested element of a veavr component directly within your render path.
- Read and modify properties of any deeply nested element.
- Replace any internally used part / component.
- Read and modify internal component state.

## Get started

To get started check out the respective guide for your ui library / framework.

- React: [Getting Started](https://faselbaum.github.io/veavr/?path=/docs/react-getting-started--docs)

## Why veavr? - Component Library Maintainers

As a component library maintainer it's often impossible to predict the environments and scenarios your components are being employed in.
Sometimes there just simply might not be enough time or budget to really flesh out a component.
This can easily lead to very restrictive component interfaces and leave your users waiting for much needed patches.

Using veavr to build your components allows users to attach and override behavior which you didn't originally implement or plan for,
giving them a proper escape hatch. It also helps you keep your component interfaces simple by removing the need to explicitly declare html standard attributes on your component.
Veavr is designed to be as unintrusive as possible and makes heavy use of TypeScript's rich inference features to ensure you can focus on the implementation details.

## Why veavr? - Component Library Users

As a component library user you have probably found yourself at least once in a situation where you haven't
been able to fully use a component because it was missing some simple features or attributes.
Perhaps you needed an `onClick` or `onKeyDown` event listener being passed down to that one deeply nested element or
you require an extra element inside the component alltogether.

When such a situation arises there are few (less than optimal) options:

1. Make a change request wait for the delivery, and run the risk of missing deadlines.
2. Copy and modify the source code of the original component, adding maintenance overhead and making future upgrades harder.
3. Build a similar component from scratch, adding maintenance overhead.
4. Trim / abandon your use case, making stakeholders unhappy.
5. Use a DOM `ref` to access component internal elements, making yourself vulnerable to silent breakages and opting out of SSR.

None of those options are particulary great since they each come with their own major downsides.

Components built with veavr let you modify their internals in various ways, providing you with a proper escape hatch for when you really need it.
All while enjoying the safety benefits of TypeScript and supporting server side rendering.

## Like the Project?

I welcome donations to help fund this project.
If you like the idea of veavr and want to help ensure it's further development, consider leaving a tip on [Ko-fi](https://ko-fi.com/faselbaum). I'd appreciate it a lot 💗.
