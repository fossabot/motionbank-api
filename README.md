# libMB Feathers API

> A barebones Feathers API server.

[![Build Status](https://travis-ci.org/motionbank/libmb-feathers-api.svg?branch=master)](https://travis-ci.org/motionbank/libmb-feathers-api)
[![Maintainability](https://api.codeclimate.com/v1/badges/aa3436e39a3a07e92e56/maintainability)](https://codeclimate.com/github/motionbank/libmb-feathers-api/maintainability)

## How to use

You can fork the repo and then skip to the installation, or...

First clone the repo somewhere comfy, then disconnect it from its remote:
```shell
cd ~/
git clone https://github.com/motionbank/libmb-feathers-api.git
mv libmb-feathers-api pineapple-api
cd pineapple-api
git remote rm origin
```

Now connect it to your repo and push it there:
```shell
git remote add origin git@github.com:PieceMeta/pineapple-api.git
git push origin master
```

## Install

Edit the ``package.json`` file to set your app's name, version and URLs.

In a terminal run
```shell
npm install   # installs the metapak module
```

Now the [metapak-motionbank](https://github.com/motionbank/metapak-motionbank) module
should have set up your project, so you might need to run ``npm install`` a second
time to install the project dependencies.

You should now be the proud owner of a barebones Feathers API. Check out its
``README.md`` for more info.

## Updating

To should there be updates to the [metapak](https://github.com/motionbank/metapak-motionbank)
module, just run this and follow the screen prompts:
```shell
npm update --save-dev metapak-motionbank
```

## License

:copyright: 2017 Motion Bank / Mainz University of Applied Sciences – 
Released under the [MIT](https://github.com/motionbank/libmb-feathers-api/blob/master/LICENSE) license
