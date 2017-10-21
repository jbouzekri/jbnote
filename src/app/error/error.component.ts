/**
 * Component used in error page
 *
 * @module app/error/error.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  // Based on the type of the error, the template is updated
  protected errorType: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.errorType = this.route.snapshot.paramMap.get('errorType');
  }
}
