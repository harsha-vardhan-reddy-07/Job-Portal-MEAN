import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
}) 
export class OwnerComponent implements OnInit{

  ownerDisplayContent: string = 'home';

  username: string|null = localStorage.getItem('username');
  userId: string|null = localStorage.getItem('userid');

  
  constructor(private route: Router, private http: HttpClient){}
  
  
  ngOnInit(): void {
        this.fetchApplications();
        this.fetchProperties();
  }


  ownerId: string|null = localStorage.getItem('userid');
  ownerName: string|null = localStorage.getItem('username');

  description: string = '';
  carouselImage1: string = '';
  carouselImage2: string = '';
  carouselImage3: string = '';
  rent: number = 0;
  area: number = 0;
  deposit: number = 0;
  agreementDuration: number = 0;
  availableFor: string = '';
  furnished: string = '';
  address: string = '';
  
  properties: any[] = [];
  applications: any[] = []; 


  updatingPropId: string = '';
  descriptionUpdate: string = '';
  carouselImage1Update: string = '';
  carouselImage2Update: string = '';
  carouselImage3Update: string = '';
  rentUpdate: number = 0;
  areaUpdate: number = 0;
  depositUpdate: number = 0;
  agreementDurationUpdate: number = 0;
  availableForUpdate: string = '';
  furnishedUpdate: string = '';
  addressUpdate: string = '';



// fetch properties

fetchProperties(){
  this.http.get<any>('http://localhost:6001/fetch-properties').subscribe(
    (response)=>{
        this.properties = response.reverse();
        console.log(response);
    }
  )
}


// new property

newProperty(){
  this.http.post<any>('http://localhost:6001/new-property', { ownerId: this.ownerId, ownerName: this.ownerName, description: this.description , carouselImage1: this.carouselImage1, carouselImage2: this.carouselImage2, carouselImage3: this.carouselImage3, rent: this.rent, area: this.area, deposit: this.deposit, agreementDuration: this.agreementDuration, availableFor: this.availableFor, furnished: this.furnished, address: this.address}).subscribe(

    (response)=>{
      alert("new property added");
      this.fetchProperties();
      this.ownerDisplayContent = 'home';
    }
  ), (error:any)=>{
    alert('Update failed!!');
  }
}

// handle update property

handleUpdate(id: any){

  this.fetchPropertyDetails(id);
  this.ownerDisplayContent = 'update';
}

// fetch update property details

fetchPropertyDetails(id: any){
  this.http.get<any>(`http://localhost:6001/fetch-property-data/${id}`).subscribe(
    (response)=>{
      this.updatingPropId = response._id;
      this.descriptionUpdate = response.description;
      this.carouselImage1Update = response.carouselImage1;
      this.carouselImage2Update = response.carouselImage2;
      this.carouselImage3Update = response.carouselImage3;
      this.rentUpdate = response.rent;
      this.areaUpdate = response.area;
      this.depositUpdate = response.deposit;
      this.agreementDurationUpdate = response.agreementDuration;
      this.availableForUpdate = response.availableFor; 
      this.furnishedUpdate = response.furnished;
      this.addressUpdate = response.address;
    }
  )
}

// update property

updateProperty(){
  this.http.post<any>('http://localhost:6001/update-property', { propertyId: this.updatingPropId , description: this.descriptionUpdate , carouselImage1: this.carouselImage1Update, carouselImage2: this.carouselImage2Update, carouselImage3: this.carouselImage3Update, rent: this.rentUpdate, area: this.areaUpdate, deposit: this.depositUpdate, agreementDuration: this.agreementDurationUpdate, availableFor: this.availableForUpdate, furnished: this.furnishedUpdate, address: this.addressUpdate}).subscribe(

    (response)=>{
      alert("updated!!");
      this.fetchProperties();
      this.ownerDisplayContent = 'home';
    }
  ), (error:any)=>{
    alert('Update failed!!');
  }
}

// freeze property  - cancels tenent and disables from public

freezeProperty(id: any){
  this.http.put<any>('http://localhost:6001/freeze-property', {id}).subscribe(
    (response)=>{
        alert('Property freezed');
        this.fetchProperties();
    }
  )
}

// activate property

activateProperty(id: any){
  this.http.put<any>('http://localhost:6001/activate-property', {id}).subscribe(
    (response)=>{
        alert('Property activated');
        this.fetchProperties();
    }
  )
}


// fetch Applications
fetchApplications(){
  this.http.get<any>('http://localhost:6001/fetch-applications').subscribe(
    (response)=>{
        this.applications = response.reverse();
    }
  )
}
 

// Approve application

approveApplication(applicationId: any){
  this.http.put<any>('http://localhost:6001/approve-application', {applicationId}).subscribe(
    (response)=>{
        alert("Application accepted!!");
        this.fetchProperties();
        this.fetchApplications();
    }
  )
}


// Reject application

rejectApplication(applicationId: any){
  this.http.put<any>('http://localhost:6001/reject-application', {applicationId}).subscribe(
    (response)=>{
        alert("Application rejected!!");
        this.fetchProperties();
        this.fetchApplications();
    }
  )
}

// Vacate tenent

vacateTenent(propertyId:any){
  this.http.put<any>('http://localhost:6001/vacate-tenent', {propertyId}).subscribe(
    (response)=>{
      alert("Tenent vacated!!");
      this.fetchApplications();
      this.fetchProperties();
    }
  ), (error: any)=>{
    alert("Operation failed!!");
  }
}


  

  logout (){
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    this.route.navigate(['']);
  }
}
