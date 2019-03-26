#!/usr/bin/env bash

cd test
meteor npm i
METEOR_PACKAGE_DIRS="../" MONGO_URL= ROOT_URL= TEST_BROWSER_DRIVER=chrome meteor test-packages --driver-package meteortesting:mocha ../
