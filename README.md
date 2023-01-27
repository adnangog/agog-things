# Agog Things

**Agog Things** is a React UI library.

## Installation

Agog Things is available as an [npm package](https://www.npmjs.com/package/agog-things).

**npm:**

```sh
npm install agog-things
```

**yarn:**

```sh
yarn add agog-things
```


## Example usage

An example of using a `TextBox` component is as follows:

```jsx
import React, { useState } from 'react'
import {TextBox, TextBoxProps} from 'agog-things'


function App() {

  const [name, setName] = useState()

  const txtName: TextBoxProps = {
    label: 'Name Surname',
    value: name,
    placeholder: 'Your name and surname',
    onChange: (value) => setName(value)
  }
  
  return <TextBox {...txtName}/>;
}
```

## Examples

For sample uses of **Agog Things** components, [please click](https://github.com/adnangog/agog-things)

## Documentation

- [Documents](https://github.com/adnangog/agog-things)

## License

This project is licensed under the terms of the
[MIT license](/LICENSE).