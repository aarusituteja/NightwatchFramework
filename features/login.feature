@core @backend
Feature: Create a Basic page with minimal fields
Scenario: As a content admin I want to create a Minimal page in the Back end with default banner fields
  Given I log into the CMS as "admin"
  Then I am on the backend page "/user/login"