# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = "1.0"

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path

# Précompiler les assets supplémentaires
Rails.application.config.assets.precompile += %w( application.css )

# Activer la compression des assets en développement pour tester
Rails.application.config.assets.css_compressor = nil

# Désactiver la concaténation des assets en développement
Rails.application.config.assets.debug = true
