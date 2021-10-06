Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/focal64"

  # first boot is so slow when running inside a VM (i.e. vm-in-vm a la Inception)
  config.vm.boot_timeout = 1800

  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 5000, host: 5000
  config.vm.network "forwarded_port", guest: 5001, host: 5001
  config.vm.network "forwarded_port", guest: 8080, host: 8080

  config.vm.synced_folder "./", "/home/vagrant/covidpass"

  # Disable the default share - we don't use it anyways.
  config.vm.synced_folder ".", "/vagrant", disabled: true

  config.vm.provider "virtualbox" do |vb|
    # Display the VirtualBox GUI when booting the machine
    # vb.gui = true

    # Customize the amount of memory on the VM:
    vb.memory = "2048"
  end

$script = <<-'SCRIPT'
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
  curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -

  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io nodejs npm google-cloud-sdk
  sudo npm install --global yarn

SCRIPT

  # Wire up the instance deployer one-time setup
  config.vm.provision "shell",
    inline: $script
end