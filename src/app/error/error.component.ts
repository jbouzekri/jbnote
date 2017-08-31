import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  protected errorType: string;

  constructor(private route: ActivatedRoute) {
    this.errorType = this.route.snapshot.paramMap.get('errorType');
  }

  ngOnInit() {
  }
}
