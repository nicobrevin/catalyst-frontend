#! /bin/bash                                                                                                                                                                                                                                  
#                                                                                                                                                                                                                                             
# Helper script for running a command inside a dockerized node environment.
# 
# Runs as your user within your current directory using the correct version of nodejs. 
#
# Usage:
#  bin/docker-run.sh npm install
#  bin/docker-run.sh npm run start
#                                                                                                                                                                                                                                             

docker run -e HOME=$HOME --workdir $PWD --user $(id -u):$(id -g) -v $HOME:$HOME -p 8080:8080 -it docker.catalyst.net.nz/catalyst/node:16-bionic $@


