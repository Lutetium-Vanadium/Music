# Music

A music app written in electron.

## Installation

To install in linux, run the `install.sh`. If API key credentials are not already present, it will prompt you to enter them and then build all the files.
<br>
Then it will write a `[Desktop Entry]` to `/usr/share/applications/` so that its available in the GUI app selector of your desktop environment.

## Few Notes

Since I use manjaro, building the project for linux only gives a pacman install file and AppImage. If using linux, you can change pacman to whatever package manager you have as per [these configuration options](https://www.electron.build/configuration/linux) in the build section of `package.json`.
Otherwise, AppImage should work for all linux distros.

Even though mac and windows settings are there, these are very basic and copied from a template. It may or may not work. You can refer to [the docs for the builder](https://www.electron.build/).

## Available Scripts

### In the `/` Directory

To run the app run in developement mode:

```sh
yarn start
```

> This requires frontend to be run seperately

<br>
To compile electron ts files:

```sh
yarn build:electron
```

<br>
To build the frontend files:

```sh
yarn build:react
```

> This can also be done by going into the `app` folder and run `yarn build`

To build all the files:

```sh
yarn build
```

> Note the above three build commands also lint the project. To build without linting use `yarn build:quiet`

<br>

To pack the app into an exectuable one:

```sh
yarn deploy
```

> You can run `deploy-l` specifically for Linux, `deploy-m` specifically for MacOS, and `deploy-w` specifically for Windows.

<br>
If files are already built, and the app just needs to be packed:

```sh
yarn dist
```

<br>
You can lint the project using:

```sh
yarn lint
```

You can also lint only frontend files with `yarn lint:react` and only backend files with `yarn lint:electron`.

<br>
Rebuild sqlite3:

```sh
yarn fix-sqlite3
```

> Note this will be required only if you are starting the app manually rather than packing it.

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

> This will also lint the frontend code. To build without linting run `yarn build:quiet`

<br>
You can also lint the frontend code from here.

```sh
yarn lint
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
