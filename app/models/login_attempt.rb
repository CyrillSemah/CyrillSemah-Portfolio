class LoginAttempt < ApplicationRecord
  # Constantes
  MAX_ATTEMPTS = 5
  LOCK_DURATION = 1.minute # Synchronisé avec config.unlock_in dans devise.rb
  
  # Validations
  validates :ip_address, presence: true, uniqueness: true
  
  # Méthodes de classe
  class << self
    # Trouver ou créer une tentative de connexion pour une adresse IP
    def find_or_create_by_ip(ip_address)
      find_or_create_by(ip_address: ip_address)
    end
    
    # Vérifier si une adresse IP est verrouillée
    def ip_locked?(ip_address)
      attempt = find_by(ip_address: ip_address)
      attempt && attempt.locked?
    end
  end
  
  # Méthodes d'instance
  
  # Incrémenter le compteur de tentatives échouées
  def increment_failed_attempts
    self.failed_attempts += 1
    self.last_attempt_at = Time.current
    
    # Verrouiller si nécessaire
    if failed_attempts >= MAX_ATTEMPTS
      lock_access
    end
    
    save
  end
  
  # Réinitialiser le compteur de tentatives échouées
  def reset_failed_attempts
    update(failed_attempts: 0, locked_until: nil)
  end
  
  # Verrouiller l'accès
  def lock_access
    self.locked_until = Time.current + LOCK_DURATION
    save
  end
  
  # Vérifier si l'accès est verrouillé
  def locked?
    locked_until.present? && locked_until > Time.current
  end
  
  # Tentatives restantes avant verrouillage
  def attempts_remaining
    [MAX_ATTEMPTS - failed_attempts, 0].max
  end
  
  # Temps restant avant déverrouillage (en secondes)
  def time_until_unlock
    return 0 unless locked?
    (locked_until - Time.current).to_i
  end
end
