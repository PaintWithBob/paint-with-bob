#!/bin/bash

# Requires Aaron's dotfiles :p
ssrestart paintWithBobFrontendNgServe.service
ssrestart paintWithBobBackend.service
ssrestart paintWithBobStream.service
