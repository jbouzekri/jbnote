/**
 * Step1 in installation process component
 * User can choose if they want to enable remote synchronization with Firebase
 *
 * @module app/install/install-config-sync/install-config-sync.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { InstallStepComponentInterface } from '../services/install-step-component.interface';
import { ConfigStorageService } from '../../shared/config-storage.service';
import { ConfigFirebase } from '../../shared/config-firebase.model';

const FIREBASE_API_KEY_REGEX = /^[A-Za-z0-9_\-]+$/;
const FIREBASE_AUTH_DOMAIN_REGEX = /^[A-Za-z0-9_\-]+\.firebaseapp\.com$/;
const FIREBASE_DB_URL_REGEX = /^https:\/\/[A-Za-z0-9_\-]+\.firebaseio\.com$/;
const FIREBASE_STORAGE_BUCKET_REGEX = /^[A-Za-z0-9_\-]+\.appspot\.com$/;


@Component({
  selector: 'app-install-config-sync',
  templateUrl: './install-config-sync.component.html',
  styleUrls: ['./install-config-sync.component.css']
})
export class InstallConfigSyncComponent implements InstallStepComponentInterface {
  step = 50; // 50% (second and last step) in installation process

  configForm: FormGroup; // Firebase remote sync config reactive form group

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private config: ConfigStorageService
  ) {
    this.createForm();
  }

  /**
   * Create the reactive form to store the remote Firebase sync configuration
   */
  createForm() {
    this.configForm = this.fb.group({
      apiKey: [null, [Validators.required, Validators.pattern(FIREBASE_API_KEY_REGEX)] ],
      authDomain: [null, [Validators.required, Validators.pattern(FIREBASE_AUTH_DOMAIN_REGEX)] ],
      databaseURL: [null, [Validators.required, Validators.pattern(FIREBASE_DB_URL_REGEX)] ],
      storageBucket: [null, [Validators.required, Validators.pattern(FIREBASE_STORAGE_BUCKET_REGEX)] ],
      enableAuth: false,
      username: null,
      password: null
    });

    // Fill the form with values already stored or empty default value
    this.configForm.setValue(this.config.getConfig() || new ConfigFirebase());

    // Based on the chose the user does about security in Firebase
    // username / password can be mandatory or not in the form
    this.enableAuth.valueChanges.forEach(
      (authEnabled: string) => {
        if (authEnabled) {
          this.username.setValidators(Validators.required);
          this.password.setValidators(Validators.required);
        } else {
          this.username.clearValidators();
          this.username.reset();
          this.password.clearValidators();
          this.password.reset();
        }

      }
    );
  }

  /**
   * Triggered on form submit
   * It stores the remote sync configuration and redirects the user
   * to the note app
   */
  onSubmit() {
    this.config.setConfig(this.configForm.value);
    this.router.navigate(['/notes']);
  }

  // Helper to get the apiKey form field in the template
  get apiKey() { return this.configForm.get('apiKey'); }

  // Helper to get the authDomain form field in the template
  get authDomain() { return this.configForm.get('authDomain'); }

  // Helper to get the databaseURL form field in the template
  get databaseURL() { return this.configForm.get('databaseURL'); }

  // Helper to get the storageBucket form field in the template
  get storageBucket() { return this.configForm.get('storageBucket'); }

  // Helper to get the enableAuth form field in the template
  get enableAuth() { return this.configForm.get('enableAuth'); }

  // Helper to get the username form field in the template
  get username() { return this.configForm.get('username'); }

  // Helper to get the password form field in the template
  get password() { return this.configForm.get('password'); }
}
