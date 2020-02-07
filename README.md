# Transformer
This project is aimed at providing a simple but effective solution for transforming/reshaping both data structure and values using a declarative approach.

A transform is described as the following signature `[sourcePath, destPath, transformFn, ...transformFns]`, The transform function will take an input object or array and allow you to reshape that input data into an object that is constructed based on a list of transforms

### Install

```bash
npm install github:robertpitt/transformer#master
```

Simple Example:
```ts
import { transform } from "<project-name-tbd>"

const input = { columnA: 'valueB' };
const transforms = [
    ['columnA', 'columnB']
]
const result = transform(input, transforms)
// { columbB: 'valueB' }
```

Array Example:

```ts
import { transform } from "<project-name-tbd>"

const input = ['some', 'values'];
const transforms = [
    [0, 'zero'],
    [1, 'one']
]
const result = transform(input, transforms)
```

Transform Example:

```ts
import { transform } from "<project-name-tbd>"

const input = { title: "Mr", firstName: "John", lastName: "Doe" };
const transforms = [
    ["title", 'user.title'],
    ["firstName", 'user.firstName'],
    ["lastName", 'user.lastName'],
    [
        ["title", "firstName", "lastName"],
        'user.fullName',
        ([title, firstName, lastName]) => `${title} ${firstName} ${lastName}`
    ],
]
const result = transform(input, transforms)
// { user: { title: "Mr", firstName: "John", lastName: "Doe", fullName: "Mr John Doe"  }}
```

### NPM scripts

 - `npm t`: Run test suite
 - `npm start`: Run `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generate bundles and typings, create docs
 - `npm run lint`: Lints code
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)
