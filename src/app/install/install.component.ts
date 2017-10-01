/**
 * Install module root component
 * Display the title and progress bar in the installation process
 *
 * @module app/install/install.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdStepper } from '@angular/material';

import { ConfigStorageService } from '../shared/config-storage.service';
import { ConfigFirebase } from '../shared/config-firebase.model';
import { LoggerService } from '../shared/logger.service';

const FIREBASE_API_KEY_REGEX = /^[A-Za-z0-9_\-]+$/;
const FIREBASE_AUTH_DOMAIN_REGEX = /^[A-Za-z0-9_\-]+\.firebaseapp\.com$/;
const FIREBASE_DB_URL_REGEX = /^https:\/\/[A-Za-z0-9_\-]+\.firebaseio\.com$/;
const FIREBASE_STORAGE_BUCKET_REGEX = /^[A-Za-z0-9_\-]+\.appspot\.com$/;


@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.css']
})
export class InstallComponent {

  enableSyncFormControl: FormControl; // FormControl for enable sync md-step

  configForm: FormGroup; // Firebase remote sync config reactive form group

  @ViewChild('stepper')
  stepper: MdStepper; // Reference to stepper to trigger navigation from code

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private config: ConfigStorageService,
    private logger: LoggerService
  ) {
    this.logger.debug('InstallComponent instanced');
    this.createForms();
  }

  /**
   * Triggered on click on CTA "enable remote sync" in template
   * As it says, it enables the remote sync and redirects the user to the configuration
   * page of the Firebase remote sync
   */
  enableSync() {
    this.config.setSyncEnabled(true);
    this.enableSyncFormControl.reset();
    this.stepper.next();
  }

  /**
   * Triggered on click on CTA "disable remote sync" in template
   * As it says, it disables the remote sync and starts the notes app locally
   */
  disableSync() {
    this.config.setSyncEnabled(false);
    this.router.navigate(['/notes']);
  }

  /**
   * Create 2 forms :
   * 1. A form control to control the state of the md-step relative to enable sync step
   * 2. the reactive form to store the remote Firebase sync configuration
   */
  createForms() {
    // FormControl for the enable sync step
    this.enableSyncFormControl = new FormControl();
    this.enableSyncFormControl.setErrors({step: false});

    // FormGroup for the configure sync step
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
    this.stepper.next();
    this.router.navigate(['/notes']);
  }

  // Helper to get the apiKey form field in the template
  get apiKey(): AbstractControl { return this.configForm.get('apiKey'); }

  // Helper to get the authDomain form field in the template
  get authDomain(): AbstractControl { return this.configForm.get('authDomain'); }

  // Helper to get the databaseURL form field in the template
  get databaseURL(): AbstractControl { return this.configForm.get('databaseURL'); }

  // Helper to get the storageBucket form field in the template
  get storageBucket(): AbstractControl { return this.configForm.get('storageBucket'); }

  // Helper to get the enableAuth form field in the template
  get enableAuth(): AbstractControl { return this.configForm.get('enableAuth'); }

  // Helper to get the username form field in the template
  get username(): AbstractControl { return this.configForm.get('username'); }

  // Helper to get the password form field in the template
  get password(): AbstractControl { return this.configForm.get('password'); }
}
