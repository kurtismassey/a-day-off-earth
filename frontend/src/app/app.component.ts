import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'A Day on Earth';

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  nasaImage: string = 'https://images.ctfassets.net/cnu0m8re1exe/5rbmLp9h6Xk7WBETUO2Vui/bc9da4fdecc5ded795fa252b47d310b7/earth.jpg?fm=jpg&fl=progressive&w=660&h=433&fit=fill';
  futureDate: boolean = false;

  callCloudFunctionForNasaWithDate(date: MatDatepickerInputEvent<Date>) {
    let today = new Date();
    if (date.value && date?.value > today) {
      return this.futureDate = true;
    }
    this.futureDate = false;
    let formattedDate = this.datePipe.transform(date.value, 'YYYY-MM-dd');
    this.http.post(`https://europe-west2-a-day-on-earth.cloudfunctions.net/earth-image-cf?date=${formattedDate}`,{}).subscribe({ 
      next: (response: any) => {
      this.nasaImage = response.url
      return this.nasaImage
    }, error: (response: HttpErrorResponse) => {
      return console.error(response)
    }
  });
    return 
  }

}
