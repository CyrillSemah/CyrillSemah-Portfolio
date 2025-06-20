require "test_helper"

class SecurityMailerTest < ActionMailer::TestCase
  test "suspicious_login_attempt" do
    mail = SecurityMailer.suspicious_login_attempt
    assert_equal "Suspicious login attempt", mail.subject
    assert_equal [ "to@example.org" ], mail.to
    assert_equal [ "from@example.com" ], mail.from
    assert_match "Hi", mail.body.encoded
  end
end
