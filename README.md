# Deducer
This project is aimed at providing a simple but effective solution for deducing/transforming/reshaping data.

A deduction is described as the following signature `[sourcePath, destPath, ...transformFns]`, The deduce function will take an input object/array and an array of deductions, reducing each deduction and deduction transforms while migrating the data to an output object.

### Under Development
This library is currently under development as is not consisdered stable, if you are interested in supporting this project there are several key areas that require work before a stable version is available

- [ ] Finalisation of the API
- [ ] Improved typescript support
- [ ] Documentation
- [ ] Richer and more diverse tests suite.

### Install

```bash
npm install --save deducer
```

Simple Example:
```ts
import { deduce, Deduction } from "deducer"

const input = { columnA: 'valueB' };
const deductions: Deduction[] = [
    { source: 'columnA', destination: 'columnB' }
]
const result = deduce(input, deductions)
// { columbB: 'valueB' }
```

Array Example:

```ts
import { deduce, Deduction } from "deducer"

const input = ['some', 'values'];
const deductions: Deduction[] = [
    { source: 0, destination: 'zero' }
    { source: 1, destination: 'one' }
]
const result = deduce(input, deductions)
```

Deductions Example:

```ts
import { deduce, Deduction } from "deducer"

const input = { title: "Mr", firstName: "John", lastName: "Doe" };
const deductions: Deduction[] = [
    {
        source: 'title',
        destination: 'user.title'
    },
    {
        source: 'firstName',
        destination: 'user.firstName'
    },
    {
        source: 'lastName',
        destination: 'user.lastName'
    },
    {
        source: ["title", "firstName", "lastName"],
        destination: 'user.fullName',
        reducers: [
            ([title, firstName, lastName]) => `${title} ${firstName} ${lastName}`
        ]
    },
]
const result = deduce(input, deductions)
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
