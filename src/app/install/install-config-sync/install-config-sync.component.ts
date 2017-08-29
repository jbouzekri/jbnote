import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InstallStepComponentInterface } from '../install-step-component.interface';
import { ConfigStorageInterface } from '../../shared/config-storage.interface';
import { ConfigFirebase } from '../../shared/config-firebase.model';
import { Router } from '@angular/router';

const FIREBASE_API_KEY_REGEX = /^[A-Za-z0-9_\-]+$/;
const FIREBASE_AUTH_DOMAIN_REGEX = /^[A-Za-z0-9_\-]+\.firebaseapp\.com$/;
const FIREBASE_DB_URL_REGEX = /^https:\/\/[A-Za-z0-9_\-]+\.firebaseio\.com$/;
const FIREBASE_STORAGE_BUCKET_REGEX = /^[A-Za-z0-9_\-]+\.appspot\.com$/;

@Component({
  selector: 'app-install-config-sync',
  templateUrl: './install-config-sync.component.html',
  styleUrls: ['./install-config-sync.component.css']
})
export class InstallConfigSyncComponent implements OnInit, InstallStepComponentInterface {
  step = 50;

  configForm: FormGroup;

  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    @Inject('ConfigStorageInterface') protected config: ConfigStorageInterface
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

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

    this.configForm.setValue(this.config.getConfig() || new ConfigFirebase());

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

  onSubmit() {
    this.config.setConfig(this.configForm.value);
    this.router.navigate(['/notes']);
  }

  get apiKey() { return this.configForm.get('apiKey'); }

  get authDomain() { return this.configForm.get('authDomain'); }

  get databaseURL() { return this.configForm.get('databaseURL'); }

  get storageBucket() { return this.configForm.get('storageBucket'); }

  get enableAuth() { return this.configForm.get('enableAuth'); }

  get username() { return this.configForm.get('username'); }

  get password() { return this.configForm.get('password'); }
}
