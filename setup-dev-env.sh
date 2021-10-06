#!/bin/bash

echo "Checking for vagrant-vbguest plugin..."
vagrant plugin list | grep -e "vagrant-vbguest" > /dev/null

if [ $? -eq 0 ]; then
  echo "vagrant-vbguest found! Skipping install..."
else
  echo "vagrant-vbguest plugin not detected, installing now..."
  vagrant plugin install vagrant-vbguest
fi

echo "Starting Vagrant VM..."
vagrant up

echo "Environment setup complete! You should now be able to 'vagrant ssh' into the running VM"