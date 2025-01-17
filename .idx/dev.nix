# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    # pkgs.go
    # pkgs.python311
    # pkgs.python311Packages.pip
    pkgs.nodejs_22
    pkgs.pnpm
    pkgs.gh
    pkgs.docker
    pkgs.docker-compose
    pkgs.docker
    pkgs.postgresql_16
    # pkgs.nodePackages.nodemon
  ];

  # Services 
  services.docker = {
    enable = true;
  };

  services.postgres = {
    enable = true;
  };  

  # Sets environment variables in the workspace
  env = {
    HOST_UID = toString (builtins.getEnv "UID");
    HOST_GID = toString (builtins.getEnv "GID");
    GID = "1000"; # Or another appropriate GID
    UID = "1000"; # Or another appropriate UID
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "astro-build.astro-vscode"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        web = {
          # Example: run "npm run dev" with PORT set to IDX's defined port for previews,
          # and show it in IDX's web preview panel
          #command = ["pnpm" "hello-zero:dev:db:ui];
          manager = "web";
          env = {
            # Environment variables to set for your server
            PORT = "$PORT";
          };
        };

        #postgres = {
          #command = ["sleep" "infinity"];
          #volumes = ["/tmp/postgres-data:/var/lib/postgresql/data"];
        #};
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install JS dependencies from NPM
        # npm-install = "npm install";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Example: start a background task to watch and re-build backend code
        # watch-backend = "npm run watch-backend";
        start-postgres = "pnpm hello-zero:db-up";
      };
    };
  };
}
