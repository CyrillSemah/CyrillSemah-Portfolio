# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"

# Fichiers JavaScript personnalisés
pin "css_fix", to: "css_fix.js", preload: true
pin "scroll_color_change", to: "scroll_color_change.js", preload: true
pin "notifications", to: "notifications.js", preload: true
pin "tag_cloud", to: "tag_cloud.js", preload: true
pin "skill_cards", to: "skill_cards.js", preload: true
pin "skill_cards_direct", to: "skill_cards_direct.js", preload: true
pin "kebab_menu", to: "kebab_menu.js", preload: true
