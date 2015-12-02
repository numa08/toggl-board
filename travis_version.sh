#!/bin/bash

set +e
v=$(cat package.json | jq -r .version)
if [[ -n "${TRAVIS_TAG}" ]];then
	echo "${v}"
else
	echo "${v}-unstable-${TRAVIS_BUILD_NUMBER}"
fi