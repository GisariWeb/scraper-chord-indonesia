# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.chromium
  ];
  # Sets environment variables in the workspace
  env = {
    PUPPETEER_EXECUTABLE_PATH = "${pkgs.chromium}/bin/chromium";
    DISABLE_AUTO_OPEN = "1";
    VERCEL_TOKEN = "Z8Un8bphiKsQpN36AB1NXM6H";
    SUPABASE_URL = "https://euqjsdkwxswpcpnrieuz.supabase.co";
    SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cWpzZGt3eHN3cGNwbnJpZXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MTc0NDcsImV4cCI6MjA1MDQ5MzQ0N30.PO_axIoG--S5KapoHXFAt7iEzWqQKNR31fdcYt5zfT8";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "humao.rest-client"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
      };
      # Runs when a workspace is (re)started
      onStart= {
        run-server = "npm run dev";
      };
    };
  };
}