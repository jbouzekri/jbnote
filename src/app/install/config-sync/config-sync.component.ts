/**
 * Component config-sync (second and last step of the install process)
 * Display the form to configure the Firebase web based client
 *
 * @module app/install/config-sync/config-sync.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ConfigStorageService } from '../../shared/config-storage.service';
import { LoggerService } from '../../shared/logger.service';
import { ConfigFirebase } from '../../shared/config-firebase.model';

const FIREBASE_API_KEY_REGEX = /^[A-Za-z0-9_\-]+$/;
const FIREBASE_AUTH_DOMAIN_REGEX = /^[A-Za-z0-9_\-]+\.firebaseapp\.com$/;
const FIREBASE_DB_URL_REGEX = /^https:\/\/[A-Za-z0-9_\-]+\.firebaseio\.com$/;
const FIREBASE_STORAGE_BUCKET_REGEX = /^[A-Za-z0-9_\-]+\.appspot\.com$/;


@Component({
  selector: 'app-config-sync',
  templateUrl: './config-sync.component.html',
  styleUrls: ['./config-sync.component.css']
})
export class ConfigSyncComponent implements OnInit {
  @Output()
  cancel = new EventEmitter<void>(); // Event to inform parent component when user click on back button

  @Output()
  submit = new EventEmitter<void>(); // Event to inform parent component when form is submitted

  configForm: FormGroup; // Firebase remote sync config reactive form group

  /**
   * @param {FormBuilder} fb
   * @param {ConfigStorageService} config
   * @param {LoggerService} logger
   * @param {ChangeDetectorRef} cdRef
   */
  constructor(
    private fb: FormBuilder,
    private config: ConfigStorageService,
    private logger: LoggerService,
    private cdRef: ChangeDetectorRef
  ) {
    this.logger.debug('ConfigSyncComponent instanced');
    this.createForms();
  }

  /**
   * Create 2 forms :
   * 1. A form control to control the state of the md-step relative to enable sync step
   * 2. the reactive form to store the remote Firebase sync configuration
   */
  createForms() {
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

        // Prevent ExpressionChangedAfterItHasBeenCheckedError error
        // Because previous changes to the form changes interpolated variables like form.valid, ...
        this.cdRef.detectChanges();
      }
    );
  }

  /**
   * Init dynamic bindings
   */
  ngOnInit() {
    // Fill the form with values already stored or empty default value
    this.configForm.setValue(this.config.getConfig() || new ConfigFirebase());
    console.log(this.configForm);
  }

  /**
   * Triggered on form submit
   * It stores the remote sync configuration and emits an event to parent component
   */
  onSubmit() {
    this.config.setConfig(this.configForm.value);
    this.submit.emit();
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
