less-css
=============

# Description

Less CSS rules, same experience

# Usage

To install less-css from npm, run:

```
$ npm install -g less-css
```

```node ./bin/less-css --help```

# License

Copyright (c) 2014 Peter Abraham

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

#Known Limitations

 1. media query support is limited and works if
    * all conditions must contain identical media features in identical order using identical punctuation (e.g. ```@media screen only and (min-width:320px) and (max-width:479px)```
    * values used in media feature condition are lower than 1000px
 2. a set of properties and relevant shorthand properties are not able to merge, e.g. these 2 rules are not identical:
`div { border: 1px solid red}`
```css
div {
  border-top:1px solid red;
  border-bottom:1px solid red;
  border-left:1px solid red;
  border-right:1px solid red;
}
```
 
# Acknowledgments

Built using [generator-commader](https://github.com/Hypercubed/generator-commander).
