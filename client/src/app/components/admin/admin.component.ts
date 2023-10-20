import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  adminDisplayContent: string = 'home';

  username: string|null = localStorage.getItem('username');
  userId: string|null = localStorage.getItem('userid');

  jobs: any[] = [];
  applications: any[] = []; 
  users: any[] = [];

  displayedjobs: any[] = [];

  availablityTypeFilter: string = 'All';
  sortType: string = 'relative';


  constructor(private route: Router, private http: HttpClient){}


  ngOnInit(): void {
    this.fetchApplications();
    this.fetchjobs();
    this.fetchUsers();
}


// fetch jobs

fetchjobs(){
  this.http.get<any>('http://localhost:6001/fetch-jobs').subscribe(
    (response)=>{
        this.jobs = response.reverse();
        
        this.displayedjobs = response.reverse();

    }
  )
}

skillFilter: string = '';
locationFilter: string = '';


skillFilterChanged(event: any){
  this.locationFilter = '';
  if(event === ''){
    this.displayedjobs = this.jobs;
  }else{
    this.displayedjobs = this.jobs.filter((job:any)=> job.skills.includes(event));
  }
}

locationFilterChanged(event: any){
  this.skillFilter = '';
  if(event === ''){
    this.displayedjobs = this.jobs;
  }else{

    this.displayedjobs = this.jobs.filter((job:any)=> job.location.includes(event));
  }
}


// freeze property  - cancels tenent and disables from public

freezeJob(id: any){
  this.http.put<any>('http://localhost:6001/freeze-property', {id}).subscribe(
    (response)=>{
        alert('Property freezed');
        this.fetchjobs();
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


// fetch users

fetchUsers(){
  this.http.get<any>('http://localhost:6001/fetch-users').subscribe(
    (response)=>{
        this.users = response.reverse();
    }
  )
}



// jobs taken for rent by user

rentedCount(userId: any){
  let count = 0;
  
  this.jobs.map((property)=>{
    if(property.tenentId === userId){
      count = count + 1;
    }
  })
  return count;
}


// Applications count

applicationsCount(userId: any){
  let count = 0;
  this.applications.map((application)=>{
    if(application.applicantId === userId){
      count = count + 1
    }
  })
  return count;
}



// total jobs owned by owner

jobsPosted(userId: any){
  let count = 0;
  
  this.jobs.map((job)=>{
    if(job.companyId === userId){
      count = count + 1;
    }
  })
  return count;
}

// jobs taken for rent by user

applicationAccepted(userId: any){
  let count = 0;
  
  this.applications.map((application)=>{
    if(application.companyId === userId && application.status === "Accepted"){
      count = count + 1;
    }
  })
  return count;
  
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
