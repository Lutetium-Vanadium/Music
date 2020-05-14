# Music

A music player written in electron

The `dev` variable in the `./src/main.ts` controls whether the app will be displayed directly from the html file or whether it shows the `localhost:1234` webpage.

If `dev === true`: <br>
&emsp;&ensp; The localhost webpage will be shown.

> This will also require to run the frontend seperately

Else: <br>
&emsp;&ensp; The html file will be shown.

## Installation

To install in linux, run the `install.sh`. If API key credentials are not already present, it will prompt you to enter them and then build all the files.
<br>
Then it will write a `[Desktop Entry]` to `~/Desktop`;

## Available Scripts

### In the `/` Directory

To run the app run:

```sh
yarn start
```

<br>
To build the frontend files:

```sh
yarn build-react
```

> This can also be done by going into the `app` folder and run `yarn build`

<br>

To build the app into an exectuable one:

```sh
yarn deploy
```

> You can run `deploy-l` specifically for Linux, `deploy-m` specifically for MacOS, and `deploy-w` specifically for Windows.

<br>
Rebuild sqlite3:

```sh
yarn fix-sqlite3
```

<br>

### In the `/app` Directory

To run the frontend:

```sh
yarn watch
```

The app will run on localhost:1234

<br>
To build the frontend

```sh
yarn build
```

## Errors

The following error may occur:

```sh
Error: Cannot find module '/path/to/project/node_modules/sqlite3/lib/binding/electron-v7.1-linux-x64/node_sqlite3.node'
```

If so run the following command:

```sh
yarn fix-sqlite3
```

Wait some time and sqlite3 will be rebuilt.
