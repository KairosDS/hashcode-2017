# hashcode-2017
Team up to solve a real-life engineering problem from Google. We are up for the challenge!


# Usage

You can call index script with the following options:

```
Usage: node index [options]

Options:
  -i, --input      input file to parse.
  -o, --output     output path to save it parsed as json.
  -p, --pretty     output prettified

```

## Examples
Input options is the default one:

```
$ node index --input data/example.in
$ node index -i data/example.in
$ node index data/example.in
```

With output path:

```
$ node index data/example.in --output .temp/example.json
$ node index data/example.in -o .temp/example.json
```

Output prettified:

```
$ node index data/example.in --pretty --output .temp/example.json
$ node index data/example.in -p -o .temp/example.json
$ node index data/example.in -po .temp/example.json
```